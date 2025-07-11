import { z } from "zod";
import { Agent } from "../../agent";
import { type McpTool } from "../../types";
import { getLatestPriceUpdates, searchPriceFeeds } from "../../tools/pyth/price";
import { getPythFeedsForSymbols, getNativeTokenPythFeed, searchPythSymbols } from "../../tools/pyth/symbol-mappings";

export const GetTokenPricesBySymbolsTool: McpTool = {
    name: "get_token_prices_by_symbols",
    description: "Get token prices using symbols - Pyth for supported tokens, fallback instructions for others",
    schema: {
        symbols: z.array(z.string()).describe("Array of token symbols (e.g., ['BTC', 'ETH', 'USDC'])"),
        currency: z.string().optional().default("USD").describe("Currency for pricing")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const { symbols, currency = "USD" } = input;

        // Split symbols between Pyth-supported and others
        const { pythFeeds, noditSymbols } = getPythFeedsForSymbols(symbols);

        const results = [];
        const execution_plan = [];

        // Handle Pyth-supported tokens
        if (pythFeeds.length > 0) {
            execution_plan.push({
                step: execution_plan.length + 1,
                action: "Get prices from Pyth for supported symbols",
                tool: "pyth_get_prices",
                parameters: {
                    priceIds: pythFeeds.map(feed => feed.feedId)
                },
                symbols_covered: pythFeeds.map(feed => `${feed.symbol} (${feed.description})`)
            });

            try {
                const pythResult = await getLatestPriceUpdates(pythFeeds.map(feed => feed.feedId));
                
                if (pythResult.success && pythResult.prices) {
                    pythResult.prices.forEach((price, index) => {
                        const feed = pythFeeds[index];
                        if (feed) {
                            results.push({
                                source: "pyth",
                                symbol: feed.symbol,
                                description: feed.description,
                                price: price.price,
                                currency: "USD",
                                last_updated: price.publishTime,
                                feed_id: feed.feedId
                            });
                        }
                    });
                }
            } catch (error) {
                execution_plan.push({
                    step: execution_plan.length + 1,
                    action: "Pyth price fetch failed, add to fallback",
                    error: error instanceof Error ? error.message : 'Unknown error',
                    fallback_symbols: pythFeeds.map(feed => feed.symbol)
                });
                
                // Add failed Pyth symbols to other symbols for fallback
                noditSymbols.push(...pythFeeds.map(feed => feed.symbol));
            }
        }

        // Handle symbols not supported by Pyth
        if (noditSymbols.length > 0) {
            execution_plan.push({
                step: execution_plan.length + 1,
                action: "Search and get prices for remaining symbols using token intelligence tools",
                symbols: noditSymbols,
                recommendations: [
                    {
                        tool: "token_search_by_name",
                        purpose: "Find contract addresses for symbols",
                        parameters: {
                            query: "symbol_from_list",
                            chain: "ethereum", // or user-specified chain
                            limit: 5
                        }
                    },
                    {
                        tool: "cached_nodit_api", 
                        purpose: "Get prices once contract addresses are resolved",
                        parameters: {
                            operation_id: "getTokenPricesByContracts",
                            protocol: "ethereum", // or user-specified chain
                            network: "mainnet",
                            request_body: {
                                contractAddresses: "resolved_from_search",
                                currency: currency
                            }
                        }
                    }
                ]
            });

            results.push({
                source: "manual_resolution_needed",
                action: "Resolve symbols to contract addresses then get prices",
                symbols: noditSymbols,
                instruction: "Use token_search_by_name for each symbol to find contract addresses, then use cached_nodit_api with getTokenPricesByContracts"
            });
        }

        return {
            status: "success",
            task: "symbol_based_pricing",
            message: "💎 Symbol-Based Token Pricing - Pyth + Manual Resolution",
            
            overview: {
                total_symbols: symbols.length,
                pyth_supported: pythFeeds.length,
                manual_resolution_needed: noditSymbols.length,
                currency
            },

            execution_plan,

            price_results: results,

            optimization_summary: {
                pyth_coverage: `${pythFeeds.length}/${symbols.length} symbols (${Math.round(pythFeeds.length / symbols.length * 100)}%)`,
                instant_prices: pythFeeds.length > 0 ? `Got ${pythFeeds.length} prices instantly via Pyth` : "No instant prices available",
                manual_work: noditSymbols.length > 0 ? `${noditSymbols.length} symbols need contract address resolution` : "No manual work needed"
            },

            next_steps: noditSymbols.length > 0 ? [
                "For each unsupported symbol, use token_search_by_name to find contract addresses",
                "Collect all contract addresses and use cached_nodit_api with getTokenPricesByContracts",
                "Merge Pyth results with Nodit results for complete price data"
            ] : [
                "All prices obtained from Pyth instantly",
                "No additional steps needed"
            ]
        };
    }
};

export const GetNativeTokenPriceByChainTool: McpTool = {
    name: "get_native_token_price_by_chain",
    description: "Get native token price for a specific chain using symbols and Pyth feeds",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain network")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const { chain } = input;

        const nativeFeed = getNativeTokenPythFeed(chain);
        
        if (!nativeFeed) {
            return {
                status: "error",
                message: `No Pyth feed available for ${chain} native token`,
                chain,
                suggestion: "Use token_search_by_name to find the native token contract address, then use cached_nodit_api"
            };
        }

        try {
            const result = await getLatestPriceUpdates([nativeFeed.feedId]);
            
            if (!result.success || !result.prices || result.prices.length === 0) {
                return {
                    status: "error",
                    message: result.error || "No price data available",
                    chain,
                    symbol: nativeFeed.symbol,
                    feed_id: nativeFeed.feedId
                };
            }

            const price = result.prices[0];
            
            return {
                status: "success",
                chain,
                native_token: {
                    symbol: nativeFeed.symbol,
                    description: nativeFeed.description,
                    price: price.price,
                    currency: "USD",
                    last_updated: price.publishTime,
                    feed_id: nativeFeed.feedId,
                    source: "pyth"
                },
                
                cost_calculation_ready: true,
                usage_examples: {
                    gas_cost_usd: `gas_amount_in_${nativeFeed.symbol.toLowerCase()} * ${price.price}`,
                    savings_calculation: `(old_gas - new_gas) * ${price.price}`,
                    transaction_cost: `gas_used * gas_price_gwei * 1e-9 * ${price.price}`
                }
            };

        } catch (error) {
            return {
                status: "error",
                message: error instanceof Error ? error.message : "Unknown error",
                chain,
                symbol: nativeFeed.symbol,
                feed_id: nativeFeed.feedId
            };
        }
    }
};

export const SearchTokenSymbolsTool: McpTool = {
    name: "search_token_symbols",
    description: "Search for token symbols supported by Pyth price feeds",
    schema: {
        query: z.string().describe("Search query for token symbols or names"),
        limit: z.number().optional().default(10).describe("Maximum results to return")
    },
    handler: async (agent: Agent, input: Record<string, any>) => {
        const { query, limit = 10 } = input;

        // Search local Pyth symbols first
        const localResults = searchPythSymbols(query).slice(0, limit);

        // Also search Pyth API for additional feeds
        let apiResults: any = [];
        try {
            const apiResponse = await searchPriceFeeds(query, "crypto");
            if (apiResponse.success && apiResponse.priceFeeds) {
                apiResults = apiResponse.priceFeeds.slice(0, limit - localResults.length);
            }
        } catch (error) {
            // API search failed, continue with local results only
        }

        return {
            status: "success",
            task: "symbol_search",
            message: "🔍 Token Symbol Search Results",
            
            query,
            total_results: localResults.length + apiResults.length,
            
            local_pyth_symbols: localResults.map(result => ({
                symbol: result.symbol,
                description: result.description,
                feed_id: result.feedId,
                source: "local_mapping",
                supported: true
            })),
            
            additional_pyth_feeds: apiResults.map((feed: any) => ({
                symbol: feed.attributes?.display_symbol || 'Unknown',
                description: feed.attributes?.description || feed.attributes?.base || 'Unknown',
                feed_id: feed.id,
                source: "pyth_oracle",
                asset_type: feed.attributes?.asset_type
            })),
            
            search_summary: {
                local_matches: localResults.length,
                api_matches: apiResults.length,
                instant_support: localResults.length > 0 ? "Available" : "None",
                additional_feeds: apiResults.length > 0 ? "Available" : "None"
            },
            
            usage_instructions: {
                supported_symbols: "Use get_token_prices_by_symbols with any symbol from local_pyth_symbols",
                other_symbols: "For additional feeds, you may need to add them to the local mapping or use feed IDs directly",
                not_found: "If symbol not found, use token_search_by_name to find contract addresses"
            }
        };
    }
};

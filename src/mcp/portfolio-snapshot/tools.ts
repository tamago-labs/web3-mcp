import { z } from "zod";
import { type McpTool } from "../../types";

export const PortfolioGetBalancesTool: McpTool = {
    name: "portfolio_get_balances", 
    description: "Get complete token balances for an address using cached Nodit API integration",
    schema: {
        address: z.string().describe("Wallet address to check"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to query"),
        include_native: z.boolean().optional().default(true).describe("Include native token balance"),
        include_tokens: z.boolean().optional().default(true).describe("Include ERC20 token balances"),
        include_nfts: z.boolean().optional().default(false).describe("Include NFT summary")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, chain, include_native, include_tokens, include_nfts } = input;
        
        return {
            status: "instruction",
            task: "portfolio_balance_analysis",
            message: "📊 Portfolio Balance Analysis - Cached API Approach",
            description: "Get complete portfolio balances using cached Nodit API specifications",
            
            overview: {
                action: "Retrieve complete portfolio balances for address",
                address,
                chain,
                includes: {
                    native_tokens: include_native,
                    erc20_tokens: include_tokens,
                    nfts: include_nfts
                }
            },

            execution_plan: [
                {
                    step: 1,
                    action: include_native ? "Get native token balance" : "Skip native balance",
                    tool: include_native ? "cached_nodit_api" : null,
                    parameters: include_native ? {
                        operation_id: "getNativeBalanceByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: { account: address }
                    } : null,
                    expected_result: include_native ? `Native ${chain === 'ethereum' ? 'ETH' : chain === 'polygon' ? 'MATIC' : 'ETH'} balance` : "Skipped"
                },
                {
                    step: 2,
                    action: include_tokens ? "Get ERC20 token balances" : "Skip token balances",
                    tool: include_tokens ? "cached_nodit_api" : null,
                    parameters: include_tokens ? {
                        operation_id: "getTokensOwnedByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: { 
                            account: address, 
                            page: 1, 
                            rpp: 100 
                        }
                    } : null,
                    expected_result: include_tokens ? "List of all ERC20 tokens with balances and metadata" : "Skipped"
                },
                {
                    step: 3,
                    action: include_nfts ? "Get NFT summary" : "Skip NFTs",
                    tool: include_nfts ? "cached_nodit_api" : null,
                    parameters: include_nfts ? {
                        operation_id: "getNftsOwnedByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: { 
                            account: address, 
                            page: 1, 
                            rpp: 50 
                        }
                    } : null,
                    expected_result: include_nfts ? "NFT collections and count summary" : "Skipped"
                },
                {
                    step: 4,
                    action: "Calculate USD values for all holdings",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: { 
                            contractAddresses: "Extract unique contracts from step 2 results",
                            currency: "USD"
                        }
                    },
                    expected_result: "USD prices for all tokens to calculate portfolio value"
                }
            ],

            portfolio_processing: {
                balance_calculation: [
                    "Process native balance using 18 decimals for ETH/MATIC",
                    "Process ERC20 balances using contract-specific decimals",
                    "Convert raw amounts to human-readable format",
                    "Calculate USD values using current prices"
                ],
                aggregation: [
                    "Sum total portfolio value across all assets",
                    "Calculate percentage allocation per token",
                    "Identify largest holdings and concentrations",
                    "Flag dust amounts and significant positions"
                ],
                formatting: [
                    "Round values to appropriate decimal places",
                    "Format large numbers with K/M/B suffixes",
                    "Sort holdings by USD value descending"
                ]
            },

            expected_output: {
                portfolio_summary: {
                    address,
                    chain,
                    timestamp: "ISO timestamp",
                    total_usd_value: "Sum of all USD values",
                    asset_count: "Number of different tokens held",
                    largest_holding: "Token with highest USD value"
                },
                balances: {
                    native: include_native ? {
                        symbol: chain === 'ethereum' ? 'ETH' : chain === 'polygon' ? 'MATIC' : 'ETH',
                        balance: "From getNativeBalanceByAccount",
                        balance_formatted: "Human readable balance",
                        usd_value: "Calculated using current price",
                        percentage: "% of total portfolio"
                    } : null,
                    tokens: include_tokens ? [
                        {
                            contract_address: "Token contract",
                            symbol: "Token symbol",
                            name: "Token name",
                            balance_raw: "Raw balance from API",
                            balance_formatted: "Human readable balance",
                            decimals: "Token decimals",
                            usd_price: "Current USD price",
                            usd_value: "Total USD value",
                            percentage: "% of total portfolio"
                        }
                    ] : null,
                    nfts: include_nfts ? {
                        total_collections: "Number of NFT collections",
                        total_items: "Total NFT count",
                        estimated_floor_value: "If price data available"
                    } : null
                }
            }
        };
    }
};

export const PortfolioGetCrossChainTool: McpTool = {
    name: "portfolio_get_cross_chain",
    description: "Get portfolio summary across multiple chains using cached Nodit API integration", 
    schema: {
        address: z.string().describe("Wallet address to check"),
        chains: z.array(z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism'])).describe("Chains to include"),
        currency: z.enum(['USD', 'ETH']).optional().default('USD').describe("Currency for totals")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, chains, currency } = input;
        
        return {
            status: "instruction",
            task: "cross_chain_portfolio_analysis",
            message: "🌐 Cross-Chain Portfolio Analysis - Cached API Approach",
            description: "Get unified portfolio view across multiple blockchains using cached API specs",
            
            overview: {
                action: "Retrieve portfolio balances across multiple chains",
                address,
                chains,
                currency,
                total_chains: chains.length,
                efficiency: "Parallel execution with cached API specs for maximum speed"
            },

            execution_strategy: {
                approach: "Parallel execution across all chains",
                benefit: "Faster than sequential calls with cached specifications",
                aggregation: "Unified cross-chain portfolio view"
            },

            execution_plan: {
                parallel_chain_calls: chains.map((chain, index) => ({
                    chain,
                    parallel_group: index + 1,
                    calls: [
                        {
                            action: "Get native balance",
                            tool: "cached_nodit_api",
                            parameters: {
                                operation_id: "getNativeBalanceByAccount",
                                protocol: chain,
                                network: "mainnet",
                                request_body: { account: address }
                            }
                        },
                        {
                            action: "Get token balances",
                            tool: "cached_nodit_api",
                            parameters: {
                                operation_id: "getTokensOwnedByAccount",
                                protocol: chain,
                                network: "mainnet",
                                request_body: { 
                                    account: address, 
                                    page: 1, 
                                    rpp: 100 
                                }
                            }
                        }
                    ]
                })),
                price_aggregation: {
                    step: chains.length + 1,
                    action: "Get prices for all unique tokens across chains",
                    description: "Collect unique contract addresses from all chains and get prices",
                    per_chain_calls: chains.map(chain => ({
                        chain,
                        tool: "cached_nodit_api",
                        parameters: {
                            operation_id: "getTokenPricesByContracts",
                            protocol: chain,
                            network: "mainnet",
                            request_body: {
                                contractAddresses: `Extract contracts from ${chain} results`,
                                currency: "USD"
                            }
                        }
                    }))
                }
            },

            cross_chain_processing: {
                data_aggregation: [
                    "Collect results from all chains simultaneously",
                    "Merge token lists and remove duplicates",
                    "Standardize balance formats across chains",
                    "Apply current prices to all holdings"
                ],
                chain_analysis: [
                    "Calculate per-chain portfolio values",
                    "Identify chain with largest holdings",
                    "Detect cross-chain arbitrage opportunities",
                    "Analyze chain diversification"
                ],
                portfolio_totals: [
                    "Sum total value across all chains",
                    "Calculate chain allocation percentages",
                    "Identify largest positions globally",
                    currency === 'ETH' ? "Convert all values to ETH using current price" : "Use USD values directly"
                ]
            },

            expected_output: {
                cross_chain_summary: {
                    address,
                    chains_analyzed: chains,
                    currency,
                    timestamp: "ISO timestamp",
                    total_portfolio_value: `Total value in ${currency}`,
                    chain_count: chains.length,
                    largest_chain: "Chain with highest value"
                },
                chain_breakdown: chains.map(chain => ({
                    chain,
                    native_balance: {
                        symbol: chain === 'ethereum' ? 'ETH' : chain === 'polygon' ? 'MATIC' : 'ETH',
                        balance: "Native token balance",
                        usd_value: "USD value"
                    },
                    token_portfolio: {
                        token_count: "Number of tokens on this chain",
                        total_value: `Total token value in ${currency}`,
                        largest_holding: "Biggest token position"
                    },
                    chain_totals: {
                        total_value: `Chain total in ${currency}`,
                        percentage_of_portfolio: "% of total cross-chain portfolio"
                    }
                })),
                unified_holdings: {
                    description: "All tokens across all chains, sorted by value",
                    tokens: [
                        {
                            token_symbol: "Token symbol",
                            chain: "Which chain it's on",
                            balance: "Amount held",
                            usd_value: "USD value",
                            percentage: "% of total portfolio"
                        }
                    ]
                }
            }
        };
    }
};

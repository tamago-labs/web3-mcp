import { z } from "zod";
import { type McpTool } from "../../types";

export const TokenGetOverviewTool: McpTool = {
    name: "token_get_overview",
    description: "Get comprehensive token analysis using cached Nodit API integration",
    schema: {
        token_symbol: z.string().optional().describe("Token symbol (e.g., USDC, WETH)"),
        contract_address: z.string().optional().describe("Token contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to query")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { token_symbol, contract_address, chain } = input;
        
        return {
            status: "instruction",
            task: "token_overview_analysis",
            message: "🪙 Token Intelligence - Cached API Approach",
            description: "Get comprehensive token analysis using cached Nodit API specifications",
            
            overview: {
                action: "Retrieve complete token intelligence and metrics",
                target_token: token_symbol || contract_address,
                chain,
                analysis_scope: "Metadata, pricing, holders, market data"
            },

            execution_plan: [
                ...(token_symbol && !contract_address ? [{
                    step: 1,
                    action: "Resolve token contract address",
                    tool: "symbol_converter",
                    parameters: {
                        symbol: token_symbol,
                        chain: chain,
                        verified_only: true
                    },
                    fallback: {
                        tool: "cached_nodit_api",
                        parameters: {
                            operation_id: "searchTokenContractMetadataByKeyword",
                            protocol: chain,
                            network: "mainnet",
                            request_body: { keyword: token_symbol, page: 1, rpp: 10 }
                        }
                    }
                }] : []),
                {
                    step: token_symbol && !contract_address ? 2 : 1,
                    action: "Get token metadata and deployment info",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [contract_address || "resolved_from_step_1"]
                        }
                    },
                    expected_result: "Token name, symbol, decimals, total supply, deployment info"
                },
                {
                    step: token_symbol && !contract_address ? 3 : 2,
                    action: "Get comprehensive price and market data",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [contract_address || "resolved_contract"],
                            currency: "USD"
                        }
                    },
                    expected_result: "Current price, 24h change, volume, market cap, trading data"
                },
                {
                    step: token_symbol && !contract_address ? 4 : 3,
                    action: "Get token holder distribution",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: contract_address || "resolved_contract",
                            page: 1,
                            rpp: 100,
                            withCount: true
                        }
                    },
                    expected_result: "Top holders list and total holder count"
                }
            ],

            token_analysis: {
                metadata_processing: [
                    "Extract core token information (name, symbol, decimals)",
                    "Analyze total supply and circulating supply",
                    "Review deployment date and deployer information",
                    "Assess contract verification status"
                ],
                market_assessment: [
                    "Calculate market cap and fully diluted valuation",
                    "Analyze 24h and 7d price performance",
                    "Review trading volume and liquidity metrics",
                    "Compare against market averages"
                ],
                holder_analysis: [
                    "Calculate holder concentration metrics",
                    "Identify whale addresses and their holdings",
                    "Assess distribution health and decentralization",
                    "Flag potential risks from concentration"
                ]
            },

            expected_output: {
                token_overview: {
                    basic_info: {
                        contract_address: "Token contract address",
                        name: "Full token name",
                        symbol: "Token symbol",
                        decimals: "Decimal places",
                        total_supply: "Total token supply",
                        chain: chain
                    },
                    deployment_info: {
                        deployed_at: "Deployment timestamp",
                        deployer_address: "Deployer wallet",
                        deployment_tx: "Deployment transaction hash"
                    }
                },
                market_metrics: {
                    price_data: {
                        current_price_usd: "Current USD price",
                        price_change_24h: "24h percentage change",
                        price_change_7d: "7d percentage change",
                        volume_24h: "24h trading volume"
                    },
                    market_valuation: {
                        market_cap: "Current market cap",
                        fully_diluted_valuation: "FDV if all tokens circulating",
                        market_rank: "Estimated market position"
                    }
                },
                holder_distribution: {
                    metrics: {
                        total_holders: "Total number of holders",
                        top_10_concentration: "% held by top 10 addresses",
                        top_50_concentration: "% held by top 50 addresses",
                        top_100_concentration: "% held by top 100 addresses"
                    },
                    analysis: {
                        distribution_health: "Centralized/Distributed/Balanced",
                        whale_risk: "High/Medium/Low concentration risk",
                        decentralization_score: "Calculated decentralization metric"
                    }
                },
                risk_assessment: {
                    liquidity_risk: "Assessment based on volume/mcap ratio",
                    concentration_risk: "Risk from holder concentration",
                    market_maturity: "New/Emerging/Established token status"
                }
            } 
        };
    }
};

export const TokenSearchByNameTool: McpTool = {
    name: "token_search_by_name",
    description: "Search tokens by name/symbol using cached Nodit API integration",
    schema: {
        query: z.string().describe("Token name or symbol to search"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to search"),
        limit: z.number().optional().default(20).describe("Maximum results to return")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { query, chain, limit } = input;
        
        return {
            status: "instruction",
            task: "token_search",
            message: "🔍 Token Search - Cached API Approach",
            description: "Search for tokens by name or symbol using cached Nodit API specifications",
            
            overview: {
                action: "Search tokens by name/symbol query",
                search_query: query,
                chain,
                max_results: limit
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Search token contracts by keyword",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "searchTokenContractMetadataByKeyword",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            keyword: query,
                            page: 1,
                            rpp: limit,
                            withCount: true
                        }
                    },
                    expected_result: "List of matching token contracts with metadata"
                },
                {
                    step: 2,
                    action: "Get price data for found tokens",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: "Extract addresses from step 1 results (max 100)",
                            currency: "USD"
                        }
                    },
                    purpose: "Enrich results with current price and market data"
                }
            ],

            search_processing: {
                relevance_scoring: [
                    "Exact symbol match: 100 points",
                    "Partial symbol match: 75 points", 
                    "Exact name match: 90 points",
                    "Partial name match: 50 points",
                    "Has price data: +10 points",
                    "High total supply: +5 points"
                ],
                quality_filtering: [
                    "Remove tokens with suspicious names",
                    "Filter out obvious scam tokens",
                    "Prioritize tokens with price data",
                    "Sort by relevance score + market cap"
                ],
                result_enhancement: [
                    "Add price and market data where available",
                    "Calculate basic metrics (market cap)",
                    "Format numbers for readability",
                    "Add confidence scores for matches"
                ]
            },

            expected_output: {
                search_summary: {
                    query,
                    chain,
                    total_matches: "Total tokens found",
                    with_price_data: "Number with available prices",
                    timestamp: "Search timestamp"
                },
                token_results: [
                    {
                        relevance_score: "Calculated match score (0-100)",
                        contract_address: "Token contract address",
                        name: "Full token name",
                        symbol: "Token symbol",
                        decimals: "Decimal places",
                        total_supply: "Total token supply",
                        deployed_at: "Deployment date",
                        price_data: {
                            current_price_usd: "Current USD price (if available)",
                            market_cap: "Market cap (if price available)",
                            volume_24h: "24h volume (if available)",
                            price_change_24h: "24h change % (if available)"
                        },
                        match_type: "exact_symbol|partial_symbol|exact_name|partial_name"
                    }
                ],
                search_insights: {
                    best_matches: "Top 3 most relevant results",
                    exact_symbol_matches: "Count of exact symbol matches",
                    tokens_with_market_data: "Count with price information",
                    search_effectiveness: "Good/Fair/Poor based on result quality"
                }
            }
        };
    }
};

export const TokenGetHolderAnalysisTool: McpTool = {
    name: "token_get_holder_analysis",
    description: "Analyze token holder distribution and concentration using cached Nodit API",
    schema: {
        contract_address: z.string().describe("Token contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to query"),
        top_holders_count: z.number().optional().default(100).describe("Number of top holders to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { contract_address, chain, top_holders_count } = input;
        
        return {
            status: "instruction",
            task: "token_holder_analysis",
            message: "👥 Token Holder Analysis - Cached API Approach", 
            description: "Analyze token holder distribution using cached Nodit API specifications",
            
            overview: {
                action: "Comprehensive holder distribution analysis",
                contract_address,
                chain,
                analysis_scope: `Top ${top_holders_count} holders + distribution metrics`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get token metadata for context",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [contract_address]
                        }
                    },
                    purpose: "Get token details (symbol, decimals, total supply)"
                },
                {
                    step: 2,
                    action: "Get comprehensive holder list",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: contract_address,
                            page: 1,
                            rpp: top_holders_count,
                            withCount: true
                        }
                    },
                    expected_result: "Top holders with balances and total holder count"
                }
            ],

            holder_analysis: {
                concentration_metrics: [
                    "Calculate top 1, 5, 10, 20, 50, 100 holder percentages",
                    "Compute Gini coefficient for distribution inequality",
                    "Identify concentration thresholds and risk levels",
                    "Calculate effective number of holders (entropy-based)"
                ],
                whale_identification: [
                    "Classify holders by balance size (whale, large, medium, small)",
                    "Identify potential exchange addresses",
                    "Flag multi-sig and contract addresses",
                    "Detect potential team/founder allocations"
                ],
                distribution_health: [
                    "Assess overall decentralization level",
                    "Identify concentration risks",
                    "Compare against industry benchmarks",
                    "Calculate distribution score"
                ]
            },

            expected_output: {
                token_info: {
                    contract_address,
                    name: "Token name",
                    symbol: "Token symbol", 
                    total_supply: "Total token supply",
                    decimals: "Token decimals",
                    chain
                },
                holder_statistics: {
                    total_holders: "Total number of holders",
                    analyzed_holders: top_holders_count,
                    coverage_percentage: "% of supply covered by analyzed holders"
                },
                concentration_analysis: {
                    top_1_percentage: "% held by largest holder",
                    top_5_percentage: "% held by top 5 holders",
                    top_10_percentage: "% held by top 10 holders",
                    top_20_percentage: "% held by top 20 holders",
                    top_50_percentage: "% held by top 50 holders",
                    top_100_percentage: "% held by top 100 holders",
                    gini_coefficient: "Inequality measure (0-1)",
                    effective_holders: "Entropy-based effective holder count"
                },
                whale_analysis: {
                    whale_count: "Holders with >1% of supply",
                    whale_total_percentage: "Total % held by whales",
                    largest_whale_percentage: "Largest single holder %",
                    potential_exchanges: "Identified exchange addresses",
                    potential_contracts: "Smart contract holders"
                },
                distribution_health: {
                    decentralization_score: "Overall score (0-100)",
                    risk_level: "Low/Medium/High concentration risk",
                    health_rating: "Excellent/Good/Fair/Poor",
                    key_risks: ["Primary concentration risks identified"]
                }
            }
        };
    }
};

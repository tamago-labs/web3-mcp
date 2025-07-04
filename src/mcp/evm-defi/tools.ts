import { z } from "zod";
import { type McpTool } from "../../types";

export const DefiGetPoolInfoTool: McpTool = {
    name: "defi_get_pool_info",
    description: "Get DeFi liquidity pool information and analytics using cached Nodit API",
    schema: {
        pool_address: z.string().describe("Liquidity pool contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism','avalanche', 'kaia']).describe("Blockchain network"),
        include_historical: z.boolean().optional().default(false).describe("Include historical pool data")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { pool_address, chain, include_historical } = input;
        
        return {
            status: "instruction",
            task: "defi_pool_analysis",
            message: "🏊 DeFi Pool Analysis - Cached API Approach",
            description: "Analyze DeFi liquidity pool metrics using cached Nodit API specifications",
            
            overview: {
                action: "Comprehensive DeFi pool analysis",
                target_pool: pool_address,
                chain,
                include_history: include_historical,
                analysis_scope: "Pool metadata, liquidity, volume, fees, holders"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get pool contract metadata",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [pool_address]
                        }
                    },
                    purpose: "Get basic pool contract information"
                },
                {
                    step: 2,
                    action: "Get pool token holders (LPs)",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: pool_address,
                            page: 1,
                            rpp: 100,
                            withCount: true
                        }
                    },
                    purpose: "Analyze liquidity provider distribution"
                },
                {
                    step: 3,
                    action: "Get recent pool activity",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenTransfersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: pool_address,
                            fromDate: new Date(Date.now() - (7 * 24 * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    purpose: "Track LP token mints/burns and transfers"
                },
                {
                    step: 4,
                    action: "Get current pool token price",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [pool_address],
                            currency: "USD"
                        }
                    },
                    purpose: "Get LP token valuation if available"
                }
            ],

            defi_analysis: {
                pool_metrics: [
                    "Calculate total LP token supply",
                    "Analyze LP token distribution among holders",
                    "Identify major liquidity providers",
                    "Calculate concentration risk metrics"
                ],
                activity_analysis: [
                    "Track LP token minting (liquidity additions)",
                    "Track LP token burning (liquidity removals)",
                    "Analyze LP token trading activity",
                    "Calculate liquidity provider churn rate"
                ],
                risk_assessment: [
                    "Assess LP concentration risks",
                    "Identify potential rug pull indicators",
                    "Analyze liquidity stability",
                    "Track large holder movements"
                ]
            },

            expected_output: {
                pool_info: {
                    contract_address: pool_address,
                    chain,
                    timestamp: "ISO timestamp",
                    name: "Pool token name",
                    symbol: "Pool token symbol",
                    total_supply: "Total LP tokens outstanding",
                    decimals: "LP token decimals"
                },
                liquidity_providers: {
                    total_lps: "Number of LP token holders",
                    top_10_concentration: "% held by top 10 LPs",
                    largest_lp_percentage: "Largest LP holding %",
                    average_lp_size: "Average LP token holding",
                    new_lps_7d: "New LPs in last 7 days"
                },
                pool_activity: {
                    lp_mints_7d: "LP token mints (liquidity adds)",
                    lp_burns_7d: "LP token burns (liquidity removes)",
                    lp_transfers_7d: "LP token transfers",
                    net_liquidity_change: "Net liquidity change in 7d",
                    most_active_lps: "Most active LP addresses"
                },
                risk_metrics: {
                    concentration_risk: "High/Medium/Low",
                    liquidity_stability: "Stable/Volatile/Unstable",
                    whale_activity: "Recent large LP movements",
                    pool_health_score: "Overall pool health (0-100)"
                }
            }
        };
    }
};

export const DefiTrackYieldFarmingTool: McpTool = {
    name: "defi_track_yield_farming",
    description: "Track yield farming and staking activities using cached Nodit API",
    schema: {
        farm_contract: z.string().describe("Yield farming contract address"),
        user_address: z.string().optional().describe("Specific user to track (optional)"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism','avalanche', 'kaia']).describe("Blockchain network"),
        days: z.number().optional().default(30).describe("Days to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { farm_contract, user_address, chain, days } = input;
        
        return {
            status: "instruction",
            task: "yield_farming_analysis",
            message: "🌾 Yield Farming Tracker - Cached API Approach",
            description: "Track yield farming and staking activities using cached Nodit API specifications",
            
            overview: {
                action: user_address ? "Track specific user yield farming" : "Analyze farm contract activity",
                farm_contract,
                user_address: user_address || "All users",
                chain,
                timeframe: `${days} days`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get farm contract metadata",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [farm_contract]
                        }
                    },
                    purpose: "Understand farm token details"
                },
                {
                    step: 2,
                    action: user_address ? "Get user farming activity" : "Get all farming activity",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: user_address ? "getTokenTransfersByAccount" : "getTokenTransfersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: user_address ? {
                            accountAddress: user_address,
                            contractAddresses: [farm_contract],
                            fromDate: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        } : {
                            contractAddress: farm_contract,
                            fromDate: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    purpose: "Track staking/unstaking activities"
                },
                {
                    step: 3,
                    action: "Get current farm participants",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: farm_contract,
                            page: 1,
                            rpp: 1000,
                            withCount: true
                        }
                    },
                    purpose: "Understand current staking distribution"
                }
            ],

            farming_analysis: {
                staking_patterns: [
                    "Identify stake vs unstake transactions",
                    "Calculate average staking periods",
                    "Track reward claim activities",
                    "Analyze staking size distribution"
                ],
                user_behavior: [
                    "Track user entry/exit patterns",
                    "Calculate user retention rates",
                    "Identify power users vs casual farmers",
                    "Analyze loyalty and churn metrics"
                ],
                farm_health: [
                    "Monitor total value locked trends",
                    "Track participant count changes",
                    "Analyze concentration risks",
                    "Assess farm sustainability"
                ]
            },

            expected_output: {
                farm_overview: {
                    farm_contract,
                    chain,
                    analysis_period: `${days} days`,
                    timestamp: "ISO timestamp",
                    farm_token_info: "Token name, symbol, supply"
                },
                farming_metrics: {
                    total_farmers: "Current number of stakers",
                    total_staked: "Total tokens staked",
                    new_farmers: "New participants in period",
                    exited_farmers: "Users who unstaked completely",
                    average_stake_size: "Mean staking amount",
                    median_stake_size: "Median staking amount"
                },
                activity_summary: {
                    total_stakes: "Staking transactions in period",
                    total_unstakes: "Unstaking transactions in period",
                    total_volume_staked: "Total volume staked",
                    total_volume_unstaked: "Total volume unstaked",
                    net_flow: "Net staking flow",
                    most_active_farmers: "Top farmers by activity"
                },
                user_analysis: user_address ? {
                    user_address,
                    current_stake: "Current staked amount",
                    total_staked_period: "Total staked in period",
                    total_unstaked_period: "Total unstaked in period",
                    stake_count: "Number of stake transactions",
                    unstake_count: "Number of unstake transactions",
                    average_stake_duration: "Average holding period"
                } : null,
                farm_health: {
                    tvl_trend: "Increasing/Stable/Decreasing",
                    participant_trend: "Growing/Stable/Declining",
                    concentration_risk: "High/Medium/Low",
                    sustainability_score: "Farm health score (0-100)"
                }
            }
        };
    }
};

export const DefiAnalyzeDexActivityTool: McpTool = {
    name: "defi_analyze_dex_activity",
    description: "Analyze DEX trading activity and volume using cached Nodit API",
    schema: {
        dex_router: z.string().describe("DEX router contract address"),
        token_pairs: z.array(z.string()).optional().describe("Specific token addresses to analyze"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism','avalanche', 'kaia']).describe("Blockchain network"),
        hours: z.number().optional().default(24).describe("Hours to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { dex_router, token_pairs, chain, hours } = input;
        
        return {
            status: "instruction",
            task: "dex_activity_analysis",
            message: "📈 DEX Activity Analysis - Cached API Approach",
            description: "Analyze DEX trading activity and volume using cached Nodit API specifications",
            
            overview: {
                action: "Comprehensive DEX trading analysis",
                dex_router,
                token_focus: token_pairs || "All tokens",
                chain,
                timeframe: `${hours} hours`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get recent transactions through DEX router",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTransactionsByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            account: dex_router,
                            relation: "to",
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    purpose: "Get all trading transactions through the DEX"
                },
                {
                    step: 2,
                    action: "Get token transfers related to trading",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenTransfersByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            accountAddress: dex_router,
                            relation: "both",
                            contractAddresses: token_pairs || undefined,
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    purpose: "Track token flows through the DEX"
                },
                {
                    step: 3,
                    action: "Get token prices for volume calculations",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: token_pairs || "Extract from transfer data",
                            currency: "USD"
                        }
                    },
                    purpose: "Calculate USD trading volumes"
                }
            ],

            dex_analysis: {
                volume_calculation: [
                    "Parse token transfers to identify swaps",
                    "Calculate trading volumes using token prices",
                    "Identify most traded token pairs",
                    "Track volume trends over time periods"
                ],
                trading_patterns: [
                    "Identify unique traders and trading frequency",
                    "Analyze transaction size distribution",
                    "Detect arbitrage and MEV activities",
                    "Track gas efficiency of trades"
                ],
                market_impact: [
                    "Calculate price impact of large trades",
                    "Identify market making activities",
                    "Track slippage patterns",
                    "Analyze liquidity utilization"
                ]
            },

            expected_output: {
                dex_summary: {
                    dex_router,
                    chain,
                    analysis_period: `${hours}h`,
                    timestamp: "ISO timestamp",
                    total_transactions: "Trading transactions in period"
                },
                volume_metrics: {
                    total_volume_usd: "Total trading volume in USD",
                    unique_traders: "Number of unique trading addresses",
                    average_trade_size: "Average trade size in USD",
                    largest_trade: "Largest single trade",
                    volume_by_hour: "Hourly volume breakdown"
                },
                token_analysis: [
                    {
                        token_address: "Token contract address",
                        token_symbol: "Token symbol",
                        volume_usd: "Trading volume for this token",
                        trade_count: "Number of trades",
                        unique_traders: "Unique addresses trading",
                        price_impact: "Average price impact"
                    }
                ],
                trading_insights: {
                    most_active_tokens: "Tokens with highest volume",
                    most_active_traders: "Addresses with most trades",
                    peak_trading_hours: "Hours with highest activity",
                    gas_efficiency: "Average gas cost per trade",
                    arbitrage_activity: "Detected arbitrage transactions"
                },
                market_health: {
                    liquidity_utilization: "How well liquidity is used",
                    trading_diversity: "Diversity of trading pairs",
                    market_efficiency: "Price impact vs volume",
                    dex_competitiveness: "Performance indicators"
                }
            }, 
        };
    }
};

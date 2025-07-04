import { z } from "zod";
import { type McpTool } from "../../types";

export const AptosCoinActivityTool: McpTool = {
    name: "aptos_coin_activity",
    description: "Track Aptos coin activities and DeFi transactions using cached Aptos API",
    schema: {
        address: z.string().describe("Aptos wallet address"),
        coin_type: z.string().optional().describe("Specific coin type to track (e.g., 0x1::aptos_coin::AptosCoin)"),
        limit: z.number().optional().default(100).describe("Number of activities to retrieve"),
        activity_types: z.array(z.string()).optional().describe("Filter by activity types"),
        days: z.number().optional().default(7).describe("Days to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, coin_type, limit, activity_types, days } = input;
        
        return {
            status: "instruction",
            task: "aptos_coin_activity_analysis",
            message: "🪙 Aptos Coin Activity Analysis - Cached API Approach",
            description: "Track Aptos coin activities and DeFi transactions using cached Aptos GraphQL queries",
            
            overview: {
                action: "Analyze Aptos coin activities and DeFi transactions",
                target_address: address,
                coin_focus: coin_type || "All coins",
                activity_limit: limit,
                timeframe: `${days} days`,
                filter_types: activity_types || "All types"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get coin activities for address",
                    tool: "cached_aptos_api",
                    parameters: {
                        query_name: "coin_activities",
                        network: "mainnet",
                        variables: {
                            address,
                            coin_type,
                            limit,
                            activity_types,
                            start_time: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString()
                        }
                    },
                    expected_result: "List of coin activities with metadata and DeFi interactions"
                },
                {
                    step: 2,
                    action: "Get current coin balances for portfolio context",
                    tool: "cached_aptos_api",
                    parameters: {
                        query_name: "current_coin_balances",
                        network: "mainnet",
                        variables: {
                            address
                        }
                    },
                    purpose: "Get current portfolio balances for context"
                }
            ],

            aptos_analysis: {
                activity_classification: [
                    "Categorize activities: deposits, withdrawals, swaps, rewards",
                    "Identify DeFi protocol interactions by entry_function_id_str",
                    "Track gas fee patterns and efficiency",
                    "Analyze transaction success rates"
                ],
                defi_patterns: [
                    "Detect DEX trading activities (swap functions)",
                    "Identify lending/borrowing transactions",
                    "Track liquidity provision activities (add/remove liquidity)",
                    "Analyze yield farming and staking patterns"
                ],
                portfolio_analysis: [
                    "Calculate portfolio composition changes",
                    "Track balance changes over time",
                    "Identify new coin acquisitions",
                    "Analyze holding vs trading patterns"
                ]
            },

            expected_output: {
                address_summary: {
                    address,
                    coin_focus: coin_type || "All coins",
                    analysis_period: `${days} days`,
                    total_activities: "Total activities found",
                    timestamp: "ISO timestamp"
                },
                coin_activities: [
                    {
                        activity_type: "Activity type (deposit, withdrawal, etc)",
                        amount: "Amount in smallest unit",
                        amount_formatted: "Human readable amount using decimals",
                        coin_type: "Full coin type identifier", 
                        coin_info: {
                            name: "Coin name",
                            symbol: "Coin symbol",
                            decimals: "Decimal places",
                            creator_address: "Coin creator"
                        },
                        transaction_timestamp: "Activity timestamp",
                        transaction_version: "Aptos transaction version",
                        entry_function: "Function called (DeFi protocol identifier)",
                        event_account: "Contract that emitted the event",
                        success: "Transaction success status",
                        is_gas_fee: "Whether this activity represents gas fees"
                    }
                ],
                current_balances: [
                    {
                        coin_type: "Coin type identifier",
                        coin_info: {
                            name: "Coin name",
                            symbol: "Coin symbol",
                            decimals: "Decimal places"
                        },
                        balance: "Current balance in smallest unit",
                        balance_formatted: "Human readable balance",
                        last_updated: "Last transaction timestamp"
                    }
                ],
                defi_insights: {
                    protocols_used: "DeFi protocols interacted with (from entry functions)",
                    most_active_coins: "Coins with most activity",
                    activity_frequency: "Transaction frequency patterns",
                    gas_efficiency: "Gas usage patterns and optimization",
                    portfolio_changes: "Recent portfolio composition changes",
                    trading_vs_holding: "Analysis of trading vs holding behavior"
                }
            } 
        };
    }
};

export const AptosLiquidityPoolTool: McpTool = {
    name: "aptos_liquidity_pool",
    description: "Analyze Aptos liquidity pools and AMM activities using cached Aptos API",
    schema: {
        pool_address: z.string().optional().describe("Specific pool address to analyze"),
        coin_pair: z.array(z.string()).optional().describe("Coin pair types for the pool"),
        limit: z.number().optional().default(100).describe("Number of activities to retrieve"),
        days: z.number().optional().default(7).describe("Days to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { pool_address, coin_pair, limit, days } = input;
        
        return {
            status: "instruction",
            task: "aptos_liquidity_analysis", 
            message: "🏊 Aptos Liquidity Pool Analysis - Cached API Approach",
            description: "Analyze Aptos liquidity pools and AMM activities using cached GraphQL queries",
            
            overview: {
                action: "Comprehensive Aptos liquidity pool analysis",
                target_pool: pool_address || "Auto-detection needed",
                coin_pair: coin_pair || "All pairs",
                analysis_limit: limit,
                timeframe: `${days} days`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get liquidity pool activities (deposits/withdrawals)",
                    tool: "cached_aptos_api",
                    parameters: {
                        query_name: "liquidity_activities",
                        network: "mainnet",
                        variables: {
                            pool_address,
                            coin_types: coin_pair,
                            limit,
                            start_time: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString()
                        }
                    },
                    purpose: "Track liquidity additions and removals"
                },
                {
                    step: 2,
                    action: "Get coin information for the pool pairs",
                    tool: "cached_aptos_api",
                    parameters: {
                        query_name: "coin_infos",
                        network: "mainnet",
                        variables: {
                            coin_types: coin_pair || ["0x1::aptos_coin::AptosCoin"]
                        }
                    },
                    purpose: "Get metadata for the coins in the pool"
                }
            ],

            liquidity_analysis: {
                pool_activities: [
                    "Identify liquidity additions (DepositEvent)",
                    "Track liquidity removals (WithdrawEvent)",
                    "Calculate net liquidity flow over time",
                    "Analyze liquidity provider behavior patterns"
                ],
                amm_metrics: [
                    "Track swap activities through pool events",
                    "Calculate trading volume from activity data",
                    "Analyze price impact patterns",
                    "Monitor pool utilization and efficiency"
                ],
                risk_assessment: [
                    "Assess liquidity concentration risks",
                    "Identify large liquidity providers",
                    "Track sudden liquidity changes",
                    "Monitor pool health indicators"
                ]
            },

            expected_output: {
                pool_summary: {
                    pool_address: pool_address || "Auto-detected from activities",
                    coin_pair: coin_pair || "Discovered from activities",
                    analysis_period: `${days} days`,
                    timestamp: "ISO timestamp"
                },
                liquidity_metrics: {
                    total_deposits: "Total liquidity additions in period",
                    total_withdrawals: "Total liquidity removals in period",
                    net_liquidity_flow: "Net change in liquidity",
                    unique_lps: "Number of unique liquidity providers",
                    average_deposit_size: "Mean deposit amount",
                    largest_deposit: "Largest single deposit"
                },
                pool_activities: [
                    {
                        activity_type: "DepositEvent or WithdrawEvent",
                        amount: "Amount in smallest unit",
                        amount_formatted: "Human readable amount",
                        coin_type: "Coin being deposited/withdrawn",
                        coin_info: {
                            name: "Coin name",
                            symbol: "Coin symbol", 
                            decimals: "Decimal places"
                        },
                        provider_address: "LP address",
                        timestamp: "Activity timestamp",
                        transaction_version: "Aptos transaction version",
                        event_account: "Pool contract address"
                    }
                ],
                liquidity_insights: {
                    most_active_lps: "Top liquidity providers by activity volume",
                    deposit_vs_withdrawal_ratio: "Ratio of deposits to withdrawals",
                    liquidity_trend: "Increasing/Stable/Decreasing",
                    pool_concentration: "Concentration among top LPs",
                    activity_patterns: "Timing and frequency patterns"
                }
            },
 
        };
    }
};

export const AptosDefiProtocolTool: McpTool = {
    name: "aptos_defi_protocol",
    description: "Analyze specific DeFi protocol activities on Aptos using cached Aptos API",
    schema: {
        protocol_address: z.string().describe("DeFi protocol contract address"),
        user_address: z.string().optional().describe("Specific user to analyze (optional)"),
        function_filter: z.array(z.string()).optional().describe("Specific entry functions to track"),
        days: z.number().optional().default(7).describe("Days to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { protocol_address, user_address, function_filter, days } = input;
        
        return {
            status: "instruction",
            task: "aptos_defi_protocol_analysis",
            message: "🏗️ Aptos DeFi Protocol Analysis - Cached API Approach",
            description: "Analyze DeFi protocol activities on Aptos using cached GraphQL queries",
            
            overview: {
                action: "Comprehensive DeFi protocol analysis",
                protocol_address,
                user_focus: user_address || "All users",
                function_focus: function_filter || "All functions",
                timeframe: `${days} days`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get protocol-related activities",
                    tool: "cached_aptos_api", 
                    parameters: {
                        query_name: "protocol_activities",
                        network: "mainnet",
                        variables: {
                            protocol_address,
                            user_address,
                            function_filter,
                            start_time: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString(),
                            limit: 1000
                        }
                    },
                    purpose: "Track all protocol interactions and function calls"
                },
                {
                    step: 2,
                    action: user_address ? "Get user current balances" : "Get protocol user balances",
                    tool: "cached_aptos_api",
                    parameters: {
                        query_name: "current_coin_balances",
                        network: "mainnet",
                        variables: {
                            address: user_address || "Extract from step 1 results"
                        }
                    },
                    purpose: "Understand current state of protocol users"
                }
            ],

            protocol_analysis: {
                function_classification: [
                    "Categorize entry functions by DeFi type (swap, lend, stake, etc)",
                    "Identify lending, borrowing, swapping, staking functions",
                    "Track success rates per function type",
                    "Analyze gas efficiency by function"
                ],
                user_behavior: [
                    "Track user interaction patterns with protocol",
                    "Identify power users vs casual users",
                    "Analyze user retention and activity frequency",
                    "Calculate average transaction sizes per function"
                ],
                protocol_health: [
                    "Monitor total value locked (TVL) estimation",
                    "Track user growth and retention metrics",
                    "Analyze transaction volume trends",
                    "Assess protocol utilization patterns"
                ]
            },

            expected_output: {
                protocol_summary: {
                    protocol_address,
                    user_focus: user_address || "All users",
                    analysis_period: `${days} days`,
                    total_activities: "Total protocol interactions",
                    timestamp: "ISO timestamp"
                },
                function_analysis: [
                    {
                        function_name: "Entry function identifier",
                        call_count: "Number of function calls",
                        unique_users: "Unique users calling this function",
                        total_volume: "Total value processed",
                        success_rate: "Transaction success percentage",
                        avg_gas_efficiency: "Average gas patterns"
                    }
                ],
                user_insights: user_address ? {
                    user_address,
                    total_interactions: "Total protocol interactions",
                    functions_used: "Different functions called",
                    total_volume: "Total value transacted",
                    first_interaction: "First protocol usage",
                    last_interaction: "Most recent usage",
                    current_positions: "Current balances in protocol tokens"
                } : {
                    total_unique_users: "Unique users in period",
                    new_users: "First-time protocol users",
                    returning_users: "Users with multiple interactions",
                    most_active_users: "Top users by activity volume"
                },
                protocol_metrics: {
                    tvl_estimate: "Estimated total value locked",
                    transaction_volume: "Total transaction volume",
                    average_transaction_size: "Mean transaction value",
                    daily_active_users: "Average daily active users",
                    protocol_growth: "User and volume growth trends"
                },
                defi_insights: {
                    most_popular_functions: "Most used DeFi functions",
                    peak_activity_times: "Most active time periods",
                    user_behavior_patterns: "Common usage patterns",
                    protocol_adoption: "Adoption and retention metrics",
                    move_contract_efficiency: "Smart contract performance"
                }
            },
 
        };
    }
};

import { z } from "zod";
import { type McpTool } from "../../types";

export const GasGetCurrentPricesTool: McpTool = {
    name: "gas_get_current_prices",
    description: "Get current gas prices for specified chain using cached Nodit API integration",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to query")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { chain } = input;
        
        return {
            status: "instruction",
            task: "gas_price_analysis",
            message: "⛽ Gas Price Analysis - Cached API Approach",
            description: "Get current gas prices and fee recommendations using cached Nodit API specs",
            
            overview: {
                action: "Retrieve current gas prices and calculate fee tiers",
                chain,
                data_sources: ["Current gas price", "Fee history", "Network congestion"]
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get current gas price",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getGasPrice",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {}
                    },
                    expected_result: "Current base gas price in wei"
                },
                {
                    step: 2,
                    action: "Get fee history for trend analysis",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: chain === 'ethereum' ? "eth_feeHistory" : `${chain}-eth_feeHistory`,
                        requestBody: {
                            jsonrpc: "2.0",
                            method: "eth_feeHistory",
                            params: ["0xA", "latest", [25, 50, 75]],
                            id: 1
                        }
                    },
                    expected_result: "Historical fee data for trend analysis"
                },
                {
                    step: 3,
                    action: "Get native token price for USD calculations",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet", 
                        request_body: {
                            contractAddresses: [
                                chain === 'ethereum' ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" : // WETH
                                chain === 'polygon' ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" : // WMATIC
                                chain === 'avalanche' ? "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" : // WAVAX
                                chain === 'kaia' ? "0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432" : // WKAIA
                                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // Default to WETH
                            ],
                            currency: "USD"
                        }
                    },
                    purpose: "Get native token price for USD gas cost calculations"
                }
            ],

            gas_analysis: {
                tier_calculation: {
                    slow: {
                        multiplier: 0.8,
                        description: "Base price * 0.8 (longer wait, cheaper)",
                        wait_time: "5-10 minutes"
                    },
                    standard: {
                        multiplier: 1.0,
                        description: "Base price * 1.0 (normal speed)",
                        wait_time: "2-5 minutes"
                    },
                    fast: {
                        multiplier: 1.2,
                        description: "Base price * 1.2 (faster confirmation)",
                        wait_time: "< 2 minutes"
                    }
                },
                usd_cost_calculation: [
                    "Convert gas price from wei to gwei",
                    "Calculate gas cost for standard transaction (21,000 gas)",
                    "Calculate gas cost for token transfer (~46,000 gas)",
                    "Calculate gas cost for DEX swap (~150,000 gas)",
                    "Convert to USD using native token price"
                ],
                network_analysis: [
                    "Analyze fee history patterns",
                    "Determine network congestion level",
                    "Identify price trend (rising/stable/falling)",
                    "Compare current vs recent average"
                ]
            },

            expected_output: {
                chain,
                timestamp: "ISO timestamp",
                current_gas: {
                    base_price_wei: "Raw gas price from API",
                    base_price_gwei: "Converted to gwei",
                    trend: "Rising/Stable/Falling based on history"
                },
                gas_tiers: {
                    slow: {
                        gwei: "Calculated slow tier price",
                        usd_costs: {
                            simple_transfer: "ETH transfer cost",
                            token_transfer: "ERC20 transfer cost",
                            dex_swap: "DEX swap cost"
                        },
                        wait_time: "5-10 min"
                    },
                    standard: {
                        gwei: "Current base price",
                        usd_costs: {
                            simple_transfer: "ETH transfer cost",
                            token_transfer: "ERC20 transfer cost", 
                            dex_swap: "DEX swap cost"
                        },
                        wait_time: "2-5 min"
                    },
                    fast: {
                        gwei: "Calculated fast tier price",
                        usd_costs: {
                            simple_transfer: "ETH transfer cost",
                            token_transfer: "ERC20 transfer cost",
                            dex_swap: "DEX swap cost"
                        },
                        wait_time: "< 2 min"
                    }
                },
                network_status: {
                    congestion: "Low/Medium/High based on fee history",
                    recommendation: "Best tier based on current conditions",
                    savings_opportunity: "Potential savings by waiting"
                }
            }
        };
    }
};

export const GasGetOptimalTimingTool: McpTool = {
    name: "gas_get_optimal_timing",
    description: "Get optimal timing recommendations for transactions using cached Nodit API",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to query"),
        urgency: z.enum(['low', 'medium', 'high']).optional().default('medium').describe("Transaction urgency")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { chain, urgency } = input;
        
        return {
            status: "instruction",
            task: "gas_timing_optimization",
            message: "⏰ Gas Timing Optimization - Cached API Approach",
            description: "Get optimal transaction timing recommendations using cached API specs",
            
            overview: {
                action: "Analyze gas patterns to recommend optimal transaction timing",
                chain,
                urgency_level: urgency,
                analysis_scope: "Historical patterns + current conditions"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get extended fee history for pattern analysis",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: chain === 'ethereum' ? "eth_feeHistory" : `${chain}-eth_feeHistory`,
                        requestBody: {
                            jsonrpc: "2.0",
                            method: "eth_feeHistory",
                            params: ["0x100", "latest", [10, 25, 50, 75, 90]],
                            id: 1
                        }
                    },
                    expected_result: "256 blocks of fee history for comprehensive pattern analysis",
                    purpose: "Identify gas price patterns and trends"
                },
                {
                    step: 2,
                    action: "Get current baseline gas price",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getGasPrice",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {}
                    },
                    expected_result: "Current gas price for comparison against historical data"
                },
                {
                    step: 3,
                    action: "Get native token price for cost calculations",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenPricesByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddresses: [
                                chain === 'ethereum' ? "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" : // WETH
                                chain === 'polygon' ? "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270" : // WMATIC  
                                chain === 'avalanche' ? "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7" : // WAVAX
                                chain === 'kaia' ? "0x19Aac5f612f524B754CA7e7c41cbFa2E981A4432" : // WKAIA
                                "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // Default to WETH
                            ],
                            currency: "USD"
                        }
                    },
                    purpose: "Calculate USD savings for timing recommendations"
                }
            ],

            timing_analysis: {
                pattern_recognition: [
                    "Identify lowest gas periods in recent history",
                    "Detect recurring time-of-day patterns",
                    "Analyze weekend vs weekday variations",
                    "Calculate volatility and predictability metrics"
                ],
                urgency_optimization: {
                    low: {
                        max_wait_time: "24 hours",
                        target_savings: "20-40%",
                        strategy: "Wait for optimal windows, accept longer delays"
                    },
                    medium: {
                        max_wait_time: "4 hours", 
                        target_savings: "10-20%",
                        strategy: "Balance timing with reasonable delay"
                    },
                    high: {
                        max_wait_time: "1 hour",
                        target_savings: "0-10%",
                        strategy: "Execute soon with minor optimization"
                    }
                },
                prediction_windows: [
                    "Next 1 hour: High confidence predictions",
                    "Next 4 hours: Medium confidence predictions", 
                    "Next 24 hours: Pattern-based estimates"
                ]
            },

            expected_output: {
                current_status: {
                    chain,
                    urgency,
                    timestamp: "ISO timestamp",
                    current_gas_gwei: "From getGasPrice",
                    vs_24h_average: "Percentage difference from recent average",
                    trend_direction: "Rising/Stable/Falling"
                },
                timing_recommendations: {
                    immediate: {
                        advice: urgency === 'high' ? 'Execute now' : 'Consider waiting',
                        current_cost_usd: "USD cost at current prices",
                        savings_potential: "0-X% by waiting"
                    },
                    optimal_windows: [
                        {
                            time_window: "Next 2-4 hours",
                            predicted_gas_gwei: "Estimated gas price",
                            potential_savings_pct: "X% vs current",
                            potential_savings_usd: "USD savings amount",
                            confidence: "High/Medium/Low"
                        }
                    ]
                },
                historical_insights: {
                    best_time_today: "Historically cheapest hour",
                    worst_time_today: "Historically most expensive hour",
                    weekly_pattern: "Cheapest day of week typically",
                    volatility_score: "How unpredictable gas prices are"
                },
                urgency_guidance: {
                    low_urgency: "Wait for next optimal window (up to 24h)",
                    medium_urgency: "Consider waiting 2-4 hours if savings > 15%",
                    high_urgency: "Execute within next hour with minor optimization"
                }
            }
        };
    }
};

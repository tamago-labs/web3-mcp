import { z } from "zod";
import { type McpTool } from "../../types";

export const WhaleGetLargeTransfersTool: McpTool = {
    name: "whale_get_large_transfers",
    description: "Monitor large token transfers (whale movements) using cached Nodit API integration",
    schema: {
        token_symbol: z.string().optional().describe("Token symbol to monitor (e.g., USDC, WETH)"),
        contract_address: z.string().optional().describe("Token contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to monitor"),
        min_usd_amount: z.number().optional().default(100000).describe("Minimum USD value for whale threshold"),
        hours: z.number().optional().default(24).describe("Hours to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { token_symbol, contract_address, chain, min_usd_amount, hours } = input;
        
        return {
            status: "instruction",
            task: "whale_activity_monitor",
            message: "🐋 Whale Activity Monitor - Cached API Approach",
            description: "Track large token transfers efficiently using cached Nodit API specifications",
            
            overview: {
                action: "Monitor large token transfers above threshold",
                target_token: token_symbol || contract_address,
                chain,
                min_usd_amount,
                timeframe: `${hours} hours`,
                whale_threshold: `$${min_usd_amount.toLocaleString()}+`
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
                    action: "Get token transfers in timeframe",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenTransfersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contractAddress: contract_address || "resolved_from_step_1",
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    purpose: "Get all token transfers in the specified timeframe"
                },
                {
                    step: token_symbol && !contract_address ? 3 : 2,
                    action: "Get token price for USD calculation using symbol",
                    tool: "get_token_prices_by_symbols",
                    parameters: {
                        symbols: [token_symbol || "extract_symbol_from_metadata"],
                        currency: "USD"
                    },
                    purpose: "Get current token price to calculate USD values using Pyth (if supported)"
                }
            ],

            whale_analysis: {
                filter_process: [
                    "Extract token decimals from contract metadata",
                    "Convert raw transfer amounts using: formatted_amount = raw_amount / (10^decimals)",
                    "Calculate USD value: formatted_amount * token_price",
                    `Filter transfers where USD value >= $${min_usd_amount.toLocaleString()}`,
                    "Sort by USD value (largest first)",
                    "Identify unique whale addresses and patterns"
                ],
                pattern_detection: [
                    "Categorize by direction: large inflows vs outflows",
                    "Detect accumulation patterns (multiple large purchases)",
                    "Identify distribution events (large sells to multiple addresses)",
                    "Flag exchange interactions vs wallet-to-wallet transfers",
                    "Calculate whale concentration metrics"
                ]
            },

            expected_output: {
                summary: {
                    timeframe: `${hours}h`,
                    total_whale_transfers: "Count of transfers >= threshold",
                    total_volume_usd: "Total USD value of whale activity",
                    largest_transfer: "Largest single transfer details",
                    unique_whales: "Number of unique whale addresses",
                    avg_transfer_size: "Average whale transfer size"
                },
                whale_transfers: [
                    {
                        transaction_hash: "From transfer data",
                        timestamp: "ISO timestamp", 
                        from_address: "Sender address",
                        to_address: "Recipient address",
                        amount_raw: "Raw token amount",
                        amount_formatted: "Human readable amount",
                        usd_value: "USD value using current price",
                        block_number: "Block number",
                        whale_score: "Size percentile vs other transfers"
                    }
                ],
                whale_insights: {
                    market_sentiment: "Accumulation/Distribution/Mixed",
                    whale_behavior: "Analysis of whale patterns",
                    risk_factors: "Concentration and timing risks"
                }
            }
        };
    }
};

export const WhaleMonitorAddressTool: McpTool = {
    name: "whale_monitor_address",
    description: "Monitor specific whale address activity using cached Nodit API integration",
    schema: {
        address: z.string().describe("Whale address to monitor"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism', 'avalanche', 'kaia']).describe("Blockchain to monitor"),
        hours: z.number().optional().default(24).describe("Hours to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, chain, hours } = input;
        
        return {
            status: "instruction",
            task: "whale_address_monitor", 
            message: "🔍 Whale Address Monitor - Cached API Approach",
            description: "Track specific whale address activity efficiently using cached API specs",
            
            overview: {
                action: "Monitor all activity from specific whale address",
                target_address: address,
                chain,
                timeframe: `${hours} hours`,
                analysis_scope: "Token transfers, portfolio changes, trading patterns"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get whale token transfers",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenTransfersByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            accountAddress: address,
                            relation: "both",
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000,
                            withZeroValue: false
                        }
                    },
                    purpose: "Get all token transfers (in/out) for the whale address"
                },
                {
                    step: 2,
                    action: "Get current portfolio snapshot",
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
                    },
                    purpose: "Understand whale's current holdings and positions"
                },
                {
                    step: 3,
                    action: "Get native token balance",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNativeBalanceByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            account: address
                        }
                    },
                    purpose: "Include native token (ETH/MATIC) balance"
                },
                {
                    step: 4,
                    action: "Calculate portfolio values using symbols",
                    tool: "get_token_prices_by_symbols",
                    parameters: {
                        symbols: "Extract symbols from tokens owned (prioritize major tokens: ETH, BTC, USDC, USDT)",
                        currency: "USD"
                    },
                    purpose: "Get current prices to calculate USD values using Pyth for major tokens"
                }
            ],

            whale_analysis: {
                activity_metrics: [
                    "Calculate transfer frequency and volume patterns",
                    "Identify preferred tokens and trading pairs",
                    "Detect timing patterns (day/hour preferences)",
                    "Analyze counterparty relationships"
                ],
                portfolio_analysis: [
                    "Current portfolio composition and diversity",
                    "Net position changes per token during timeframe",
                    "Portfolio concentration risk assessment",
                    "Asset allocation shifts and rebalancing"
                ],
                behavior_patterns: [
                    "Accumulation vs distribution phases",
                    "DeFi interaction patterns",
                    "Exchange usage patterns",
                    "Risk management indicators"
                ]
            },

            expected_output: {
                whale_profile: {
                    address,
                    chain,
                    analysis_period: `${hours}h`,
                    portfolio_size_usd: "Total portfolio value",
                    activity_level: "High/Medium/Low based on transfer frequency"
                },
                activity_summary: {
                    total_transfers: "Number of transfers in period",
                    tokens_traded: "Number of different tokens interacted with",
                    total_volume_usd: "Total USD value moved",
                    largest_move: "Largest single transfer",
                    net_flow_direction: "Overall inbound/outbound flow"
                },
                token_movements: [
                    {
                        token_contract: "Contract address",
                        token_symbol: "Token symbol",
                        token_name: "Token name",
                        inbound_amount: "Total received",
                        outbound_amount: "Total sent", 
                        net_change: "Net position change",
                        current_balance: "Current holdings",
                        usd_value: "USD value of movements"
                    }
                ],
                trading_insights: {
                    primary_activity: "Most active token/sector",
                    whale_behavior: "Accumulating/Distributing/Day Trading",
                    risk_profile: "Conservative/Moderate/Aggressive",
                    market_impact: "Potential impact assessment"
                }
            }
        };
    }
};

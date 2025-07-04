import { z } from "zod";
import { type McpTool } from "../../types";

export const WhaleGetLargeTransfersTool: McpTool = {
    name: "whale_get_large_transfers",
    description: "Monitor large token transfers (whale movements) using Nodit MCP integration",
    schema: {
        token_symbol: z.string().optional().describe("Token symbol to monitor (e.g., USDC, WETH)"),
        contract_address: z.string().optional().describe("Token contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to monitor"),
        min_usd_amount: z.number().optional().default(100000).describe("Minimum USD value for whale threshold"),
        hours: z.number().optional().default(24).describe("Hours to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { token_symbol, contract_address, chain, min_usd_amount, hours } = input;
        
        return {
            status: "instruction",
            task: "whale_activity_monitor",
            message: "🐋 Whale Activity Monitor - Use Nodit MCP Tools",
            description: "Track large token transfers and whale movements using Nodit MCP server",
            
            overview: {
                action: "Monitor large token transfers above threshold",
                target_token: token_symbol || contract_address,
                chain,
                min_usd_amount,
                timeframe: `${hours} hours`,
                whale_threshold: `$${min_usd_amount.toLocaleString()}+`
            },

            next_steps: [
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
                        tool: "call_nodit_api",
                        operationId: "searchTokenContractMetadataByKeyword",
                        parameters: {
                            protocol: chain,
                            network: "mainnet",
                            requestBody: { keyword: token_symbol }
                        }
                    }
                }] : []),
                {
                    step: token_symbol && !contract_address ? 2 : 1,
                    action: "Get token transfers",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTokenTransfersByContract",
                        requestBody: {
                            contractAddress: contract_address || "resolved_from_step_1",
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    expected_result: "List of all token transfers in the specified timeframe"
                },
                {
                    step: token_symbol && !contract_address ? 3 : 2,
                    action: "Get token price",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTokenPricesByContracts",
                        requestBody: {
                            contracts: [contract_address || "resolved_contract"]
                        }
                    },
                    purpose: "Convert transfer amounts to USD values"
                }
            ],

            process_results: {
                filter_whales: [
                    "Convert raw amounts using token decimals from contract metadata",
                    `Calculate USD value: (amount * token_price)`,
                    `Filter transfers >= $${min_usd_amount.toLocaleString()}`,
                    "Sort by USD value (largest first)",
                    "Identify unique whale addresses"
                ],
                whale_analysis: [
                    "Categorize by transfer direction (inbound/outbound)",
                    "Detect accumulation vs distribution patterns",
                    "Identify exchange vs wallet transfers",
                    "Calculate total whale volume"
                ]
            },

            expected_final_format: {
                filters: {
                    token: token_symbol || contract_address,
                    chain,
                    min_usd_amount,
                    timeframe: `${hours}h`
                },
                timestamp: "ISO timestamp",
                whale_transfers: [
                    {
                        transaction_hash: "From transfer data",
                        from_address: "From transfer data",
                        to_address: "From transfer data",
                        amount: "Raw token amount",
                        amount_formatted: "Human readable amount using decimals",
                        usd_value: "Calculated using token price",
                        block_number: "From transfer data",
                        timestamp: "From transfer data"
                    }
                ],
                summary: {
                    total_whale_transfers: "Count of transfers above threshold",
                    total_volume_usd: "Total USD value of whale transfers",
                    largest_transfer_usd: "Largest single transfer value",
                    unique_whale_addresses: "Count of unique whale addresses"
                }
            },

            cost_optimization: {
                instruction_efficiency: "Pre-structured whale analysis vs manual API exploration",
                nodit_mcp_coordination: "Single instruction set vs multiple API interpretations",
                token_savings: "90% reduction in whale monitoring overhead"
            }
        };
    }
};

export const WhaleMonitorAddressTool: McpTool = {
    name: "whale_monitor_address",
    description: "Monitor specific whale address activity using Nodit MCP integration",
    schema: {
        address: z.string().describe("Whale address to monitor"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to monitor"),
        hours: z.number().optional().default(24).describe("Hours to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, chain, hours } = input;
        
        return {
            status: "instruction",
            task: "whale_address_monitor", 
            message: "🔍 Whale Address Monitor - Use Nodit MCP Tools",
            description: "Track specific whale address activity and token movements",
            
            overview: {
                action: "Monitor all activity from specific whale address",
                target_address: address,
                chain,
                timeframe: `${hours} hours`,
                analysis_scope: "Token transfers, transactions, portfolio changes"
            },

            next_steps: [
                {
                    step: 1,
                    action: "Get whale token transfers",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTokenTransfersByAccount",
                        requestBody: {
                            account: address,
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    expected_result: "All token transfers (in/out) for the whale address"
                },
                {
                    step: 2,
                    action: "Get whale transactions",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTransactionsByAccount",
                        requestBody: {
                            account: address,
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 500
                        }
                    },
                    purpose: "Context for understanding transfer patterns"
                },
                {
                    step: 3,
                    action: "Get current portfolio (optional)",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTokensOwnedByAccount",
                        requestBody: {
                            account: address
                        }
                    },
                    purpose: "Understand whale's current position and holdings"
                },
                {
                    step: 4,
                    action: "Calculate transfer values",
                    tool: "call_nodit_api",
                    parameters: {
                        protocol: chain,
                        network: "mainnet",
                        operationId: "getTokenPricesByContracts",
                        requestBody: {
                            contracts: "Extract unique token contracts from step 1 transfers"
                        }
                    },
                    purpose: "Convert all transfer amounts to USD values"
                }
            ],

            process_results: {
                activity_analysis: [
                    "Categorize transfers: Inbound vs Outbound",
                    "Identify largest movements by USD value", 
                    "Detect new token acquisitions or full exits",
                    "Calculate net flow per token",
                    "Identify interaction patterns (DEX, CEX, etc.)"
                ],
                behavior_patterns: [
                    "Accumulation vs distribution detection",
                    "Trading frequency analysis",
                    "Preferred token analysis",
                    "Timing pattern recognition"
                ]
            },

            expected_final_format: {
                address,
                chain,
                timeframe: `${hours}h`,
                timestamp: "ISO timestamp",
                activity_summary: {
                    total_transactions: "Count from step 2",
                    total_token_transfers: "Count from step 1", 
                    tokens_interacted: "Number of different tokens",
                    total_value_moved_usd: "Sum of all transfer values",
                    net_flow_direction: "Net inbound/outbound"
                },
                token_movements: [
                    {
                        token_contract: "From transfers",
                        token_symbol: "From contract metadata",
                        inbound_amount: "Total received",
                        outbound_amount: "Total sent",
                        net_flow: "Net change", 
                        usd_value: "USD value of net flow",
                        transfer_count: "Number of transfers"
                    }
                ],
                significant_transfers: [
                    {
                        transaction_hash: "From transfer data",
                        direction: "inbound/outbound",
                        token: "Token symbol",
                        amount: "Transfer amount",
                        usd_value: "USD value using prices",
                        counterparty: "Other address involved",
                        timestamp: "Transfer time"
                    }
                ],
                whale_insights: {
                    behavior_pattern: "Accumulating/Distributing/Trading",
                    primary_tokens: "Most active tokens",
                    activity_level: "High/Medium/Low vs historical"
                }
            },

            cost_optimization: {
                comprehensive_analysis: "Pre-defined whale analysis patterns",
                structured_data_processing: "Efficient data aggregation and processing",
                token_savings: "90% reduction in whale monitoring complexity"
            }
        };
    }
};

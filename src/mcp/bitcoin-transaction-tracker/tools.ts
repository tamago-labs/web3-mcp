import { z } from "zod";
import { type McpTool } from "../../types";

export const BitcoinTxGetDetailsTool: McpTool = {
    name: "bitcoin_tx_get_details",
    description: "Get detailed Bitcoin transaction analysis using cached API integration",
    schema: {
        transaction_id: z.string().describe("Bitcoin transaction ID (hash)"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        include_flow_analysis: z.boolean().optional().default(true).describe("Include transaction flow analysis")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { transaction_id, protocol = 'bitcoin', network = 'mainnet', include_flow_analysis } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_transaction_analysis",
            message: "🔍 Bitcoin Transaction Analysis - Cached API Approach",
            description: "Get comprehensive Bitcoin transaction analysis using cached API specs",
            
            overview: {
                action: "Analyze Bitcoin transaction structure and flows",
                target_transaction: transaction_id,
                protocol,
                network,
                include_flow_analysis
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get transaction details",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getTransactionByTransactionId",
                        protocol,
                        network,
                        request_body: {
                            transactionId: transaction_id
                        }
                    },
                    expected_result: "Complete transaction structure with inputs/outputs"
                },
                {
                    step: 2,
                    action: include_flow_analysis ? "Analyze input/output flows" : "Skip flow analysis",
                    note: include_flow_analysis ? "Extract addresses from inputs/outputs for flow analysis" : "Basic transaction info only",
                    purpose: include_flow_analysis ? "Understand transaction patterns and relationships" : "Standard transaction details"
                }
            ],

            transaction_analysis: {
                structure_analysis: [
                    "Parse transaction inputs and outputs",
                    "Calculate total input and output values",
                    "Determine transaction fee",
                    "Analyze transaction size and efficiency"
                ],
                flow_analysis: include_flow_analysis ? [
                    "Map input sources and output destinations", 
                    "Identify potential change outputs",
                    "Detect consolidation vs payment patterns",
                    "Analyze privacy characteristics"
                ] : ["Flow analysis skipped"],
                technical_metrics: [
                    "Calculate fee rate (sat/vB)",
                    "Assess transaction priority and confirmation",
                    "Analyze script types and efficiency",
                    "Evaluate transaction complexity"
                ]
            },

            expected_output: {
                transaction_overview: {
                    transaction_id,
                    protocol,
                    network,
                    timestamp: "ISO timestamp",
                    block_height: "Block containing transaction",
                    confirmations: "Number of confirmations"
                },
                transaction_structure: {
                    size_bytes: "Transaction size in bytes",
                    virtual_size: "Virtual size (vBytes)",
                    weight: "Transaction weight units",
                    version: "Transaction version",
                    locktime: "Transaction locktime"
                },
                inputs_analysis: {
                    input_count: "Number of inputs",
                    total_input_value: "Sum of all inputs in BTC",
                    input_addresses: "Unique input addresses",
                    input_types: "Script types used in inputs"
                },
                outputs_analysis: {
                    output_count: "Number of outputs",
                    total_output_value: "Sum of all outputs in BTC",
                    output_addresses: "Unique output addresses",
                    output_types: "Script types used in outputs",
                    potential_change: include_flow_analysis ? "Likely change output identification" : null
                },
                fee_analysis: {
                    fee_amount: "Transaction fee in BTC",
                    fee_rate: "Fee rate in sat/vB",
                    fee_efficiency: "Efficient/Average/Expensive",
                    rbf_enabled: "Replace-by-fee status"
                },
                flow_insights: include_flow_analysis ? {
                    transaction_type: "Payment/Consolidation/Distribution/Unknown",
                    privacy_score: "Transaction privacy rating (0-100)",
                    consolidation_ratio: "Input to output ratio",
                    address_reuse: "Whether addresses are reused"
                } : null,
                network_context: {
                    block_position: "Position within block",
                    confirmation_time: "Time to first confirmation",
                    network_fee_context: "Relative to network average fees"
                }
            }
        };
    }
};

export const BitcoinTxTrackAddressActivityTool: McpTool = {
    name: "bitcoin_tx_track_address_activity",
    description: "Track Bitcoin address transaction activity using cached API integration",
    schema: {
        address: z.string().describe("Bitcoin address to monitor"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        limit: z.number().optional().default(25).describe("Number of recent transactions"),
        include_mempool: z.boolean().optional().default(false).describe("Include unconfirmed transactions")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, protocol = 'bitcoin', network = 'mainnet', limit, include_mempool } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_address_activity_tracking",
            message: "📊 Bitcoin Address Activity Tracking - Cached API Approach",
            description: "Track Bitcoin address activity patterns using cached API specs",
            
            overview: {
                action: "Monitor Bitcoin address transaction activity",
                target_address: address,
                protocol,
                network,
                transaction_limit: limit,
                include_unconfirmed: include_mempool
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get recent transaction activity",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getNativeTokenTransfersByAccount",
                        protocol,
                        network,
                        request_body: {
                            accountAddress: address,
                            page: 1,
                            rpp: limit,
                            withCount: true
                        }
                    },
                    expected_result: "Recent Bitcoin transfers with amounts and directions"
                },
                {
                    step: 2,
                    action: "Get comprehensive transaction list",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getTransactionsByAccount",
                        protocol,
                        network,
                        request_body: {
                            account: address,
                            page: 1,
                            rpp: limit
                        }
                    },
                    expected_result: "Transaction IDs and basic metadata"
                },
                {
                    step: 3,
                    action: "Get current UTXO status",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getUnspentTransactionOutputsByAccount",
                        protocol,
                        network,
                        request_body: {
                            accountAddress: address,
                            page: 1,
                            rpp: 100
                        }
                    },
                    purpose: "Understand current spendable balance"
                }
            ],

            activity_analysis: {
                transaction_patterns: [
                    "Analyze transaction frequency and timing",
                    "Identify activity bursts and quiet periods",
                    "Detect regular vs irregular patterns",
                    "Calculate average time between transactions"
                ],
                value_flow_analysis: [
                    "Track incoming vs outgoing value flows",
                    "Identify largest transactions",
                    "Calculate net flow trends",
                    "Detect accumulation or distribution patterns"
                ],
                behavioral_indicators: [
                    "Classify address usage patterns",
                    "Detect potential exchange interactions",
                    "Identify savings vs active trading behavior",
                    "Assess privacy practices"
                ]
            },

            expected_output: {
                address_profile: {
                    address,
                    protocol,
                    network,
                    analysis_period: `Last ${limit} transactions`,
                    timestamp: "ISO timestamp"
                },
                activity_summary: {
                    total_transactions: "Lifetime transaction count",
                    recent_transactions: "Transactions in analysis period",
                    last_activity: "Most recent transaction timestamp",
                    activity_frequency: "Transactions per day average",
                    dormancy_periods: "Longest inactive periods"
                },
                value_flows: {
                    total_received_lifetime: "Total BTC ever received",
                    total_sent_lifetime: "Total BTC ever sent",
                    recent_received: "BTC received in period",
                    recent_sent: "BTC sent in period",
                    net_flow_recent: "Net flow in analysis period",
                    largest_single_tx: "Largest transaction ever"
                },
                recent_activity: [
                    {
                        transaction_id: "Transaction hash",
                        timestamp: "Transaction time",
                        direction: "incoming/outgoing",
                        amount: "Transaction amount in BTC",
                        block_height: "Block number",
                        confirmations: "Number of confirmations"
                    }
                ],
                current_status: {
                    current_balance: "Current spendable balance",
                    utxo_count: "Number of unspent outputs",
                    largest_utxo: "Largest spendable amount",
                    address_reuse: "Recent address reuse patterns"
                },
                activity_insights: {
                    address_type: "Personal/Exchange/Service/Cold Storage",
                    usage_pattern: "HODLing/Trading/Payments/Business",
                    activity_trend: "Increasing/Stable/Decreasing",
                    privacy_score: "Address privacy practices rating",
                    risk_indicators: "Potential flags or concerns"
                }
            }
        };
    }
};

export const BitcoinTxBatchAnalysisTool: McpTool = {
    name: "bitcoin_tx_batch_analysis",
    description: "Analyze multiple Bitcoin transactions simultaneously using cached API",
    schema: {
        transaction_ids: z.array(z.string()).describe("Array of Bitcoin transaction IDs"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        analysis_type: z.enum(['basic', 'detailed', 'comparative']).optional().default('basic').describe("Level of analysis")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { transaction_ids, protocol = 'bitcoin', network = 'mainnet', analysis_type } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_batch_transaction_analysis",
            message: "📈 Bitcoin Batch Transaction Analysis - Cached API Approach", 
            description: "Analyze multiple Bitcoin transactions efficiently using cached API specs",
            
            overview: {
                action: "Batch analysis of multiple Bitcoin transactions",
                transaction_count: transaction_ids.length,
                protocol,
                network,
                analysis_depth: analysis_type
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get details for all transactions",
                    note: `Process ${transaction_ids.length} transactions`,
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getTransactionByTransactionId",
                        protocol,
                        network,
                        request_body: {
                            transactionId: "Process each ID from the array"
                        }
                    },
                    expected_result: "Complete transaction details for all provided IDs"
                }
            ],

            batch_analysis: {
                basic_metrics: [
                    "Calculate aggregate statistics",
                    "Identify patterns across transactions",
                    "Compare fee rates and efficiency",
                    "Analyze timing and block distribution"
                ],
                detailed_analysis: analysis_type === 'detailed' ? [
                    "Deep dive into transaction structures",
                    "Analyze input/output patterns",
                    "Identify common addresses or entities",
                    "Assess privacy and clustering risks"
                ] : ["Detailed analysis not requested"],
                comparative_analysis: analysis_type === 'comparative' ? [
                    "Compare transaction characteristics",
                    "Identify outliers and anomalies",
                    "Rank by various metrics",
                    "Find correlations and relationships"
                ] : ["Comparative analysis not requested"]
            },

            expected_output: {
                batch_overview: {
                    transaction_count: transaction_ids.length,
                    protocol,
                    network,
                    analysis_type,
                    timestamp: "ISO timestamp"
                },
                aggregate_statistics: {
                    total_value_transferred: "Sum of all transaction values",
                    total_fees_paid: "Sum of all transaction fees",
                    average_fee_rate: "Mean fee rate across transactions",
                    size_distribution: "Transaction size statistics",
                    confirmation_times: "Average confirmation time"
                },
                transaction_summary: [
                    {
                        transaction_id: "Transaction hash",
                        block_height: "Block number",
                        value: "Transaction value",
                        fee: "Transaction fee",
                        fee_rate: "Fee rate in sat/vB",
                        size: "Transaction size",
                        efficiency_score: "Relative efficiency rating"
                    }
                ],
                pattern_analysis: {
                    common_addresses: "Addresses appearing in multiple transactions",
                    timing_patterns: "Transaction timing relationships",
                    value_patterns: "Similar value amounts or patterns",
                    fee_optimization: "Fee efficiency compared to network"
                },
                anomaly_detection: analysis_type !== 'basic' ? {
                    outlier_transactions: "Transactions with unusual characteristics",
                    suspicious_patterns: "Potentially concerning patterns",
                    clustering_risks: "Address clustering vulnerabilities"
                } : null
            }

        };
    }
};

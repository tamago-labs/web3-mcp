import { z } from "zod";
import { type McpTool } from "../../types";

export const BitcoinWalletGetBalanceTool: McpTool = {
    name: "bitcoin_wallet_get_balance",
    description: "Get Bitcoin wallet balance and UTXO analysis using cached API integration",
    schema: {
        address: z.string().describe("Bitcoin address (Legacy, P2SH, Bech32, Bech32m)"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        include_utxos: z.boolean().optional().default(true).describe("Include UTXO analysis")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, protocol = 'bitcoin', network = 'mainnet', include_utxos } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_wallet_balance_analysis",
            message: "₿ Bitcoin Wallet Balance Analysis - Cached API Approach",
            description: "Get comprehensive Bitcoin wallet balance and UTXO analysis using cached API specs",
            
            overview: {
                action: "Analyze Bitcoin wallet balance and UTXO composition",
                target_address: address,
                protocol,
                network,
                include_utxo_analysis: include_utxos
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get Bitcoin balance",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getNativeTokenBalanceByAccount",
                        protocol,
                        network,
                        request_body: {
                            accountAddress: address
                        }
                    },
                    expected_result: "Current Bitcoin balance for the address"
                },
                {
                    step: 2,
                    action: include_utxos ? "Get UTXO analysis" : "Skip UTXO analysis",
                    tool: include_utxos ? "cached_bitcoin_api" : null,
                    parameters: include_utxos ? {
                        operation_id: "getUnspentTransactionOutputsByAccount",
                        protocol,
                        network,
                        request_body: {
                            accountAddress: address,
                            page: 1,
                            rpp: 1000,
                            withCount: true
                        }
                    } : null,
                    expected_result: include_utxos ? "Complete UTXO list with values and ages" : "Skipped"
                },
                {
                    step: 3,
                    action: "Get transaction count for context",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getTotalTransactionCountByAccount",
                        protocol,
                        network,
                        request_body: {
                            account: address
                        }
                    },
                    purpose: "Understand wallet activity level"
                }
            ],

            wallet_analysis: {
                balance_processing: [
                    "Convert balance from satoshis to BTC format",
                    "Calculate current USD value using BTC price",
                    "Determine wallet size category (dust/small/medium/large/whale)"
                ],
                utxo_analysis: include_utxos ? [
                    "Analyze UTXO count and distribution",
                    "Calculate UTXO ages and maturity",
                    "Identify dust UTXOs (< 546 satoshis)",
                    "Assess transaction fee implications",
                    "Determine wallet liquidity and spendability"
                ] : ["UTXO analysis skipped"],
                security_insights: [
                    "Identify address type (Legacy/P2SH/Bech32/Bech32m)",
                    "Assess privacy implications of UTXO structure",
                    "Detect potential wallet clustering indicators",
                    "Analyze transaction pattern indicators"
                ]
            },

            expected_output: {
                wallet_overview: {
                    address,
                    protocol,
                    network,
                    timestamp: "ISO timestamp",
                    address_type: "Legacy/P2SH/Bech32/Bech32m"
                },
                balance_details: {
                    balance_satoshis: "Raw balance in satoshis",
                    balance_btc: "Human readable BTC amount",
                    balance_usd: "Estimated USD value",
                    wallet_category: "dust/small/medium/large/whale"
                },
                utxo_analysis: include_utxos ? {
                    total_utxos: "Number of unspent outputs",
                    spendable_utxos: "UTXOs above dust threshold",
                    dust_utxos: "UTXOs below 546 satoshis",
                    largest_utxo: "Largest single UTXO value",
                    average_utxo_size: "Average UTXO value",
                    utxo_age_distribution: {
                        fresh: "UTXOs < 24 hours old",
                        recent: "UTXOs 1-7 days old", 
                        mature: "UTXOs > 7 days old"
                    },
                    estimated_tx_fee: "Estimated fee to spend all UTXOs"
                } : null,
                activity_summary: {
                    total_transactions: "Lifetime transaction count",
                    activity_level: "High/Medium/Low based on tx count",
                    wallet_age_estimate: "Estimated based on oldest UTXO"
                },
                wallet_insights: {
                    liquidity_score: "How easily spendable (0-100)",
                    privacy_score: "UTXO structure privacy rating",
                    optimization_suggestions: [
                        "UTXO consolidation recommendations",
                        "Fee optimization tips",
                        "Privacy improvement suggestions"
                    ]
                }
            }
        };
    }
};

export const BitcoinWalletGetHistoryTool: McpTool = {
    name: "bitcoin_wallet_get_history",
    description: "Get Bitcoin wallet transaction history using cached API integration", 
    schema: {
        address: z.string().describe("Bitcoin address"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        limit: z.number().optional().default(50).describe("Number of recent transactions"),
        include_details: z.boolean().optional().default(true).describe("Include detailed transaction info")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, protocol = 'bitcoin', network = 'mainnet', limit, include_details } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_wallet_history_analysis",
            message: "📊 Bitcoin Wallet History Analysis - Cached API Approach",
            description: "Get comprehensive Bitcoin transaction history using cached API specs",
            
            overview: {
                action: "Analyze Bitcoin wallet transaction history and patterns",
                target_address: address,
                protocol,
                network,
                transaction_limit: limit,
                include_transaction_details: include_details
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get transaction list for address",
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
                    expected_result: "List of recent transactions with basic info"
                },
                {
                    step: 2,
                    action: "Get detailed transaction history with transfers",
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
                    expected_result: "Detailed transfer information with amounts and directions"
                },
                {
                    step: 3,
                    action: include_details ? "Get full transaction details for recent TXs" : "Skip detailed analysis",
                    tool: include_details ? "cached_bitcoin_api" : null,
                    parameters: include_details ? {
                        operation_id: "getTransactionByTransactionId",
                        protocol,
                        network,
                        request_body: {
                            transactionId: "Extract from step 1 results (most recent)"
                        }
                    } : null,
                    purpose: "Get detailed transaction structure for analysis"
                }
            ],

            expected_output: {
                history_overview: {
                    address,
                    protocol,
                    network,
                    analysis_period: `Last ${limit} transactions`,
                    timestamp: "ISO timestamp"
                },
                transaction_summary: {
                    total_transactions: "Total transaction count",
                    incoming_count: "Number of incoming transactions",
                    outgoing_count: "Number of outgoing transactions",
                    first_transaction: "Earliest transaction timestamp",
                    last_transaction: "Most recent transaction timestamp",
                    activity_span: "Days between first and last transaction"
                },
                value_metrics: {
                    total_received: "Total BTC received",
                    total_sent: "Total BTC sent",
                    net_flow: "Net BTC flow (positive = net received)",
                    largest_incoming: "Largest single incoming amount",
                    largest_outgoing: "Largest single outgoing amount",
                    average_tx_size: "Average transaction value"
                },
                transaction_list: [
                    {
                        transaction_id: "Transaction hash",
                        timestamp: "Transaction time",
                        block_height: "Block number",
                        direction: "incoming/outgoing",
                        amount: "Transaction amount in BTC",
                        counterparty: "Other address involved",
                        fee: include_details ? "Transaction fee" : null
                    }
                ],
                activity_patterns: {
                    transaction_frequency: "High/Medium/Low activity",
                    activity_regularity: "Regular/Irregular patterns",
                    preferred_times: "Most active hours/days",
                    dormancy_periods: "Longest inactive periods"
                },
                behavioral_insights: {
                    wallet_type: "Personal/Exchange/Service/Mixer",
                    usage_pattern: "Savings/Trading/Payments/Business",
                    privacy_practices: "Analysis of address reuse patterns",
                    risk_indicators: "Potential concerns or flags"
                }
            }
        };
    }
};

export const BitcoinWalletGetUtxoAnalysisTool: McpTool = {
    name: "bitcoin_wallet_get_utxo_analysis",
    description: "Advanced Bitcoin UTXO analysis for wallet optimization using cached API",
    schema: {
        address: z.string().describe("Bitcoin address"),
        protocol: z.enum(['bitcoin', 'dogecoin']).optional().default('bitcoin').describe("Protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        fee_rate: z.number().optional().default(10).describe("Target fee rate in sat/vB for calculations")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, protocol = 'bitcoin', network = 'mainnet', fee_rate } = input;
        
        return {
            status: "instruction",
            task: "bitcoin_utxo_optimization_analysis",
            message: "🔧 Bitcoin UTXO Optimization Analysis - Cached API Approach",
            description: "Advanced UTXO analysis for wallet optimization using cached API specs",
            
            overview: {
                action: "Comprehensive UTXO analysis for wallet optimization",
                target_address: address,
                protocol,
                network,
                target_fee_rate: `${fee_rate} sat/vB`
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get complete UTXO set",
                    tool: "cached_bitcoin_api",
                    parameters: {
                        operation_id: "getUnspentTransactionOutputsByAccount",
                        protocol,
                        network,
                        request_body: {
                            accountAddress: address,
                            page: 1,
                            rpp: 1000,
                            withCount: true
                        }
                    },
                    expected_result: "Complete UTXO list with values, ages, and metadata"
                }
            ],

            expected_output: {
                utxo_overview: {
                    address,
                    protocol,
                    network,
                    analysis_fee_rate: `${fee_rate} sat/vB`,
                    timestamp: "ISO timestamp"
                },
                utxo_statistics: {
                    total_utxos: "Total number of UTXOs",
                    total_value: "Sum of all UTXO values in BTC",
                    spendable_utxos: "UTXOs above dust threshold",
                    dust_utxos: "UTXOs below economical spending threshold"
                },
                optimization_recommendations: {
                    consolidation_needed: "Whether UTXO consolidation is recommended",
                    optimal_consolidation_strategy: "Best approach for UTXO management",
                    estimated_savings: "Potential fee savings from optimization"
                }
            }
        };
    }
};

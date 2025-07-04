import { z } from "zod";
import { type McpTool } from "../../types";

export const TxGetDetailsTool: McpTool = {
    name: "tx_get_details",
    description: "Get comprehensive transaction details using cached Nodit API integration",
    schema: {
        tx_hash: z.string().describe("Transaction hash to analyze"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network"),
        include_trace: z.boolean().optional().default(false).describe("Include internal transaction trace")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { tx_hash, chain, include_trace } = input;
        
        return {
            status: "instruction",
            task: "transaction_analysis",
            message: "📈 Transaction Analysis - Cached API Approach",
            description: "Get comprehensive transaction details using cached Nodit API specifications",
            
            overview: {
                action: "Analyze transaction details and behavior",
                transaction_hash: tx_hash,
                chain,
                include_internal_trace: include_trace,
                analysis_depth: include_trace ? "Deep analysis with trace" : "Standard analysis"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get basic transaction information",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTransactionByHash",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            transactionHash: tx_hash
                        }
                    },
                    expected_result: "Basic transaction data, status, gas, values"
                },
                {
                    step: 2,
                    action: include_trace ? "Get internal transaction trace" : "Skip internal trace",
                    tool: include_trace ? "cached_nodit_api" : null,
                    parameters: include_trace ? {
                        operation_id: "getInternalTransactionsByTransactionHash",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            transactionHash: tx_hash
                        }
                    } : null,
                    purpose: "Get contract interactions and internal transfers"
                },
                {
                    step: 3,
                    action: "Check for token transfers in transaction",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTokenTransfersByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            accountAddress: "Extract from step 1 (from/to addresses)",
                            fromDate: "Transaction timestamp - 1 minute",
                            toDate: "Transaction timestamp + 1 minute",
                            page: 1,
                            rpp: 100
                        }
                    },
                    purpose: "Identify token transfers within the transaction timeframe"
                }
            ],

            transaction_analysis: {
                basic_analysis: [
                    "Parse transaction status and outcome",
                    "Calculate gas efficiency (used vs limit)",
                    "Analyze transaction value and fees",
                    "Identify transaction type and purpose"
                ],
                advanced_analysis: include_trace ? [
                    "Map contract interaction flow",
                    "Identify function calls and parameters",
                    "Trace internal ETH/native transfers",
                    "Detect contract creation events",
                    "Analyze failure points if transaction failed"
                ] : ["Internal trace analysis skipped - set include_trace=true for deep analysis"],
                pattern_recognition: [
                    "Classify transaction type (transfer, swap, interaction)",
                    "Identify counterparty types (EOA, contract, exchange)",
                    "Detect common interaction patterns",
                    "Assess transaction complexity"
                ]
            },

            expected_output: {
                transaction_summary: {
                    hash: tx_hash,
                    chain,
                    timestamp: "ISO timestamp",
                    status: "success/failed/pending",
                    block_number: "Block containing transaction"
                },
                transaction_details: {
                    from_address: "Sender address",
                    to_address: "Recipient address", 
                    value: "Native token value transferred",
                    gas_limit: "Maximum gas allowed",
                    gas_used: "Actual gas consumed",
                    gas_price: "Gas price in gwei",
                    transaction_fee: "Total fee paid in native token",
                    nonce: "Transaction nonce",
                    input_data: "Transaction input data (if any)"
                },
                internal_transactions: include_trace ? [
                    {
                        type: "call/delegatecall/staticcall/create",
                        from: "Internal call sender",
                        to: "Internal call recipient",
                        value: "Internal transfer amount",
                        gas_used: "Gas for internal operation",
                        success: "Internal call success status"
                    }
                ] : "Internal trace not requested",
                token_transfers: [
                    {
                        token_contract: "Token contract address",
                        token_symbol: "Token symbol",
                        token_name: "Token name",
                        from: "Token sender",
                        to: "Token recipient", 
                        amount_raw: "Raw transfer amount",
                        amount_formatted: "Human readable amount",
                        decimals: "Token decimals"
                    }
                ],
                analysis_results: {
                    transaction_type: "simple_transfer/token_transfer/contract_interaction/dex_swap/etc",
                    complexity_score: "Low/Medium/High based on operations",
                    gas_efficiency: "Efficient/Average/Inefficient",
                    counterparty_analysis: "EOA/Contract/Exchange classification",
                    failure_analysis: "If failed, root cause analysis",
                    estimated_usd_cost: "Transaction cost in USD"
                }
            }
        };
    }
};

export const TxGetAddressActivityTool: McpTool = {
    name: "tx_get_address_activity",
    description: "Get recent transaction activity for an address using cached Nodit API",
    schema: {
        address: z.string().describe("Address to check"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network"),
        limit: z.number().optional().default(10).describe("Number of recent transactions"),
        include_token_transfers: z.boolean().optional().default(true).describe("Include token transfers"),
        hours: z.number().optional().default(24).describe("Hours to look back")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { address, chain, limit, include_token_transfers, hours } = input;
        
        return {
            status: "instruction",
            task: "address_activity_monitor",
            message: "🔍 Address Activity Monitor - Cached API Approach",
            description: "Track recent transaction activity and patterns using cached Nodit API specs",
            
            overview: {
                action: "Monitor recent activity for specific address",
                target_address: address,
                chain,
                transaction_limit: limit,
                timeframe: `${hours} hours`,
                include_token_data: include_token_transfers
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get recent transactions for address",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTransactionsByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            account: address,
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: limit
                        }
                    },
                    expected_result: "Recent transactions with timestamps and details"
                },
                {
                    step: 2,
                    action: include_token_transfers ? "Get recent token transfers" : "Skip token transfers",
                    tool: include_token_transfers ? "cached_nodit_api" : null,
                    parameters: include_token_transfers ? {
                        operation_id: "getTokenTransfersByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            accountAddress: address,
                            relation: "both",
                            fromDate: new Date(Date.now() - (hours * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: limit * 2,
                            withZeroValue: false
                        }
                    } : null,
                    purpose: "Get token transfer activity in the timeframe"
                },
                {
                    step: 3,
                    action: "Get total historical transaction count for context",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTotalTransactionCountByAccount",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            account: address
                        }
                    },
                    purpose: "Understand address activity level and history"
                }
            ],

            activity_analysis: {
                transaction_patterns: [
                    "Analyze transaction frequency and timing",
                    "Identify primary counterparties and interaction types",
                    "Calculate average transaction values and gas usage",
                    "Detect recent changes in activity patterns"
                ],
                token_activity: include_token_transfers ? [
                    "Track token acquisition and distribution patterns",
                    "Identify new token interactions",
                    "Analyze trading vs holding behavior",
                    "Detect high-value token movements"
                ] : ["Token transfer analysis skipped"],
                behavioral_insights: [
                    "Classify address type (EOA, contract, exchange)",
                    "Determine primary use case (trading, DeFi, NFT, etc)",
                    "Assess activity level vs historical baseline",
                    "Identify anomalies or unusual patterns"
                ]
            },

            expected_output: {
                address_profile: {
                    address,
                    chain,
                    analysis_period: `${hours}h`,
                    timestamp: "ISO timestamp"
                },
                activity_summary: {
                    recent_transactions: "Count from getTransactionsByAccount",
                    recent_token_transfers: include_token_transfers ? "Count from getTokenTransfersByAccount" : null,
                    total_historical_transactions: "From getTotalTransactionCountByAccount",
                    last_activity: "Timestamp of most recent transaction",
                    activity_level: "High/Medium/Low based on frequency vs historical"
                },
                recent_transactions: [
                    {
                        hash: "Transaction hash",
                        timestamp: "Transaction time",
                        block_number: "Block number",
                        from: "Sender address",
                        to: "Recipient address",
                        value: "Transaction value in native token",
                        gas_used: "Gas consumed",
                        gas_price: "Gas price in gwei",
                        status: "success/failed",
                        direction: "incoming/outgoing/internal"
                    }
                ],
                token_transfers: include_token_transfers ? [
                    {
                        transaction_hash: "Parent transaction",
                        timestamp: "Transfer time",
                        token_contract: "Token contract address",
                        token_symbol: "Token symbol",
                        token_name: "Token name",
                        from: "Token sender",
                        to: "Token recipient",
                        amount_raw: "Raw transfer amount",
                        amount_formatted: "Human readable amount",
                        direction: "incoming/outgoing"
                    }
                ] : null,
                activity_insights: {
                    address_classification: "EOA/Contract/Exchange/DeFi Protocol/etc",
                    primary_activity: "Trading/DeFi/NFT/Token Distribution/etc",
                    interaction_patterns: "Most frequent counterparty types",
                    value_patterns: "Typical transaction sizes and frequency",
                    gas_efficiency: "Average gas usage patterns",
                    recent_changes: "Notable changes in activity patterns",
                    risk_indicators: "Unusual patterns or potential concerns"
                }
            }
        };
    }
};

export const TxTrackBatchTransactionsTool: McpTool = {
    name: "tx_track_batch_transactions",
    description: "Track multiple transactions simultaneously using cached Nodit API",
    schema: {
        tx_hashes: z.array(z.string()).describe("Array of transaction hashes to track"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network"),
        include_status_summary: z.boolean().optional().default(true).describe("Include batch status summary")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { tx_hashes, chain, include_status_summary } = input;
        
        return {
            status: "instruction",
            task: "batch_transaction_tracking",
            message: "📊 Batch Transaction Tracking - Cached API Approach",
            description: "Track multiple transactions efficiently using cached Nodit API specifications",
            
            overview: {
                action: "Track multiple transactions simultaneously",
                transaction_count: tx_hashes.length,
                chain,
                batch_size: tx_hashes.length,
                include_summary: include_status_summary
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get transaction details for all hashes",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getTransactionsByHashes",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            transactionHashes: tx_hashes.slice(0, 1000) // API limit
                        }
                    },
                    expected_result: "Batch transaction details for all provided hashes"
                }
            ],

            batch_processing: {
                status_analysis: [
                    "Count successful vs failed transactions",
                    "Identify pending transactions",
                    "Calculate batch success rate",
                    "Flag any missing/invalid hashes"
                ],
                performance_metrics: [
                    "Calculate average gas usage across batch",
                    "Analyze gas price variations",
                    "Identify gas efficiency outliers",
                    "Compare timing and block distribution"
                ],
                pattern_detection: [
                    "Identify related transactions (same sender/recipient)",
                    "Detect batch operation patterns",
                    "Find transaction sequences or dependencies",
                    "Analyze value distribution patterns"
                ]
            },

            expected_output: {
                batch_summary: {
                    total_transactions: tx_hashes.length,
                    chain,
                    timestamp: "ISO timestamp",
                    processing_status: "completed/partial/pending"
                },
                status_overview: include_status_summary ? {
                    successful_count: "Number of successful transactions",
                    failed_count: "Number of failed transactions", 
                    pending_count: "Number of pending transactions",
                    not_found_count: "Number of invalid/not found hashes",
                    success_rate: "Percentage of successful transactions"
                } : null,
                transaction_details: [
                    {
                        hash: "Transaction hash",
                        status: "success/failed/pending/not_found",
                        block_number: "Block number (if confirmed)",
                        timestamp: "Transaction timestamp",
                        from: "Sender address",
                        to: "Recipient address",
                        value: "Transaction value",
                        gas_used: "Gas consumed",
                        gas_price: "Gas price in gwei",
                        transaction_fee: "Total fee paid"
                    }
                ],
                batch_analytics: {
                    gas_statistics: {
                        average_gas_used: "Average gas consumption",
                        total_gas_used: "Total gas for all transactions",
                        gas_price_range: "Min and max gas prices",
                        total_fees_paid: "Total fees across batch"
                    },
                    timing_analysis: {
                        earliest_transaction: "Oldest transaction timestamp",
                        latest_transaction: "Newest transaction timestamp",
                        block_span: "Range of blocks containing transactions",
                        time_span: "Time difference between first and last"
                    },
                    pattern_insights: {
                        unique_senders: "Number of unique sender addresses",
                        unique_recipients: "Number of unique recipient addresses", 
                        common_addresses: "Most frequently appearing addresses",
                        transaction_types: "Distribution of transaction types"
                    }
                }
            }
        };
    }
};

import { z } from "zod";
import { type McpTool } from "../../types";

export const BlockGetRecentBlocksTool: McpTool = {
    name: "block_get_recent_blocks",
    description: "Get recent blocks information using cached Nodit API integration",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to query"),
        limit: z.number().optional().default(10).describe("Number of recent blocks to fetch (max 100)")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { chain, limit } = input;

        return {
            status: "instruction",
            task: "recent_blocks_analysis",
            message: "🔗 Recent Blocks Analysis - Cached API Approach",
            description: "Get recent block information using cached Nodit API specifications",

            overview: {
                action: "Retrieve recent blocks with comprehensive information",
                chain,
                block_count: limit
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get recent blocks within range",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getBlocksWithinRange",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            fromBlock: `latest-${limit}`, // Get last N blocks
                            toBlock: "latest",
                            page: 1,
                            rpp: limit
                        }
                    },
                    expected_result: "Recent blocks with full information"
                }
            ],

            block_analysis: {
                metrics_extraction: [
                    "Extract block numbers, timestamps, and hash information",
                    "Calculate block times (time between consecutive blocks)",
                    "Analyze gas usage patterns across blocks",
                    "Count transaction volumes per block"
                ],
                network_insights: [
                    "Calculate average block time",
                    "Analyze gas limit vs gas used efficiency",
                    "Identify blocks with high/low transaction activity",
                    "Detect any unusual patterns in block production"
                ],
                validator_analysis: [
                    "Identify block proposers/miners",
                    "Calculate proposer distribution",
                    "Analyze block size variations",
                    "Track consensus participation"
                ]
            },

            expected_output: {
                chain_info: {
                    chain,
                    timestamp: "ISO timestamp",
                    blocks_analyzed: limit,
                    latest_block: "Highest block number"
                },
                recent_blocks: [
                    {
                        number: "Block number",
                        hash: "Block hash",
                        timestamp: "Block timestamp",
                        parent_hash: "Previous block hash",
                        miner: "Block proposer/miner address",
                        gas_limit: "Maximum gas allowed",
                        gas_used: "Actual gas consumed",
                        gas_utilization: "Percentage of gas limit used",
                        transaction_count: "Number of transactions",
                        block_size: "Block size in bytes",
                        block_time: "Time since previous block (seconds)"
                    }
                ],
                network_metrics: {
                    average_block_time: "Average time between blocks",
                    average_gas_utilization: "Average gas usage percentage",
                    total_transactions: "Total transactions in all blocks",
                    most_active_block: "Block with most transactions",
                    least_active_block: "Block with fewest transactions"
                },
                consensus_insights: {
                    unique_proposers: "Number of different block proposers",
                    most_active_proposer: "Proposer with most blocks",
                    block_time_variance: "Consistency of block timing",
                    network_health: "Overall network performance assessment"
                }
            }

        };
    }
};

export const BlockGetByNumberOrHashTool: McpTool = {
    name: "block_get_by_number_or_hash",
    description: "Get specific block information by number or hash using cached Nodit API",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to query"),
        block: z.string().describe("Block number (e.g., '12345'), hash (0x...), or tag ('latest', 'earliest')")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { chain, block } = input;

        return {
            status: "instruction",
            task: "block_details_analysis",
            message: "🔍 Block Details Analysis - Cached API Approach",
            description: "Get comprehensive block information using cached Nodit API specifications",

            overview: {
                action: "Retrieve detailed information for specific block",
                chain,
                block_identifier: block
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get block details by number or hash",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getBlockByHashOrNumber",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            block: block
                        }
                    },
                    expected_result: "Complete block information with all metadata"
                }
            ],

            block_analysis: {
                basic_info: [
                    "Extract block number, hash, and timestamp",
                    "Identify parent block and chain continuity",
                    "Analyze block proposer/miner information",
                    "Calculate block production time"
                ],
                transaction_analysis: [
                    "Count total transactions in block",
                    "Analyze transaction types and patterns",
                    "Calculate transaction density",
                    "Identify any notable transactions"
                ],
                gas_analysis: [
                    "Analyze gas limit vs gas used",
                    "Calculate gas utilization percentage",
                    "Compare against network averages",
                    "Identify gas efficiency patterns"
                ],
                consensus_data: [
                    "Extract consensus-related metadata",
                    "Analyze block difficulty (if PoW)",
                    "Review validator information (if PoS)",
                    "Check for any consensus anomalies"
                ]
            },

            expected_output: {
                block_info: {
                    chain,
                    block_identifier: block,
                    timestamp: "ISO timestamp"
                },
                block_details: {
                    number: "Block number",
                    hash: "Block hash",
                    parent_hash: "Previous block hash",
                    timestamp: "Block creation timestamp",
                    miner: "Block proposer/miner address",
                    difficulty: "Block difficulty (if applicable)",
                    total_difficulty: "Cumulative difficulty",
                    nonce: "Block nonce",
                    state_root: "State tree root hash",
                    transactions_root: "Transactions tree root hash",
                    receipts_root: "Receipts tree root hash"
                },
                gas_metrics: {
                    gas_limit: "Maximum gas allowed",
                    gas_used: "Actual gas consumed",
                    gas_utilization: "Percentage utilization",
                    base_fee_per_gas: "Base fee (if EIP-1559)",
                    gas_efficiency: "Efficiency assessment"
                },
                transaction_summary: {
                    transaction_count: "Total transactions",
                    transaction_hashes: "List of transaction hashes",
                    transaction_density: "Transactions per KB of block"
                },
                block_metadata: {
                    size: "Block size in bytes",
                    extra_data: "Additional block data",
                    logs_bloom: "Event logs bloom filter",
                    mix_hash: "PoW mix hash (if applicable)",
                    uncle_hash: "Uncle blocks hash"
                },
                consensus_info: {
                    consensus_mechanism: "PoW/PoS identification",
                    block_reward: "Mining/validation reward info",
                    validation_status: "Block validation details"
                }
            }
        };
    }
};

export const BlockAnalyzeTimeRangeTool: McpTool = {
    name: "block_analyze_time_range",
    description: "Analyze blocks within a specific time range using cached Nodit API",
    schema: {
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain to query"),
        from_date: z.string().describe("Start date (ISO format: 2024-01-01T00:00:00Z)"),
        to_date: z.string().describe("End date (ISO format: 2024-01-01T23:59:59Z)"),
        max_blocks: z.number().optional().default(100).describe("Maximum blocks to analyze")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { chain, from_date, to_date, max_blocks } = input;

        return {
            status: "instruction",
            task: "time_range_block_analysis",
            message: "📅 Time Range Block Analysis - Cached API Approach",
            description: "Analyze blocks within specific time period using cached Nodit API specifications",

            overview: {
                action: "Analyze blocks within specified time range",
                chain,
                time_range: `${from_date} to ${to_date}`,
                max_blocks
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get blocks within date range",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getBlocksWithinRange",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            fromDate: from_date,
                            toDate: to_date,
                            page: 1,
                            rpp: max_blocks
                        }
                    },
                    expected_result: "All blocks within the specified time range"
                }
            ],

            time_range_analysis: {
                temporal_patterns: [
                    "Analyze block production frequency over time",
                    "Identify peak and low activity periods",
                    "Calculate time-based block production rates",
                    "Detect any timing anomalies or gaps"
                ],
                network_performance: [
                    "Track gas usage trends over time period",
                    "Analyze transaction volume patterns",
                    "Monitor block size variations",
                    "Assess network congestion levels"
                ],
                validator_activity: [
                    "Track validator/miner participation",
                    "Identify most active block proposers",
                    "Analyze validator distribution patterns",
                    "Monitor consensus health indicators"
                ],
                statistical_analysis: [
                    "Calculate average, median, min, max block times",
                    "Compute gas utilization statistics",
                    "Analyze transaction density distributions",
                    "Generate network health scores"
                ]
            },

            expected_output: {
                analysis_summary: {
                    chain,
                    time_range: `${from_date} to ${to_date}`,
                    total_blocks_found: "Number of blocks in range",
                    time_span_hours: "Actual time span covered",
                    timestamp: "Analysis timestamp"
                },
                temporal_metrics: {
                    average_block_time: "Average time between blocks",
                    median_block_time: "Median time between blocks",
                    min_block_time: "Fastest block production",
                    max_block_time: "Slowest block production",
                    block_time_variance: "Consistency of block timing"
                },
                network_activity: {
                    total_transactions: "Total transactions in period",
                    average_transactions_per_block: "Average transaction density",
                    peak_activity_block: "Block with highest activity",
                    low_activity_periods: "Periods with minimal activity",
                    gas_utilization_trend: "Gas usage pattern over time"
                },
                validator_insights: {
                    unique_validators: "Number of different block proposers",
                    most_active_validator: "Validator with most blocks",
                    validator_distribution: "Distribution of block production",
                    consensus_participation: "Overall validator participation rate"
                },
                network_health: {
                    consistency_score: "Block production consistency (0-100)",
                    efficiency_score: "Gas utilization efficiency (0-100)",
                    decentralization_score: "Validator distribution score (0-100)",
                    overall_health: "Combined network health assessment"
                }
            }
        };
    }
};

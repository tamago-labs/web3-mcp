import { z } from "zod";
import { type McpTool } from "../../types";

// Cached Aptos GraphQL queries for efficient tool operation
const CACHED_APTOS_QUERIES = {
    coin_activities: {
        queryName: "coin_activities",
        description: "Get coin activities for addresses or contracts",
        query: `
            query GetCoinActivities($address: String, $coin_type: String, $limit: Int, $activity_types: [String!], $start_time: timestamp) {
                coin_activities(
                    where: {
                        owner_address: {_eq: $address}
                        ${`coin_type: {_eq: $coin_type}`}
                        ${`activity_type: {_in: $activity_types}`}
                        ${`transaction_timestamp: {_gte: $start_time}`}
                    }
                    limit: $limit
                    order_by: {transaction_timestamp: desc}
                ) {
                    activity_type
                    amount
                    block_height
                    coin_type
                    entry_function_id_str
                    event_account_address
                    is_gas_fee
                    is_transaction_success
                    owner_address
                    storage_refund_amount
                    transaction_timestamp
                    transaction_version
                    coin_info {
                        name
                        symbol
                        decimals
                        supply_aggregator_table_handle
                        creator_address
                    }
                }
            }
        `,
        variables: {
            address: { type: "String", required: false },
            coin_type: { type: "String", required: false },
            limit: { type: "Int", default: 100 },
            activity_types: { type: "[String!]", required: false },
            start_time: { type: "timestamp", required: false }
        }
    },
    current_coin_balances: {
        queryName: "current_coin_balances", 
        description: "Get current coin balances for addresses",
        query: `
            query GetCurrentCoinBalances($address: String, $coin_types: [String!]) {
                current_coin_balances(
                    where: {
                        owner_address: {_eq: $address}
                        ${`coin_type: {_in: $coin_types}`}
                        amount: {_gt: "0"}
                    }
                ) {
                    amount
                    coin_type
                    coin_type_hash
                    last_transaction_timestamp
                    last_transaction_version
                    owner_address
                    coin_info {
                        name
                        symbol
                        decimals
                        creator_address
                        supply_aggregator_table_handle
                    }
                }
            }
        `,
        variables: {
            address: { type: "String", required: true },
            coin_types: { type: "[String!]", required: false }
        }
    },
    coin_infos: {
        queryName: "coin_infos",
        description: "Get coin metadata and information",
        query: `
            query GetCoinInfos($coin_types: [String!], $creator_address: String) {
                coin_infos(
                    where: {
                        ${`coin_type: {_in: $coin_types}`}
                        ${`creator_address: {_eq: $creator_address}`}
                    }
                ) {
                    coin_type
                    name
                    symbol
                    decimals
                    creator_address
                    supply_aggregator_table_handle
                }
            }
        `,
        variables: {
            coin_types: { type: "[String!]", required: false },
            creator_address: { type: "String", required: false }
        }
    },
    liquidity_activities: {
        queryName: "liquidity_activities",
        description: "Get liquidity pool activities (deposits/withdrawals)",
        query: `
            query GetLiquidityActivities($pool_address: String, $coin_types: [String!], $limit: Int, $start_time: timestamp) {
                coin_activities(
                    where: {
                        ${`event_account_address: {_eq: $pool_address}`}
                        ${`coin_type: {_in: $coin_types}`}
                        activity_type: {_in: ["0x1::coin::DepositEvent", "0x1::coin::WithdrawEvent"]}
                        ${`transaction_timestamp: {_gte: $start_time}`}
                    }
                    limit: $limit
                    order_by: {transaction_timestamp: desc}
                ) {
                    activity_type
                    amount
                    block_height
                    coin_type
                    entry_function_id_str
                    event_account_address
                    owner_address
                    transaction_timestamp
                    transaction_version
                    coin_info {
                        name
                        symbol
                        decimals
                    }
                }
            }
        `,
        variables: {
            pool_address: { type: "String", required: false },
            coin_types: { type: "[String!]", required: false },
            limit: { type: "Int", default: 100 },
            start_time: { type: "timestamp", required: false }
        }
    },
    protocol_activities: {
        queryName: "protocol_activities",
        description: "Get DeFi protocol specific activities",
        query: `
            query GetProtocolActivities($protocol_address: String, $user_address: String, $function_filter: [String!], $start_time: timestamp, $limit: Int) {
                coin_activities(
                    where: {
                        event_account_address: {_eq: $protocol_address}
                        ${`owner_address: {_eq: $user_address}`}
                        ${`entry_function_id_str: {_in: $function_filter}`}
                        ${`transaction_timestamp: {_gte: $start_time}`}
                    }
                    limit: $limit
                    order_by: {transaction_timestamp: desc}
                ) {
                    activity_type
                    amount
                    block_height
                    coin_type
                    entry_function_id_str
                    event_account_address
                    is_gas_fee
                    is_transaction_success
                    owner_address
                    transaction_timestamp
                    transaction_version
                    coin_info {
                        name
                        symbol
                        decimals
                    }
                }
            }
        `,
        variables: {
            protocol_address: { type: "String", required: true },
            user_address: { type: "String", required: false },
            function_filter: { type: "[String!]", required: false },
            start_time: { type: "timestamp", required: false },
            limit: { type: "Int", default: 1000 }
        }
    },
    token_activities: {
        queryName: "token_activities",
        description: "Get token (NFT) activities on Aptos",
        query: `
            query GetTokenActivities($address: String, $token_data_id: String, $limit: Int, $start_time: timestamp) {
                token_activities(
                    where: {
                        ${`from_address: {_eq: $address}`}
                        ${`to_address: {_eq: $address}`}
                        ${`token_data_id_hash: {_eq: $token_data_id}`}
                        ${`transaction_timestamp: {_gte: $start_time}`}
                    }
                    limit: $limit
                    order_by: {transaction_timestamp: desc}
                ) {
                    transaction_version
                    event_account_address
                    event_creation_number
                    event_sequence_number
                    collection_data_id_hash
                    token_data_id_hash
                    property_version
                    transfer_type
                    from_address
                    to_address
                    token_amount
                    transaction_timestamp
                    coin_type
                    coin_amount
                }
            }
        `,
        variables: {
            address: { type: "String", required: false },
            token_data_id: { type: "String", required: false },
            limit: { type: "Int", default: 100 },
            start_time: { type: "timestamp", required: false }
        }
    }
};

export const CachedAptosApiTool: McpTool = {
    name: "cached_aptos_api",
    description: "Make Aptos Indexer API calls with pre-cached GraphQL queries for efficient operation",
    schema: {
        query_name: z.enum([
            'coin_activities',
            'current_coin_balances',
            'coin_infos', 
            'liquidity_activities',
            'protocol_activities',
            'token_activities'
        ]).describe("Aptos GraphQL query to execute"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Aptos network"),
        variables: z.record(z.any()).describe("GraphQL query variables")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { query_name, network = 'mainnet', variables } = input;
        
        // Get cached query
        const querySpec = CACHED_APTOS_QUERIES[query_name as keyof typeof CACHED_APTOS_QUERIES];
        if (!querySpec) {
            return {
                status: "error",
                message: `Unknown Aptos query: ${query_name}`,
                available_queries: Object.keys(CACHED_APTOS_QUERIES)
            };
        }

        return {
            status: "success",
            query_name,
            network,
            
            graphql_spec: {
                queryName: querySpec.queryName,
                description: querySpec.description,
                query: querySpec.query,
                variables: querySpec.variables
            },
            
            call_instruction: {
                tool: "call_nodit_aptos_indexer_api",
                parameters: {
                    network,
                    requestBody: {
                        query: querySpec.query,
                        variables: variables
                    }
                }
            },
            
            query_variables: variables,
            
            validation: {
                valid_query: true,
                network_supported: ['mainnet', 'testnet'].includes(network),
                query_cached: true
            }, 
        };
    }
};

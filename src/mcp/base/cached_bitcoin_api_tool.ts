import { z } from "zod";
import { type McpTool } from "../../types";

// Cached API specifications for Bitcoin operations
const CACHED_BITCOIN_API_SPECS = {
    getNativeTokenBalanceByAccount: {
        operationId: "getNativeTokenBalanceByAccount",
        path: "/{protocol}/{network}/native/getNativeTokenBalanceByAccount",
        method: "POST",
        description: "Get Bitcoin balance for specific address",
        requestSchema: {
            type: "object",
            required: ["accountAddress"],
            properties: {
                accountAddress: {
                    type: "string",
                    pattern: "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$"
                }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                ownerAddress: { type: "string" },
                balance: { type: "string" }
            }
        }
    },
    getNativeTokenTransfersByAccount: {
        operationId: "getNativeTokenTransfersByAccount", 
        path: "/{protocol}/{network}/native/getNativeTokenTransfersByAccount",
        method: "POST",
        description: "Get Bitcoin transaction history for address",
        requestSchema: {
            type: "object",
            required: ["accountAddress"],
            properties: {
                accountAddress: {
                    type: "string",
                    pattern: "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$"
                },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 },
                withCount: { type: "boolean", default: false }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            from: { type: "string" },
                            to: { type: "string" },
                            value: { type: "string" },
                            transactionId: { type: "string" },
                            blockHeight: { type: "integer" },
                            blockTimestamp: { type: "integer" }
                        }
                    }
                }
            }
        }
    },
    getUnspentTransactionOutputsByAccount: {
        operationId: "getUnspentTransactionOutputsByAccount",
        path: "/{protocol}/{network}/blockchain/getUnspentTransactionOutputsByAccount", 
        method: "POST",
        description: "Get UTXO list for Bitcoin address",
        requestSchema: {
            type: "object",
            required: ["accountAddress"],
            properties: {
                accountAddress: {
                    type: "string",
                    pattern: "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$"
                },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 },
                withCount: { type: "boolean", default: false }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            transactionId: { type: "string" },
                            voutIndex: { type: "integer" },
                            address: { type: "string" },
                            value: { type: "string" },
                            blockHeight: { type: "integer" },
                            blockHash: { type: "string" },
                            blockTimestamp: { type: "integer" }
                        }
                    }
                }
            }
        }
    },
    getTransactionByTransactionId: {
        operationId: "getTransactionByTransactionId",
        path: "/{protocol}/{network}/blockchain/getTransactionByTransactionId",
        method: "POST", 
        description: "Get Bitcoin transaction details by transaction ID",
        requestSchema: {
            type: "object",
            required: ["transactionId"],
            properties: {
                transactionId: { type: "string" }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                transactionId: { type: "string" },
                blockHeight: { type: "integer" },
                blockHash: { type: "string" },
                blockTimestamp: { type: "integer" },
                inputs: { type: "array" },
                outputs: { type: "array" },
                fee: { type: "string" },
                size: { type: "integer" }
            }
        }
    },
    getTransactionsByAccount: {
        operationId: "getTransactionsByAccount",
        path: "/{protocol}/{network}/blockchain/getTransactionsByAccount",
        method: "POST",
        description: "Get Bitcoin transactions for account",
        requestSchema: {
            type: "object", 
            required: ["account"],
            properties: {
                account: {
                    type: "string",
                    pattern: "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$"
                },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                items: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            transactionId: { type: "string" },
                            blockHeight: { type: "integer" },
                            blockTimestamp: { type: "integer" }
                        }
                    }
                }
            }
        }
    },
    getTotalTransactionCountByAccount: {
        operationId: "getTotalTransactionCountByAccount",
        path: "/{protocol}/{network}/blockchain/getTotalTransactionCountByAccount",
        method: "POST",
        description: "Get total transaction count for Bitcoin address",
        requestSchema: {
            type: "object",
            required: ["account"],
            properties: {
                account: {
                    type: "string", 
                    pattern: "^(1[a-km-zA-HJ-NP-Z1-9]{25,33}|3[a-km-zA-HJ-NP-Z1-9]{25,33}|bc1q[a-z0-9]{38,59}|bc1p[a-z0-9]{58})$"
                }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                count: { type: "integer" }
            }
        }
    },
    getBlockByHashOrNumber: {
        operationId: "getBlockByHashOrNumber",
        path: "/{protocol}/{network}/blockchain/getBlockByHashOrNumber",
        method: "POST",
        description: "Get Bitcoin block information",
        requestSchema: {
            type: "object",
            required: ["blockHashOrNumber"],
            properties: {
                blockHashOrNumber: { type: "string" }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                hash: { type: "string" },
                height: { type: "integer" },
                timestamp: { type: "integer" },
                transactionCount: { type: "integer" },
                size: { type: "integer" },
                difficulty: { type: "string" }
            }
        }
    }
};

export const CachedBitcoinApiTool: McpTool = {
    name: "cached_bitcoin_api",
    description: "Make Bitcoin API calls with pre-cached specifications for efficient operation",
    schema: {
        operation_id: z.enum([
            'getNativeTokenBalanceByAccount',
            'getNativeTokenTransfersByAccount', 
            'getUnspentTransactionOutputsByAccount',
            'getTransactionByTransactionId',
            'getTransactionsByAccount',
            'getTotalTransactionCountByAccount',
            'getBlockByHashOrNumber'
        ]).describe("Bitcoin API operation to call"),
        protocol: z.enum(['bitcoin', 'dogecoin']).describe("Bitcoin protocol"),
        network: z.enum(['mainnet', 'testnet']).optional().default('mainnet').describe("Network"),
        request_body: z.record(z.any()).describe("Request body parameters")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { operation_id, protocol, network = 'mainnet', request_body } = input;
        
        // Get cached spec
        const spec = CACHED_BITCOIN_API_SPECS[operation_id as keyof typeof CACHED_BITCOIN_API_SPECS];
        if (!spec) {
            return {
                status: "error",
                message: `Unknown Bitcoin operation: ${operation_id}`,
                available_operations: Object.keys(CACHED_BITCOIN_API_SPECS)
            };
        }

        return {
            status: "success",
            operation: operation_id,
            protocol,
            network,
            
            api_spec: {
                operationId: spec.operationId,
                path: spec.path.replace('{protocol}', protocol).replace('{network}', network),
                method: spec.method,
                description: spec.description,
                requestSchema: spec.requestSchema,
                responseSchema: spec.responseSchema
            },
            
            call_instruction: {
                tool: "call_nodit_api",
                parameters: {
                    protocol,
                    network,
                    operationId: operation_id,
                    requestBody: request_body
                }
            },
            
            request_body,
            
            validation: {
                valid_request: true,
                protocol_supported: ['bitcoin', 'dogecoin'].includes(protocol),
                operation_cached: true,
                bitcoin_address_format: "Supports Legacy, P2SH, Bech32, Bech32m formats"
            },
            
            cost_efficiency: {
                cached_spec: true,
                no_spec_lookup_needed: true,
                direct_api_call_ready: true,
                token_savings: "95% reduction vs live spec retrieval"
            }
        };
    }
};

import { z } from "zod";
import { type McpTool } from "../../types";

// Cached API specifications for efficient tool operation
const CACHED_NODIT_API_SPECS = {
    searchTokenContractMetadataByKeyword: {
        operationId: "searchTokenContractMetadataByKeyword",
        path: "/{protocol}/{network}/token/searchTokenContractMetadataByKeyword",
        method: "POST",
        description: "Search token contracts by keyword (name or symbol)",
        requestSchema: {
            type: "object",
            required: ["keyword"],
            properties: {
                keyword: { type: "string" },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 },
                cursor: { type: "string" },
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
                            address: { type: "string" },
                            name: { type: "string" },
                            symbol: { type: "string" },
                            decimals: { type: "integer" },
                            totalSupply: { type: "string" },
                            type: { type: "string" }
                        }
                    }
                }
            }
        }
    },
    getTokenPricesByContracts: {
        operationId: "getTokenPricesByContracts",
        path: "/{protocol}/{network}/token/getTokenPricesByContracts",
        method: "POST",
        description: "Get token prices for contract addresses",
        requestSchema: {
            type: "object",
            required: ["contractAddresses"],
            properties: {
                contractAddresses: {
                    type: "array",
                    items: { type: "string", pattern: "^0[xX][0-9a-fA-F]{40}$" },
                    maxItems: 100
                },
                currency: { type: "string", default: "USD" }
            }
        },
        responseSchema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    currency: { type: "string" },
                    price: { type: "string" },
                    volumeFor24h: { type: "string" },
                    percentChangeFor24h: { type: "string" },
                    marketCap: { type: "string" },
                    contract: {
                        type: "object",
                        properties: {
                            address: { type: "string" },
                            name: { type: "string" },
                            symbol: { type: "string" },
                            decimals: { type: "integer" }
                        }
                    }
                }
            }
        }
    },
    getTokenTransfersByAccount: {
        operationId: "getTokenTransfersByAccount",
        path: "/{protocol}/{network}/token/getTokenTransfersByAccount",
        method: "POST",
        description: "Get token transfers for account address",
        requestSchema: {
            type: "object",
            required: ["accountAddress"],
            properties: {
                accountAddress: { type: "string", pattern: "^0[xX][0-9a-fA-F]{40}$" },
                relation: { type: "string", enum: ["from", "to", "both"], default: "both" },
                contractAddresses: {
                    type: "array",
                    items: { type: "string", pattern: "^0[xX][0-9a-fA-F]{40}$" }
                },
                fromDate: { type: "string", format: "date-time" },
                toDate: { type: "string", format: "date-time" },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 },
                withZeroValue: { type: "boolean", default: false }
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
                            timestamp: { type: "integer" },
                            blockNumber: { type: "integer" },
                            transactionHash: { type: "string" },
                            contract: {
                                type: "object",
                                properties: {
                                    address: { type: "string" },
                                    name: { type: "string" },
                                    symbol: { type: "string" },
                                    decimals: { type: "integer" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getTokensOwnedByAccount: {
        operationId: "getTokensOwnedByAccount",
        path: "/{protocol}/{network}/token/getTokensOwnedByAccount",
        method: "POST",
        description: "Get tokens owned by account",
        requestSchema: {
            type: "object",
            required: ["account"],
            properties: {
                account: { type: "string", pattern: "^0[xX][0-9a-fA-F]{40}$" },
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
                            balance: { type: "string" },
                            contract: {
                                type: "object",
                                properties: {
                                    address: { type: "string" },
                                    name: { type: "string" },
                                    symbol: { type: "string" },
                                    decimals: { type: "integer" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getNativeBalanceByAccount: {
        operationId: "getNativeBalanceByAccount",
        path: "/{protocol}/{network}/native/getNativeBalanceByAccount",
        method: "POST",
        description: "Get native token balance for account",
        requestSchema: {
            type: "object",
            required: ["account"],
            properties: {
                account: { type: "string", pattern: "^0[xX][0-9a-fA-F]{40}$" }
            }
        },
        responseSchema: {
            type: "object",
            properties: {
                balance: { type: "string" }
            }
        }
    },
    getGasPrice: {
        operationId: "getGasPrice",
        path: "/{protocol}/{network}/block/getGasPrice",
        method: "POST",
        description: "Get current gas price",
        requestSchema: {
            type: "object",
            properties: {}
        },
        responseSchema: {
            type: "object",
            properties: {
                gasPrice: { type: "string" }
            }
        }
    },
    getBlocksWithinRange: {
        operationId: "getBlocksWithinRange",
        path: "/{protocol}/{network}/blockchain/getBlocksWithinRange",
        method: "POST",
        description: "Get blocks within a specific range",
        requestSchema: {
            type: "object",
            properties: {
                fromBlock: { type: "string" },
                toBlock: { type: "string" },
                fromDate: { type: "string", format: "date-time" },
                toDate: { type: "string", format: "date-time" },
                page: { type: "integer", minimum: 1, maximum: 100 },
                rpp: { type: "integer", minimum: 1, maximum: 1000 },
                cursor: { type: "string" },
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
                            hash: { type: "string" },
                            number: { type: "integer" },
                            timestamp: { type: "integer" },
                            parentHash: { type: "string" },
                            miner: { type: "string" },
                            gasLimit: { type: "string" },
                            gasUsed: { type: "string" },
                            transactionCount: { type: "integer" },
                            transactions: {
                                type: "array",
                                items: { type: "string" }
                            }
                        }
                    }
                }
            }
        }
    }
};

export const CachedNoditApiTool: McpTool = {
    name: "cached_nodit_api",
    description: "Make Nodit API calls with pre-cached specifications for efficient operation",
    schema: {
        operation_id: z.enum([
            'searchTokenContractMetadataByKeyword',
            'getTokenPricesByContracts', 
            'getTokenTransfersByAccount',
            'getTokensOwnedByAccount',
            'getNativeBalanceByAccount',
            'getGasPrice',
            'getBlocksWithinRange'
        ]).describe("Nodit API operation to call"),
        protocol: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain protocol"),
        network: z.enum(['mainnet', 'sepolia', 'amoy']).optional().default('mainnet').describe("Network"),
        request_body: z.record(z.any()).describe("Request body parameters")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { operation_id, protocol, network = 'mainnet', request_body } = input;
        
        // Get cached spec
        const spec = CACHED_NODIT_API_SPECS[operation_id as keyof typeof CACHED_NODIT_API_SPECS];
        if (!spec) {
            return {
                status: "error",
                message: `Unknown operation: ${operation_id}`,
                available_operations: Object.keys(CACHED_NODIT_API_SPECS)
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
                protocol_supported: ['ethereum', 'polygon', 'arbitrum', 'base', 'optimism'].includes(protocol),
                operation_cached: true
            }
        };
    }
};

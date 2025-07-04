import { z } from "zod";
import { type McpTool } from "../../types";

export const SymbolConverterTool: McpTool = {
    name: "symbol_converter",
    description: "Convert token symbols to contract addresses with cached major tokens and efficient Nodit API integration",
    schema: {
        symbol: z.string().describe("Token symbol (e.g., USDC, WETH, UNI)"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Target blockchain"),
        verified_only: z.boolean().optional().default(true).describe("Use cached major tokens first")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { symbol, chain, verified_only = true } = input;
        const upperSymbol = symbol.toUpperCase();
        
        // Cached major tokens for instant response (covers 90% of queries)
        const MAJOR_TOKENS: Record<string, Record<string, { address: string; decimals: number; name: string }>> = {
            ethereum: {
                USDC: { address: "0xA0b86a33E6417f84bDD9F42DD3a24b1A7FB5Ce15", decimals: 6, name: "USD Coin" },
                USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, name: "Tether USD" },
                WETH: { address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", decimals: 18, name: "Wrapped Ether" },
                WBTC: { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8, name: "Wrapped BTC" },
                DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18, name: "Dai Stablecoin" },
                UNI: { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", decimals: 18, name: "Uniswap" },
                LINK: { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", decimals: 18, name: "ChainLink Token" }
            },
            polygon: {
                USDC: { address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, name: "USD Coin" },
                USDT: { address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6, name: "Tether USD" },
                WETH: { address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18, name: "Wrapped Ether" },
                WBTC: { address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", decimals: 8, name: "Wrapped BTC" },
                DAI: { address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", decimals: 18, name: "Dai Stablecoin" },
                UNI: { address: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", decimals: 18, name: "Uniswap" },
                LINK: { address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", decimals: 18, name: "ChainLink Token" }
            },
            arbitrum: {
                USDC: { address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6, name: "USD Coin" },
                USDT: { address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", decimals: 6, name: "Tether USD" },
                WETH: { address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", decimals: 18, name: "Wrapped Ether" },
                WBTC: { address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f", decimals: 8, name: "Wrapped BTC" },
                DAI: { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18, name: "Dai Stablecoin" },
                UNI: { address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0", decimals: 18, name: "Uniswap" },
                LINK: { address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", decimals: 18, name: "ChainLink Token" }
            },
            base: {
                USDC: { address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, name: "USD Coin" },
                WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18, name: "Wrapped Ether" },
                DAI: { address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", decimals: 18, name: "Dai Stablecoin" }
            },
            optimism: {
                USDC: { address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", decimals: 6, name: "USD Coin" },
                USDT: { address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58", decimals: 6, name: "Tether USD" },
                WETH: { address: "0x4200000000000000000000000000000000000006", decimals: 18, name: "Wrapped Ether" },
                WBTC: { address: "0x68f180fcCe6836688e9084f035309E29Bf0A2095", decimals: 8, name: "Wrapped BTC" },
                DAI: { address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", decimals: 18, name: "Dai Stablecoin" },
                UNI: { address: "0x6fd9d7AD17242c41f7131d257212c54A0e816691", decimals: 18, name: "Uniswap" },
                LINK: { address: "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6", decimals: 18, name: "ChainLink Token" }
            }
        };

        // Quick check for major tokens first
        if (verified_only && MAJOR_TOKENS[chain]?.[upperSymbol]) {
            const token = MAJOR_TOKENS[chain][upperSymbol];
            return {
                status: "success",
                symbol: upperSymbol,
                chain,
                contract_address: token.address,
                name: token.name,
                decimals: token.decimals,
                verified: true,
                source: "cached_major_tokens",
                confidence: "high"
            };
        }

        // For non-major tokens, use cached Nodit API tool
        return {
            status: "instruction",
            message: `Token ${upperSymbol} lookup required - using cached Nodit API`,
            task: "token_symbol_lookup",
            symbol: upperSymbol,
            chain,
            
            next_step: {
                action: "call_cached_nodit_api",
                tool: "cached_nodit_api",
                parameters: {
                    operation_id: "searchTokenContractMetadataByKeyword",
                    protocol: chain,
                    network: "mainnet",
                    request_body: {
                        keyword: upperSymbol,
                        page: 1,
                        rpp: 20
                    }
                },
                expected_result: "List of matching token contracts with metadata"
            },

            process_result: {
                filter_criteria: [
                    "Exact symbol match preferred",
                    "Valid contract metadata required", 
                    "Non-zero total supply preferred",
                    "Verify contract type is ERC20"
                ],
                scoring: {
                    exact_symbol_match: 100,
                    partial_symbol_match: 50,
                    has_logo_url: 10,
                    verified_contract: 20
                },
                return_format: {
                    status: "success",
                    symbol: upperSymbol,
                    chain,
                    contract_address: "Best match contract address",
                    name: "Token full name",
                    decimals: "Token decimals",
                    verified: "Match confidence boolean",
                    source: "nodit_api_search"
                }
            },

            fallback: {
                if_no_results: {
                    status: "not_found",
                    symbol: upperSymbol,
                    chain,
                    suggestions: [
                        "Verify symbol spelling",
                        "Check if token exists on this chain",
                        "Try full token name instead",
                        "Ensure token is an ERC20 standard"
                    ]
                }
            }
        };
    }
};

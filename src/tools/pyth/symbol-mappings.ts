// Mapping of token symbols to Pyth price feed IDs
// This allows us to use simple symbols instead of complex contract addresses

export const TOKEN_SYMBOL_TO_PYTH_FEED: Record<string, { feedId: string; description: string; }> = {
    // Major Cryptocurrencies
    "BTC": { 
        feedId: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", 
        description: "Bitcoin" 
    },
    "ETH": { 
        feedId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", 
        description: "Ethereum" 
    },
    "SOL": { 
        feedId: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d", 
        description: "Solana" 
    },
    "SUI": { 
        feedId: "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744", 
        description: "Sui" 
    },

    // Stablecoins
    "USDT": { 
        feedId: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b", 
        description: "Tether USD" 
    },
    "USDC": { 
        feedId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a", 
        description: "USD Coin" 
    },
    "DAI": { 
        feedId: "0xb0948a5e5313200c632b51bb5ca32f6de0d36e9950a942d19751e833f70dabfd", 
        description: "Dai Stablecoin" 
    },

    // Layer 1 Tokens
    "MATIC": { 
        feedId: "0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52", 
        description: "Polygon" 
    },
    "AVAX": { 
        feedId: "0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7", 
        description: "Avalanche" 
    },
    "BNB": { 
        feedId: "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f", 
        description: "BNB" 
    },
    "ADA": { 
        feedId: "0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d", 
        description: "Cardano" 
    },

    // DeFi Tokens
    "UNI": { 
        feedId: "0x78d185a741d07edb3aeb9c639787bd0b1b03000b6eb924e9a0e39e0ba97e5ebe", 
        description: "Uniswap" 
    },
    "LINK": { 
        feedId: "0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221", 
        description: "Chainlink" 
    },
    "AAVE": { 
        feedId: "0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445", 
        description: "Aave" 
    },
    "CRV": { 
        feedId: "0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8", 
        description: "Curve DAO Token" 
    },

    // Other Popular Tokens
    "DOGE": { 
        feedId: "0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c", 
        description: "Dogecoin" 
    },
    "SHIB": { 
        feedId: "0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f78a5404b4da80c8da", 
        description: "Shiba Inu" 
    },
    "APT": { 
        feedId: "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5", 
        description: "Aptos" 
    }
};

// Chain-specific native token mappings (using symbols)
export const CHAIN_NATIVE_TOKEN_SYMBOLS: Record<string, string> = {
    "ethereum": "ETH",
    "polygon": "MATIC", 
    "avalanche": "AVAX",
    "arbitrum": "ETH",
    "base": "ETH",
    "optimism": "ETH",
    "kaia": "ETH" // Assuming ETH-like for now
};

/**
 * Check if a token symbol has a corresponding Pyth price feed
 */
export function hasPythFeed(symbol: string): boolean {
    return symbol.toUpperCase() in TOKEN_SYMBOL_TO_PYTH_FEED;
}

/**
 * Get Pyth feed ID for a token symbol
 */
export function getPythFeedForSymbol(symbol: string): { feedId: string; description: string; } | null {
    const key = symbol.toUpperCase();
    return TOKEN_SYMBOL_TO_PYTH_FEED[key] || null;
}

/**
 * Get Pyth feed for chain's native token
 */
export function getNativeTokenSymbol(chain: string): string | null {
    return CHAIN_NATIVE_TOKEN_SYMBOLS[chain.toLowerCase()] || null;
}

/**
 * Get Pyth feed for chain's native token  
 */
export function getNativeTokenPythFeed(chain: string): { feedId: string; description: string; symbol: string } | null {
    const symbol = getNativeTokenSymbol(chain);
    if (!symbol) return null;
    
    const feed = getPythFeedForSymbol(symbol);
    if (!feed) return null;
    
    return {
        ...feed,
        symbol
    };
}

/**
 * Get multiple Pyth feed IDs for an array of token symbols
 */
export function getPythFeedsForSymbols(symbols: string[]): {
    pythFeeds: Array<{ symbol: string; feedId: string; description: string; }>;
    noditSymbols: string[];
} {
    const pythFeeds: Array<{ symbol: string; feedId: string; description: string; }> = [];
    const noditSymbols: string[] = [];

    for (const symbol of symbols) {
        const pythFeed = getPythFeedForSymbol(symbol);
        if (pythFeed) {
            pythFeeds.push({
                symbol: symbol.toUpperCase(),
                feedId: pythFeed.feedId,
                description: pythFeed.description
            });
        } else {
            noditSymbols.push(symbol);
        }
    }

    return { pythFeeds, noditSymbols };
}

/**
 * Get all available Pyth symbols
 */
export function getAllPythSymbols(): string[] {
    return Object.keys(TOKEN_SYMBOL_TO_PYTH_FEED);
}

/**
 * Search Pyth symbols by query
 */
export function searchPythSymbols(query: string): Array<{ symbol: string; feedId: string; description: string; }> {
    const searchTerm = query.toLowerCase();
    return Object.entries(TOKEN_SYMBOL_TO_PYTH_FEED)
        .filter(([symbol, data]) => 
            symbol.toLowerCase().includes(searchTerm) || 
            data.description.toLowerCase().includes(searchTerm)
        )
        .map(([symbol, data]) => ({
            symbol,
            feedId: data.feedId,
            description: data.description
        }));
}

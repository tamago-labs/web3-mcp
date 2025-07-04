
export interface McpTool {
    name: string;
    description: string;
    schema: Record<string, any>;
    handler: (agent: any, input: Record<string, any>) => Promise<any>;
} 
 

export interface WhaleTransfer {
    hash: string;
    from: string;
    to: string;
    token: string;
    amount: string;
    usdValue: string;
    timestamp: string;
    blockNumber: number;
}

export interface GasPrices {
    slow: {
        gwei: string;
        usd: string;
        waitTime: string;
    };
    standard: {
        gwei: string;
        usd: string;
        waitTime: string;
    };
    fast: {
        gwei: string;
        usd: string;
        waitTime: string;
    };
}

export interface NftCollection {
    contract: string;
    name: string;
    symbol: string;
    totalSupply: number;
    description?: string;
    floorPrice?: string;
    totalVolume?: string;
    holders: number;
}

export interface NftMetadata {
    contract: string;
    tokenId: string;
    name: string;
    description?: string;
    image?: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
    owner?: string;
}
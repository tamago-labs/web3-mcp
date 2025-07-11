import { HermesClient } from "@pythnetwork/hermes-client";

export interface PythPriceUpdate {
    id: string;
    price: number | null;
    publishTime: string | null;
}

export interface PythPriceFeed {
    id: string;
    attributes: {
        display_symbol?: string;
        base?: string;
        quote_currency?: string;
        asset_type?: string;
        symbol?: string;
        description?: string;
        country?: string;
        tenor?: string;
    };
}

export interface SearchPriceFeedsResponse {
    priceFeeds?: PythPriceFeed[];
    success: boolean;
    error?: string;
}

export interface GetPriceUpdatesResponse {
    prices?: PythPriceUpdate[];
    success: boolean;
    error?: string;
}

/**
 * Search for price feeds by query and asset type
 * @param query Search query (e.g., "btc")
 * @param assetType Asset type (e.g., "crypto", "equity", "fx", "metal", "rates")
 * @returns List of matching price feeds
 */
export const searchPriceFeeds = async (query: string, assetType?: string): Promise<SearchPriceFeedsResponse> => {
    try {
        const client = new HermesClient("https://hermes.pyth.network", {});
        const priceFeeds = await client.getPriceFeeds({
            query,
            assetType: assetType as any,
        });
        return {
            success: true,
            priceFeeds
        };
    } catch (error: any) {
        console.error('Error searching price feeds:', error);
        return {
            success: false,
            error: error.message || 'Failed to search price feeds'
        };
    }
};

/**
 * Get latest price updates for the provided price feed IDs
 * @param priceIds Array of price feed IDs
 * @returns Latest price updates
 */
export const getLatestPriceUpdates = async (priceIds: string[]): Promise<GetPriceUpdatesResponse> => {
    try {
        const client = new HermesClient("https://hermes.pyth.network", {});
        const priceUpdates = await client.getLatestPriceUpdates(priceIds);
        
        // Format the price data for better readability
        const formattedPrices = priceUpdates.parsed ? priceUpdates.parsed.map((update) => {
            let price = 1;
            if (update.ema_price.expo > 0) {
                price = Number(update.ema_price.price) * (10 ** Math.abs(update.ema_price.expo));
            } else {
                price = Number(update.ema_price.price) / (10 ** Math.abs(update.ema_price.expo));
            }
            return {
                id: update.id,
                price: price || null,
                publishTime: update.ema_price ? new Date(update.ema_price.publish_time * 1000).toISOString() : null,
            };
        }) : [];

        return {
            success: true,
            prices: formattedPrices,
            // rawUpdates: priceUpdates
        };
    } catch (error: any) {
        console.error('Error getting price updates:', error);
        return {
            success: false,
            error: error.message || 'Failed to get price updates'
        };
    }
};

/**
 * Format price value with proper decimals considering the expo (legacy function for backward compatibility)
 */
export function formatPythPrice(price: string, expo: number): string {
    const priceNumber = parseFloat(price);
    const formattedPrice = priceNumber * Math.pow(10, expo);
    return formattedPrice.toString();
}

/**
 * Get human readable price with proper formatting (legacy function for backward compatibility)
 */
export function getReadablePrice(priceUpdate: any): {
    price: string;
    formattedPrice: string;
    confidence: string;
    lastUpdated: Date;
} {
    // This function maintains compatibility with the old format
    // but the new implementation already provides formatted prices
    return {
        price: priceUpdate.price?.toString() || "0",
        formattedPrice: priceUpdate.price?.toFixed(8) || "0.00000000",
        confidence: "0.00000000", // Not available in simplified format
        lastUpdated: priceUpdate.publishTime ? new Date(priceUpdate.publishTime) : new Date()
    };
}

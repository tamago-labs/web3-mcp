import { z } from "zod";
import { type McpTool } from "../../types";

export const NftGetCollectionStatsTool: McpTool = {
    name: "nft_get_collection_stats",
    description: "Get comprehensive NFT collection statistics using cached Nodit API integration",
    schema: {
        contract_address: z.string().describe("NFT contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { contract_address, chain } = input;
        
        return {
            status: "instruction",
            task: "nft_collection_analysis",
            message: "🖼️ NFT Collection Analytics - Cached API Approach",
            description: "Get comprehensive NFT collection statistics using cached Nodit API specifications",
            
            overview: {
                action: "Analyze NFT collection metrics and activity",
                target_contract: contract_address,
                chain,
                analysis_scope: "Collection metadata, holders, transfers, market activity" 
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get collection metadata and basic info",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contracts: [contract_address]
                        }
                    },
                    expected_result: "Collection name, symbol, total supply, contract type"
                },
                {
                    step: 2,
                    action: "Analyze holder distribution and ownership",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            page: 1,
                            rpp: 1000,
                            withCount: true
                        }
                    },
                    expected_result: "Holder list with balances and total holder count"
                },
                {
                    step: 3,
                    action: "Get recent transfer activity (7 days)",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftTransfersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            fromDate: new Date(Date.now() - (7 * 24 * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    expected_result: "Recent transfer activity and trading volume"
                },
                {
                    step: 4,
                    action: "Sample NFT metadata for insights (optional)",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftMetadataByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            page: 1,
                            rpp: 20
                        }
                    },
                    purpose: "Understand collection attributes and metadata quality"
                }
            ],

            collection_analysis: {
                metadata_processing: [
                    "Extract collection name, symbol, and total supply",
                    "Identify contract type (ERC721/ERC1155)",
                    "Assess metadata completeness and quality",
                    "Review collection description and external links"
                ],
                holder_distribution: [
                    "Calculate total unique holders",
                    "Analyze concentration metrics (top 10, 50, 100 holders)",
                    "Compute average NFTs per holder",
                    "Classify holders by holding size (whales, collectors, individuals)",
                    "Calculate holder diversity and decentralization scores"
                ],
                activity_metrics: [
                    "Count transfers in recent 7-day period",
                    "Identify unique active traders",
                    "Detect transfer patterns (sales vs moves)",
                    "Find most actively traded token IDs",
                    "Assess overall collection liquidity"
                ],
                metadata_insights: [
                    "Sample NFT attributes and trait patterns",
                    "Identify common trait types and values",
                    "Assess rarity distribution patterns",
                    "Evaluate metadata standardization"
                ]
            },

            expected_output: {
                collection_overview: {
                    contract_address,
                    chain,
                    timestamp: "ISO timestamp",
                    name: "Collection name",
                    symbol: "Collection symbol",
                    total_supply: "Total NFTs in collection",
                    contract_type: "ERC721/ERC1155",
                    description: "Collection description"
                },
                holder_analytics: {
                    total_holders: "Unique holder count",
                    holder_concentration: {
                        top_1_percentage: "% held by largest holder",
                        top_10_percentage: "% held by top 10 holders",
                        top_50_percentage: "% held by top 50 holders",
                        top_100_percentage: "% held by top 100 holders"
                    },
                    distribution_metrics: {
                        average_nfts_per_holder: "Mean NFTs per holder",
                        median_nfts_per_holder: "Median NFTs per holder",
                        max_nfts_per_holder: "Largest individual holding"
                    },
                    holder_segments: {
                        whales: "Holders with 10+ NFTs (count and %)",
                        collectors: "Holders with 2-9 NFTs (count and %)",
                        individuals: "Holders with 1 NFT (count and %)"
                    }
                },
                activity_summary: {
                    recent_activity: {
                        transfers_7d: "Transfer count in last 7 days",
                        active_addresses_7d: "Unique addresses involved in transfers",
                        most_active_tokens: "Token IDs with most transfers"
                    },
                    trading_patterns: {
                        estimated_sales: "Estimated sale transactions",
                        estimated_moves: "Estimated wallet-to-wallet moves",
                        mint_activity: "Recent minting activity"
                    },
                    liquidity_metrics: {
                        daily_transfer_rate: "Average daily transfer %",
                        trading_velocity: "How often NFTs change hands",
                        market_activity_level: "High/Medium/Low"
                    }
                },
                collection_health: {
                    decentralization_score: "Holder distribution health (0-100)",
                    liquidity_score: "Trading activity score (0-100)",
                    community_engagement: "Based on holder and activity patterns",
                    overall_health: "Excellent/Good/Fair/Poor"
                },
                metadata_quality: {
                    metadata_completeness: "% of NFTs with complete metadata",
                    common_attributes: "Most frequent trait types",
                    attribute_diversity: "Number of unique trait combinations",
                    standard_compliance: "Metadata standard adherence"
                }
            } 
        };
    }
};

export const NftGetTokenMetadataTool: McpTool = {
    name: "nft_get_token_metadata",
    description: "Get specific NFT token metadata and details using cached Nodit API",
    schema: {
        contract_address: z.string().describe("NFT contract address"),
        token_id: z.string().describe("Token ID"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { contract_address, token_id, chain } = input;
        
        return {
            status: "instruction",
            task: "nft_token_analysis",
            message: "🎨 NFT Token Analysis - Cached API Approach",
            description: "Get detailed NFT token metadata and ownership using cached Nodit API specs",
            
            overview: {
                action: "Analyze specific NFT token details",
                target_contract: contract_address,
                target_token_id: token_id,
                chain,
                analysis_scope: "Metadata, ownership, transfer history, rarity"
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get specific NFT metadata and attributes",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftMetadataByTokenIds",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            tokenIds: [{ tokenId: token_id }]
                        }
                    },
                    expected_result: "NFT name, description, image, attributes, metadata URI"
                },
                {
                    step: 2,
                    action: "Get complete transfer history for this NFT",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftTransfersByTokenId",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            tokenId: token_id,
                            page: 1,
                            rpp: 100
                        }
                    },
                    expected_result: "Complete ownership history and transfer records"
                },
                {
                    step: 3,
                    action: "Get collection context for rarity analysis",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contracts: [contract_address]
                        }
                    },
                    purpose: "Provide collection context for rarity calculations"
                }
            ],

            nft_analysis: {
                metadata_processing: [
                    "Extract NFT name, description, and visual assets",
                    "Parse attributes and trait information",
                    "Validate metadata URI and accessibility",
                    "Assess metadata completeness and quality"
                ],
                ownership_analysis: [
                    "Identify current owner from latest transfer",
                    "Calculate ownership duration",
                    "Analyze ownership history patterns",
                    "Detect trading frequency and velocity"
                ],
                rarity_calculation: [
                    "Compare attributes against collection norms",
                    "Calculate trait rarity percentages",
                    "Identify unique or rare trait combinations",
                    "Generate overall rarity score"
                ],
                transfer_insights: [
                    "Map complete ownership chain",
                    "Identify mint transaction and original owner",
                    "Analyze transfer patterns (sales vs moves)",
                    "Calculate holding periods and trading activity"
                ]
            },

            expected_output: {
                nft_details: {
                    contract_address,
                    token_id,
                    chain,
                    timestamp: "ISO timestamp"
                },
                metadata: {
                    name: "NFT name",
                    description: "NFT description",
                    image: "Primary image URL",
                    animation_url: "Animation/video URL if available",
                    external_url: "External link if available",
                    attributes: [
                        {
                            trait_type: "Attribute category",
                            value: "Attribute value",
                            rarity_percentage: "Rarity within collection if calculable"
                        }
                    ],
                    metadata_uri: "Original metadata URI",
                    metadata_standard: "ERC721/ERC1155 compliance status"
                },
                ownership_info: {
                    current_owner: "Current holder address",
                    owned_since: "When current owner acquired it",
                    ownership_duration: "Current holding period",
                    total_previous_owners: "Number of previous owners",
                    mint_address: "Original minter address"
                },
                transfer_history: [
                    {
                        transaction_hash: "Transfer transaction hash",
                        from_address: "Previous owner",
                        to_address: "New owner", 
                        timestamp: "Transfer timestamp",
                        block_number: "Block number",
                        transfer_type: "mint/sale/transfer/burn",
                        log_index: "Event log index"
                    }
                ],
                rarity_analysis: {
                    overall_rarity_score: "Calculated rarity score (0-100)",
                    rarity_rank: "Estimated rank within collection",
                    rare_traits: "Uncommon attributes and their rarity %",
                    common_traits: "Common attributes",
                    unique_combinations: "Unique trait combinations"
                },
                market_insights: {
                    trading_activity: {
                        total_transfers: "Lifetime transfer count",
                        last_transfer: "Most recent transfer date",
                        average_holding_period: "Average time between transfers",
                        trading_frequency: "Active/Moderate/Dormant"
                    },
                    liquidity_indicators: {
                        transfer_velocity: "How often this NFT changes hands",
                        market_interest: "Based on transfer patterns",
                        current_status: "Recently active/Stable holding/Long term hold"
                    }
                }
            }
 
        };
    }
};

export const NftTrackCollectionActivityTool: McpTool = {
    name: "nft_track_collection_activity", 
    description: "Track NFT collection activity and trends using cached Nodit API",
    schema: {
        contract_address: z.string().describe("NFT contract address"),
        chain: z.enum(['ethereum', 'polygon', 'arbitrum', 'base', 'optimism']).describe("Blockchain network"),
        days: z.number().optional().default(7).describe("Days to look back for activity"),
        include_holder_changes: z.boolean().optional().default(true).describe("Track holder count changes")
    },
    handler: async (agent: any, input: Record<string, any>) => {
        const { contract_address, chain, days, include_holder_changes } = input;
        
        return {
            status: "instruction",
            task: "nft_activity_tracking",
            message: "📈 NFT Collection Activity Tracking - Cached API Approach",
            description: "Track NFT collection activity and trends using cached Nodit API specifications",
            
            overview: {
                action: "Track collection activity and market trends",
                target_contract: contract_address,
                chain,
                timeframe: `${days} days`,
                track_holder_changes: include_holder_changes
            },

            execution_plan: [
                {
                    step: 1,
                    action: "Get collection baseline information",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftContractMetadataByContracts",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contracts: [contract_address]
                        }
                    },
                    purpose: "Establish collection context and baseline metrics"
                },
                {
                    step: 2,
                    action: "Get transfer activity for specified period",
                    tool: "cached_nodit_api",
                    parameters: {
                        operation_id: "getNftTransfersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            fromDate: new Date(Date.now() - (days * 24 * 3600 * 1000)).toISOString(),
                            toDate: new Date().toISOString(),
                            page: 1,
                            rpp: 1000
                        }
                    },
                    expected_result: "All transfers in the specified timeframe"
                },
                {
                    step: 3,
                    action: include_holder_changes ? "Get current holder distribution" : "Skip holder tracking",
                    tool: include_holder_changes ? "cached_nodit_api" : null,
                    parameters: include_holder_changes ? {
                        operation_id: "getNftHoldersByContract",
                        protocol: chain,
                        network: "mainnet",
                        request_body: {
                            contract: contract_address,
                            page: 1,
                            rpp: 1000,
                            withCount: true
                        }
                    } : null,
                    purpose: "Track holder distribution changes"
                }
            ],

            activity_analysis: {
                transfer_patterns: [
                    "Analyze daily transfer volumes and trends",
                    "Identify peak activity periods and patterns",
                    "Calculate transfer frequency per token",
                    "Detect unusual activity spikes or drops"
                ],
                market_activity: [
                    "Classify transfers by type (sales, moves, mints)",
                    "Identify most active token IDs",
                    "Track new vs existing holder activity",
                    "Analyze trading velocity trends"
                ],
                holder_dynamics: include_holder_changes ? [
                    "Track new holders entering the collection",
                    "Identify holders who sold out completely", 
                    "Monitor holder concentration changes",
                    "Detect whale accumulation or distribution"
                ] : ["Holder change tracking disabled"],
                trend_analysis: [
                    "Compare activity vs previous periods",
                    "Identify growing or declining interest",
                    "Detect seasonal or cyclical patterns",
                    "Assess overall collection momentum"
                ]
            },

            expected_output: {
                collection_info: {
                    contract_address,
                    chain,
                    analysis_period: `${days} days`,
                    timestamp: "ISO timestamp",
                    collection_name: "From metadata",
                    total_supply: "From metadata"
                },
                activity_summary: {
                    total_transfers: "Total transfers in period",
                    daily_average_transfers: "Average daily transfer count",
                    unique_tokens_traded: "Number of different tokens that traded",
                    active_addresses: "Unique addresses involved in transfers",
                    new_holders: "Addresses that acquired first NFT",
                    exiting_holders: "Addresses that sold all NFTs"
                },
                daily_breakdown: [
                    {
                        date: "YYYY-MM-DD",
                        transfers: "Daily transfer count",
                        unique_tokens: "Unique tokens traded",
                        active_addresses: "Active addresses",
                        estimated_sales: "Estimated sale transfers",
                        estimated_moves: "Estimated internal moves"
                    }
                ],
                trending_tokens: [
                    {
                        token_id: "Token ID",
                        transfer_count: "Transfers in period",
                        unique_holders: "Different holders involved",
                        activity_score: "Calculated activity score"
                    }
                ],
                holder_insights: include_holder_changes ? {
                    current_holder_count: "Total unique holders",
                    new_holders_count: "New holders in period",
                    exiting_holders_count: "Holders who sold out",
                    net_holder_change: "Net change in holder count",
                    holder_retention_rate: "% of holders who kept NFTs"
                } : null,
                market_trends: {
                    activity_trend: "Increasing/Stable/Decreasing",
                    trading_velocity: "Fast/Medium/Slow based on transfer frequency",
                    market_interest: "High/Medium/Low based on activity metrics",
                    momentum_score: "Overall collection momentum (0-100)"
                }
            }
        };
    }
};

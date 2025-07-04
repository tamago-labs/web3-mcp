// Import base tools (included in all MCP servers)
import * as BaseTools from './base';

// Import specific MCP server tools
import * as PortfolioTools from './portfolio-snapshot';
import * as GasTools from './gas-optimization-helper';
import * as WhaleTools from './whale-monitor';
import * as TokenTools from './token-intelligence';
import * as TxTools from './transaction-tracker';
import * as NftTools from './nft-collection-insights';

import { agentMode } from '../config';

// Define tool collections for each agent mode
const MCP_TOOL_COLLECTIONS: Record<string, any> = {
    'portfolio-snapshot': {
        ...BaseTools,
        ...PortfolioTools
    },
    'gas-optimization-helper': {
        ...BaseTools,
        ...GasTools
    },
    'whale-monitor': {
        ...BaseTools,
        ...WhaleTools
    },
    'token-intelligence': {
        ...BaseTools,
        ...TokenTools
    },
    'transaction-tracker': {
        ...BaseTools,
        ...TxTools
    },
    'nft-collection-insights': {
        ...BaseTools,
        ...NftTools
    }
};

// Get tools based on agent mode
export function getToolsForMode(mode: string): Record<string, any> {
    const tools = MCP_TOOL_COLLECTIONS[mode];
    
    if (!tools) {
        throw new Error(`Unknown agent mode: ${mode}. Available modes: ${Object.keys(MCP_TOOL_COLLECTIONS).join(', ')}`);
    }
    
    return tools;
}

// Export tools for current agent mode
export const CurrentModeTools = agentMode ? getToolsForMode(agentMode) : {};

// Export all available modes
export const AVAILABLE_MODES = Object.keys(MCP_TOOL_COLLECTIONS);
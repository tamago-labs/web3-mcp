// Import base tools (included in all MCP servers)
import * as BaseTools from './base';

// Import specific MCP server tools
import * as PortfolioTools from './portfolio-snapshot';
import * as GasTools from './gas-optimization-helper';
import * as WhaleTools from './whale-monitor';
import * as TokenTools from './token-intelligence';
import * as TxTools from './transaction-tracker';
import * as NftTools from './nft-collection-insights';
import * as BlockTools from './block-analytics';
import * as EvmDefiTools from './evm-defi';
import * as AptosDefiTools from './aptos-defi';
import * as QuantTools from './quant-trading';
import * as PythTools from './pyth-price-feeds';

// Import Bitcoin-specific MCP server tools
import * as BitcoinWalletTools from './bitcoin-wallet-analyzer';
import * as BitcoinTxTools from './bitcoin-transaction-tracker';
import * as BitcoinNetworkTools from './bitcoin-network-insights';

import { agentMode } from '../config';

// Define tool collections for each agent mode
const MCP_TOOL_COLLECTIONS: Record<string, any> = {// Agent Base Tools
    // Agent Base Tools
    "agent-base": {
        ...BaseTools,
    },
    // EVM-based agent modes
    'portfolio-snapshot': {
        ...PortfolioTools
    },
    'gas-optimization-helper': {
        ...GasTools
    },
    'whale-monitor': {
        ...WhaleTools
    },
    'token-intelligence': {
        ...TokenTools
    },
    'transaction-tracker': {
        ...TxTools
    },
    'nft-collection-insights': {
        ...NftTools
    },
    // Bitcoin-specific agent modes
    'bitcoin-wallet-analyzer': {
        ...BitcoinWalletTools
    },
    'bitcoin-transaction-tracker': {
        ...BitcoinTxTools
    },
    'bitcoin-network-insights': {
        ...BitcoinNetworkTools
    },
    'evm-defi': {
        ...EvmDefiTools
    },
    'aptos-defi': {
        ...AptosDefiTools
    },
    'quant-trading': {
        ...QuantTools
    },
    'block-analytics': { 
        ...BlockTools
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

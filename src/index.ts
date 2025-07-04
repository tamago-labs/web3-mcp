#!/usr/bin/env node

import { validateEnvironment, agentMode } from "./config"
import { CurrentModeTools, AVAILABLE_MODES } from "./mcp";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * Creates an MCP server 
 */

function createMcpServer() {

    // Create MCP server instance
    const server = new McpServer({
        name: "web3-mcp",
        version: "0.1.0"
    });

    if (!agentMode) {
        throw new Error(`Agent mode is required. Available modes: ${AVAILABLE_MODES.join(', ')}`);
    }

    // Register all tools for the current mode
    for (const [_key, tool] of Object.entries(CurrentModeTools)) {
        server.tool(tool.name, tool.description, tool.schema, async (params: any): Promise<any> => {
            try {
                // Execute the handler with the params directly
                const result = await tool.handler(null, params);

                // Format the result as MCP tool response
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error) {
                console.error("Tool execution error:", error);
                // Handle errors in MCP format
                return {
                    isError: true,
                    content: [
                        {
                            type: "text",
                            text: error instanceof Error
                                ? error.message
                                : "Unknown error occurred",
                        },
                    ],
                };
            }
        });
    }

    return server;
}

async function main() {
    try {
        console.error("🎨 Starting Tamago Labs Web3 MCP Server...");

        // Validate environment before proceeding
        validateEnvironment();
 
        // Create and start MCP server
        const server = createMcpServer();
        const transport = new StdioServerTransport();
        await server.connect(transport);

        console.error("✅ Web3 MCP Server is running!");

    } catch (error) {
        console.error('❌ Error starting Web3 MCP server:', error);
        process.exit(1);
    }
}

main();
export interface Agent {
    // Agent interface - can be extended based on your agent implementation
    id?: string;
    name?: string;
    tools?: any[];
    // Add other agent properties as needed
}

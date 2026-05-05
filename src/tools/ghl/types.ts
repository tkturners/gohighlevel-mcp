/**
 * Shared types for GHL MCP tools.
 *
 * All tool modules return a Record<string, Tool> so the server can merge
 * them into a flat tool namespace.
 */

export interface Tool {
  description: string;
  inputSchema: object;
  handler: (args: Record<string, unknown>) => Promise<{
    content: Array<{ type: 'text'; text: string }>;
  }>;
}

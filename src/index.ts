#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { config } from './config/environment.js';
import { GhlClient } from './services/ghl/client.js';
import { createContactTools } from './tools/ghl/contacts.js';
import { createOpportunityTools } from './tools/ghl/opportunities.js';
import { createAppointmentTools } from './tools/ghl/appointments.js';
import { createPipelineTools } from './tools/ghl/pipelines.js';
import { createConversationTools } from './tools/ghl/conversations.js';
import { createBlogTools } from './tools/ghl/blogs.js';
import { createTaskAndNoteTools } from './tools/ghl/tasksAndNotes.js';
import { createCustomFieldAndTagTools } from './tools/ghl/customFieldsAndTags.js';
import { createWorkflowTools } from './tools/ghl/workflows.js';
import { createAiAgentTools } from './tools/ghl/aiAgents.js';
import { createWebhookTools } from './tools/ghl/webhooks.js';
import { createLocationTools } from './tools/ghl/locations.js';
import { createCustomValueTools } from './tools/ghl/customValues.js';
import { createSocialPlannerTools } from './tools/ghl/socialPlanner.js';
import { createAdPublishingTools } from './tools/ghl/adPublishing.js';

const server = new Server(
  {
    name: 'ghl-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const ghlClient = new GhlClient();

const allTools = {
  ...createContactTools(ghlClient),
  ...createOpportunityTools(ghlClient),
  ...createAppointmentTools(ghlClient),
  ...createPipelineTools(ghlClient),
  ...createConversationTools(ghlClient),
  ...createBlogTools(ghlClient),
  ...createTaskAndNoteTools(ghlClient),
  ...createCustomFieldAndTagTools(ghlClient),
  ...createWorkflowTools(ghlClient),
  ...createAiAgentTools(ghlClient),
  ...createWebhookTools(ghlClient),
  ...createLocationTools(ghlClient),
  ...createCustomValueTools(ghlClient),
  ...createSocialPlannerTools(ghlClient),
  ...createAdPublishingTools(ghlClient),
};

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(allTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = allTools[toolName as keyof typeof allTools];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    return await tool.handler((request.params.arguments ?? {}) as Record<string, unknown>);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
    };
  }
});

async function main() {
  console.error('GHL MCP Server starting...');
  console.error(`Location ID: ${config.ghl.locationId}`);
  console.error(`API Base: ${config.ghl.apiBase}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GHL MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

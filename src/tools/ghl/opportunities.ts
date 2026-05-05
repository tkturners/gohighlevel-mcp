import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createOpportunityTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_opportunities: {
      description: 'List opportunities/pipelines from GoHighLevel for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          pipelineId: { type: 'string', description: 'Filter by pipeline ID' },
          stageId: { type: 'string', description: 'Filter by stage ID' },
          status: {
            type: 'string',
            enum: ['open', 'won', 'lost', 'abandoned', 'all'],
            default: 'open',
          },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/opportunities/', {
          locationId: config.ghl.locationId,
          pipelineId: args.pipelineId,
          stageId: args.stageId,
          status: args.status ?? 'open',
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_opportunity: {
      description: 'Get a single opportunity by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: { type: 'string' },
        },
        required: ['opportunityId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/opportunities/${args.opportunityId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_opportunity: {
      description: 'Create a new opportunity/deal in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Opportunity name' },
          pipelineId: { type: 'string' },
          stageId: { type: 'string' },
          status: { type: 'string', enum: ['open', 'won', 'lost'], default: 'open' },
          contactId: { type: 'string' },
          monetaryValue: { type: 'number' },
        },
        required: ['name', 'pipelineId', 'stageId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = {
          locationId: config.ghl.locationId,
          ...args,
        };
        const data = await client.post('/opportunities/', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_opportunity: {
      description: 'Update an existing opportunity.',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: { type: 'string' },
          name: { type: 'string' },
          stageId: { type: 'string' },
          status: { type: 'string', enum: ['open', 'won', 'lost'] },
          monetaryValue: { type: 'number' },
        },
        required: ['opportunityId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { opportunityId, ...body } = args;
        const data = await client.put(`/opportunities/${opportunityId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_opportunity: {
      description: 'Delete an opportunity.',
      inputSchema: {
        type: 'object',
        properties: {
          opportunityId: { type: 'string' },
        },
        required: ['opportunityId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/opportunities/${args.opportunityId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_search_opportunities: {
      description:
        'Search opportunities using the modern POST search endpoint. Supports date range, assigned user, pipeline, and stage filters.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (contact name or opportunity name)' },
          pipelineId: { type: 'string', description: 'Filter by pipeline ID' },
          stageId: { type: 'string', description: 'Filter by stage ID' },
          assignedTo: { type: 'string', description: 'Filter by assigned user ID' },
          status: {
            type: 'string',
            enum: ['open', 'won', 'lost', 'abandoned', 'all'],
            default: 'open',
          },
          startDate: { type: 'string', description: 'ISO 8601 start date for createdAt filter' },
          endDate: { type: 'string', description: 'ISO 8601 end date for createdAt filter' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = {
          locationId: config.ghl.locationId,
          page: args.page ?? 1,
          limit: args.limit ?? 25,
        };
        if (args.query) payload.q = args.query;
        if (args.pipelineId) payload.pipelineId = args.pipelineId;
        if (args.stageId) payload.stageId = args.stageId;
        if (args.assignedTo) payload.assignedTo = args.assignedTo;
        if (args.status) payload.status = args.status;
        if (args.startDate) payload.startDate = args.startDate;
        if (args.endDate) payload.endDate = args.endDate;
        const data = await client.post('/opportunities/search', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createWorkflowTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_workflows: {
      description: 'List automation workflows for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['published', 'draft'], default: 'published' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/workflows', {
          locationId: config.ghl.locationId,
          status: args.status ?? 'published',
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_workflow: {
      description:
        'Get a single workflow by ID. Note: GHL API does not expose workflow steps/actions via REST. Use the dashboard to inspect workflow internals.',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string' },
        },
        required: ['workflowId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/workflows/${args.workflowId}`, {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_workflow: {
      description: 'Create a new automation workflow in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          status: { type: 'string', enum: ['published', 'draft'], default: 'draft' },
          triggerType: {
            type: 'string',
            description: 'e.g., contact.tag, opportunity.status_changed',
          },
          actions: {
            type: 'array',
            items: { type: 'object' },
            description: 'Workflow action steps',
          },
        },
        required: ['name', 'triggerType'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/workflows', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_workflow: {
      description: 'Update an existing automation workflow.',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string', enum: ['published', 'draft'] },
          actions: { type: 'array', items: { type: 'object' } },
        },
        required: ['workflowId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { workflowId, ...body } = args;
        const data = await client.put(`/workflows/${workflowId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_workflow: {
      description: 'Delete an automation workflow.',
      inputSchema: {
        type: 'object',
        properties: {
          workflowId: { type: 'string' },
        },
        required: ['workflowId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/workflows/${args.workflowId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

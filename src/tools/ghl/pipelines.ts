import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createPipelineTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_get_pipelines: {
      description: 'Get all pipelines for the configured location in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const data = await client.get('/opportunities/pipelines', {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_pipeline: {
      description: 'Get a single pipeline by ID including its stages.',
      inputSchema: {
        type: 'object',
        properties: {
          pipelineId: { type: 'string' },
        },
        required: ['pipelineId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/opportunities/pipelines/${args.pipelineId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_calendar: {
      description:
        'Get a single calendar by ID including its configuration, team members, and notification settings.',
      inputSchema: {
        type: 'object',
        properties: {
          calendarId: { type: 'string' },
        },
        required: ['calendarId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/calendars/${args.calendarId}`, {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_calendars: {
      description: 'List all calendars for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          groupId: { type: 'string', description: 'Optional calendar group ID to filter by' },
          skip: { type: 'number', description: 'Number of records to skip (default 0)' },
          limit: { type: 'number', description: 'Max records to return (default 20)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = { locationId: config.ghl.locationId };
        if (args.groupId) params.groupId = args.groupId;
        if (args.skip !== undefined) params.skip = args.skip;
        if (args.limit !== undefined) params.limit = args.limit;
        const data = await client.get('/calendars/', params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_calendar_groups: {
      description: 'List all calendar groups for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const data = await client.get('/calendars/groups', {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

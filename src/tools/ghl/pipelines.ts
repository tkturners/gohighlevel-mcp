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

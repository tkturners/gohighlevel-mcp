import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createCustomValueTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_custom_values: {
      description: 'List all custom values (location-level variables) for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const data = await client.get(`/locations/${config.ghl.locationId}/customValues`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_custom_value: {
      description: 'Create a new custom value (location-level variable) in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Display name of the custom value' },
          value: { type: 'string', description: 'The value to store' },
        },
        required: ['name', 'value'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post(`/locations/${config.ghl.locationId}/customValues`, {
          name: args.name,
          value: args.value,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_custom_value: {
      description: 'Update an existing custom value by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          customValueId: { type: 'string' },
          name: { type: 'string' },
          value: { type: 'string' },
        },
        required: ['customValueId', 'name', 'value'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { customValueId, ...body } = args;
        const data = await client.put(
          `/locations/${config.ghl.locationId}/customValues/${customValueId}`,
          body
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_custom_value: {
      description: 'Delete a custom value by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          customValueId: { type: 'string' },
        },
        required: ['customValueId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(
          `/locations/${config.ghl.locationId}/customValues/${args.customValueId}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

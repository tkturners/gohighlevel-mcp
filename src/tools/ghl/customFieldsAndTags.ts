import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createCustomFieldAndTagTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_custom_fields: {
      description: 'List custom fields for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const data = await client.get(`/locations/${config.ghl.locationId}/customFields`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_tags: {
      description: 'List all tags for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/tags/', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_tag: {
      description: 'Create a new tag in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['name'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/tags/', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_tag: {
      description: 'Update an existing tag name or description.',
      inputSchema: {
        type: 'object',
        properties: {
          tagId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['tagId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { tagId, ...body } = args;
        const data = await client.put(`/tags/${tagId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_tag: {
      description: 'Delete a tag by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          tagId: { type: 'string' },
        },
        required: ['tagId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/tags/${args.tagId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_custom_field: {
      description:
        'Create a custom field in GoHighLevel. Data types: TEXT, LARGE_TEXT, NUMERICAL, PHONE, MONETORY, CHECKBOX, SINGLE_OPTIONS, MULTIPLE_OPTIONS, DATE, TEXTBOX_LIST, FILE_UPLOAD, RADIO, EMAIL.',
      inputSchema: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            enum: ['contact', 'opportunity', 'appointment'],
            default: 'contact',
          },
          name: { type: 'string', description: 'Display name of the field' },
          fieldKey: { type: 'string', description: 'Machine name (e.g., roof_leak)' },
          placeholder: { type: 'string', description: 'Placeholder text' },
          dataType: {
            type: 'string',
            enum: [
              'TEXT',
              'LARGE_TEXT',
              'NUMERICAL',
              'PHONE',
              'MONETORY',
              'CHECKBOX',
              'SINGLE_OPTIONS',
              'MULTIPLE_OPTIONS',
              'DATE',
              'TEXTBOX_LIST',
              'FILE_UPLOAD',
              'RADIO',
              'EMAIL',
            ],
          },
          options: {
            type: 'array',
            items: { type: 'object' },
            description: 'Required for SINGLE_OPTIONS, MULTIPLE_OPTIONS, RADIO, CHECKBOX',
          },
        },
        required: ['name', 'fieldKey', 'dataType'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = {
          name: args.name,
          fieldKey: args.fieldKey,
          dataType: args.dataType,
        };
        if (args.placeholder) payload.placeholder = args.placeholder;
        if (args.options) payload.options = args.options;
        const data = await client.post(`/locations/${config.ghl.locationId}/customFields`, payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_custom_field: {
      description: 'Update an existing custom field (name, placeholder, options).',
      inputSchema: {
        type: 'object',
        properties: {
          fieldId: { type: 'string' },
          name: { type: 'string' },
          placeholder: { type: 'string' },
          options: { type: 'array', items: { type: 'object' } },
        },
        required: ['fieldId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { fieldId, ...body } = args;
        const data = await client.put(
          `/locations/${config.ghl.locationId}/customFields/${fieldId}`,
          body
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_custom_field: {
      description: 'Delete a custom field by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          fieldId: { type: 'string' },
        },
        required: ['fieldId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(
          `/locations/${config.ghl.locationId}/customFields/${args.fieldId}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

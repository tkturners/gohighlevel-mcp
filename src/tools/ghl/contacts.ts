import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createContactTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_contacts: {
      description:
        'List contacts from GoHighLevel for the configured location. Supports pagination and search.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results per page (default: 25)', default: 25 },
          page: { type: 'number', description: 'Page number (default: 1)', default: 1 },
          query: { type: 'string', description: 'Search query (name, email, phone, or company)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/contacts/', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
          query: args.query,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_contact: {
      description: 'Get a single contact by ID from GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
        },
        required: ['contactId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/contacts/${args.contactId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_contact: {
      description: 'Create a new contact in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          companyName: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags to apply' },
          customFields: {
            type: 'array',
            items: { type: 'object' },
            description: 'Custom field values',
          },
        },
        required: ['firstName', 'lastName'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = {
          locationId: config.ghl.locationId,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phone: args.phone,
          companyName: args.companyName,
          tags: args.tags,
          customFields: args.customFields,
        };
        const data = await client.post('/contacts/', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_contact: {
      description: 'Update an existing contact in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          companyName: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['contactId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { contactId, ...body } = args;
        const data = await client.put(`/contacts/${contactId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_contact: {
      description: 'Delete a contact from GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
        },
        required: ['contactId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/contacts/${args.contactId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_search_contacts: {
      description:
        'Search contacts using the modern POST search endpoint (recommended over list). Supports filtering by name, email, phone, and company.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query (name, email, phone, or company)' },
          limit: { type: 'number', description: 'Max results per page (default: 25)', default: 25 },
          page: { type: 'number', description: 'Page number (default: 1)', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = {
          locationId: config.ghl.locationId,
          page: args.page ?? 1,
          pageLimit: args.limit ?? 25,
        };
        if (args.query) payload.query = args.query;
        const data = await client.post('/contacts/search', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_add_contact_tags: {
      description: 'Add one or more tags to a contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags to add',
          },
        },
        required: ['contactId', 'tags'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post(`/contacts/${args.contactId}/tags`, {
          tags: args.tags,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_remove_contact_tags: {
      description: 'Remove one or more tags from a contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Tags to remove',
          },
        },
        required: ['contactId', 'tags'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.request('DELETE', `/contacts/${args.contactId}/tags`, {
          data: { tags: args.tags },
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

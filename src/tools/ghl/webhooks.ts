import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createWebhookTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_webhooks: {
      description: 'List webhooks for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/webhooks', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_webhook: {
      description:
        'Create a new webhook in GoHighLevel. Common events: contact.create, contact.update, opportunity.create, opportunity.update, appointment.create, appointment.update.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Webhook name' },
          url: { type: 'string', description: 'Target URL to send events to' },
          event: {
            type: 'string',
            description: 'Event type to subscribe to (e.g., contact.create)',
          },
        },
        required: ['name', 'url', 'event'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/webhooks', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_webhook: {
      description: 'Delete a webhook by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          webhookId: { type: 'string' },
        },
        required: ['webhookId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.request('DELETE', `/webhooks/${args.webhookId}`, {
          params: { locationId: config.ghl.locationId },
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createConversationTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_conversations: {
      description: 'List conversations (SMS/email/chat) for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['all', 'read', 'unread', 'recents', 'mine'],
            default: 'all',
          },
          leadStatus: {
            type: 'string',
            enum: ['all', 'appointment', 'sale', 'nurture', 'closed'],
            default: 'all',
          },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/conversations/', {
          locationId: config.ghl.locationId,
          status: args.status ?? 'all',
          leadStatus: args.leadStatus ?? 'all',
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_conversation: {
      description: 'Get a single conversation by ID including messages.',
      inputSchema: {
        type: 'object',
        properties: {
          conversationId: { type: 'string' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
        required: ['conversationId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/conversations/${args.conversationId}`, {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_send_message: {
      description: 'Send an SMS or email message to a contact in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
          message: { type: 'string', description: 'Message body' },
          channel: { type: 'string', enum: ['sms', 'email', 'whatsapp'], default: 'sms' },
          subject: { type: 'string', description: 'Email subject (required for email)' },
          templateId: { type: 'string', description: 'Optional message template ID' },
        },
        required: ['contactId', 'message', 'channel'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = {
          locationId: config.ghl.locationId,
          contactId: args.contactId,
          message: args.message,
          channel: args.channel,
        };
        if (args.subject) payload.subject = args.subject;
        if (args.templateId) payload.templateId = args.templateId;

        const data = await client.post('/conversations/messages', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_search_conversations: {
      description: 'Search conversations by contact name, email, or phone.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
        required: ['query'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/conversations/search', {
          locationId: config.ghl.locationId,
          q: args.query,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_users: {
      description: 'List all users/staff in the configured GoHighLevel location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/users/', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_user: {
      description: 'Get a single user/staff member by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
        },
        required: ['userId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/users/${args.userId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createAiAgentTools(client: GhlClient): Record<string, Tool> {
  return {
    // ─── Voice AI Agents ───
    ghl_list_voice_ai_agents: {
      description: 'List AI voice agents for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async (_args: Record<string, unknown>) => {
        const data = await client.get('/voice-ai/agents', {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_voice_ai_agent: {
      description: 'Get a single voice AI agent configuration by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/voice-ai/agents/${args.agentId}`, {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_voice_ai_agent: {
      description: 'Create a new voice AI agent in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          agentName: { type: 'string' },
          welcomeMessage: { type: 'string' },
          agentPrompt: {
            type: 'string',
            description: 'System prompt / instructions for the agent',
          },
          voiceId: { type: 'string' },
          language: { type: 'string', default: 'en-US' },
        },
        required: ['agentName', 'agentPrompt'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/voice-ai/agents', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_voice_ai_agent: {
      description: 'Update an existing voice AI agent configuration.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
          agentName: { type: 'string' },
          welcomeMessage: { type: 'string' },
          agentPrompt: { type: 'string' },
          voiceId: { type: 'string' },
          language: { type: 'string' },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { agentId, ...body } = args;
        const data = await client.request('PATCH', `/voice-ai/agents/${agentId}`, {
          data: body,
          params: { locationId: config.ghl.locationId },
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_voice_ai_agent: {
      description: 'Delete a voice AI agent.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.request('DELETE', `/voice-ai/agents/${args.agentId}`, {
          params: { locationId: config.ghl.locationId },
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    // ─── Conversation AI Agents ───
    ghl_list_conversation_ai_agents: {
      description:
        'Search conversation AI agents for the location. Note: GHL API may return incomplete results.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Filter by agent name' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.name) params.name = args.name;
        const data = await client.get('/conversation-ai/agents/search', params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_conversation_ai_agent: {
      description: 'Get a single conversation AI agent by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/conversation-ai/agents/${args.agentId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_conversation_ai_agent: {
      description: 'Create a new conversation AI agent in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          personality: { type: 'string' },
          goal: { type: 'string' },
          instructions: { type: 'string' },
        },
        required: ['name', 'personality', 'goal', 'instructions'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post('/conversation-ai/agents', args);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_conversation_ai_agent: {
      description: 'Update an existing conversation AI agent.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
          name: { type: 'string' },
          personality: { type: 'string' },
          goal: { type: 'string' },
          instructions: { type: 'string' },
          mode: { type: 'string', enum: ['off', 'auto-pilot', 'suggestive'] },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { agentId, ...body } = args;
        const data = await client.put(`/conversation-ai/agents/${agentId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_conversation_ai_agent: {
      description: 'Delete a conversation AI agent.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
        },
        required: ['agentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/conversation-ai/agents/${args.agentId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    // ─── Conversation AI Actions ───
    ghl_get_conversation_ai_action: {
      description: 'Get a single action attached to a conversation AI agent.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
          actionId: { type: 'string' },
        },
        required: ['agentId', 'actionId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(
          `/conversation-ai/agents/${args.agentId}/actions/${args.actionId}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_conversation_ai_action: {
      description:
        'Create and attach a new action to a conversation AI agent. Types: triggerWorkflow, updateContactField, appointmentBooking, stopBot, humanHandOver, advancedFollowup, transferBot.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
          name: { type: 'string' },
          type: {
            type: 'string',
            enum: [
              'triggerWorkflow',
              'updateContactField',
              'appointmentBooking',
              'stopBot',
              'humanHandOver',
              'advancedFollowup',
              'transferBot',
            ],
          },
          details: { type: 'object', description: 'Action-specific configuration object' },
        },
        required: ['agentId', 'name', 'type', 'details'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { agentId, ...body } = args;
        const data = await client.post(`/conversation-ai/agents/${agentId}/actions`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_conversation_ai_action: {
      description: 'Delete an action from a conversation AI agent.',
      inputSchema: {
        type: 'object',
        properties: {
          agentId: { type: 'string' },
          actionId: { type: 'string' },
        },
        required: ['agentId', 'actionId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(
          `/conversation-ai/agents/${args.agentId}/actions/${args.actionId}`
        );
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    // ─── Knowledge Bases ───
    ghl_get_knowledge_base: {
      description: 'Get a knowledge base by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          knowledgeBaseId: { type: 'string' },
        },
        required: ['knowledgeBaseId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/knowledge-bases/${args.knowledgeBaseId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

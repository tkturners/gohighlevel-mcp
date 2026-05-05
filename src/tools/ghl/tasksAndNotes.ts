import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createTaskAndNoteTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_tasks: {
      description: 'List tasks for the configured location or a specific contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'Filter by contact ID' },
          assignedTo: { type: 'string', description: 'Filter by assigned user ID' },
          status: { type: 'string', enum: ['completed', 'incomplete'], default: 'incomplete' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/tasks/', {
          locationId: config.ghl.locationId,
          contactId: args.contactId,
          assignedTo: args.assignedTo,
          status: args.status ?? 'incomplete',
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_task: {
      description: 'Create a new task in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', description: 'ISO 8601 datetime' },
          assignedTo: { type: 'string', description: 'User ID to assign' },
          status: { type: 'string', enum: ['completed', 'incomplete'], default: 'incomplete' },
        },
        required: ['title'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/tasks/', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_notes: {
      description: 'List notes for a specific contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string', description: 'GoHighLevel contact ID' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
        required: ['contactId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/contacts/' + args.contactId + '/notes', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_note: {
      description: 'Create a note for a contact in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          body: { type: 'string', description: 'Note content' },
          userId: { type: 'string', description: 'User ID creating the note' },
        },
        required: ['contactId', 'body'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { contactId, ...body } = args;
        const payload = { locationId: config.ghl.locationId, ...body };
        const data = await client.post(`/contacts/${contactId}/notes`, payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_task: {
      description: 'Update an existing task in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          dueDate: { type: 'string', description: 'ISO 8601 datetime' },
          assignedTo: { type: 'string', description: 'User ID to assign' },
          status: { type: 'string', enum: ['completed', 'incomplete'] },
        },
        required: ['taskId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { taskId, ...body } = args;
        const data = await client.put(`/tasks/${taskId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_task: {
      description: 'Delete a task by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          taskId: { type: 'string' },
        },
        required: ['taskId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/tasks/${args.taskId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_note: {
      description: 'Update an existing note for a contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          noteId: { type: 'string' },
          body: { type: 'string', description: 'Updated note content' },
        },
        required: ['contactId', 'noteId', 'body'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { contactId, noteId, body } = args;
        const data = await client.put(`/contacts/${contactId}/notes/${noteId}`, { body });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_note: {
      description: 'Delete a note by ID from a contact.',
      inputSchema: {
        type: 'object',
        properties: {
          contactId: { type: 'string' },
          noteId: { type: 'string' },
        },
        required: ['contactId', 'noteId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/contacts/${args.contactId}/notes/${args.noteId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

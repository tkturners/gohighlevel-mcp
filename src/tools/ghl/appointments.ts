import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createAppointmentTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_appointments: {
      description: 'List calendar appointments for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          calendarId: { type: 'string', description: 'Filter by calendar ID' },
          startDate: {
            type: 'string',
            description: 'ISO 8601 start date (e.g., 2026-05-01T00:00:00Z)',
          },
          endDate: { type: 'string', description: 'ISO 8601 end date' },
          limit: { type: 'number', default: 25 },
          page: { type: 'number', default: 1 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/calendars/events/', {
          locationId: config.ghl.locationId,
          calendarId: args.calendarId,
          startDate: args.startDate,
          endDate: args.endDate,
          limit: args.limit ?? 25,
          page: args.page ?? 1,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_appointment: {
      description: 'Get a single appointment by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          appointmentId: { type: 'string' },
        },
        required: ['appointmentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/calendars/events/${args.appointmentId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_appointment: {
      description: 'Create a new appointment in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          calendarId: { type: 'string' },
          contactId: { type: 'string' },
          startTime: { type: 'string', description: 'ISO 8601 datetime' },
          endTime: { type: 'string', description: 'ISO 8601 datetime' },
          title: { type: 'string' },
          description: { type: 'string' },
          address: { type: 'string' },
          assignedUserId: { type: 'string' },
        },
        required: ['calendarId', 'contactId', 'startTime', 'endTime', 'title'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = {
          locationId: config.ghl.locationId,
          ...args,
        };
        const data = await client.post('/calendars/events/', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_appointment: {
      description: 'Update an existing appointment.',
      inputSchema: {
        type: 'object',
        properties: {
          appointmentId: { type: 'string' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['confirmed', 'cancelled', 'completed', 'no_show'] },
        },
        required: ['appointmentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { appointmentId, ...body } = args;
        const data = await client.put(`/calendars/events/${appointmentId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_appointment: {
      description: 'Delete an appointment.',
      inputSchema: {
        type: 'object',
        properties: {
          appointmentId: { type: 'string' },
        },
        required: ['appointmentId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/calendars/events/${args.appointmentId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

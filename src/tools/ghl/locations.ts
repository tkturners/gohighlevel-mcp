import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createLocationTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_get_location: {
      description:
        'Get the configured GoHighLevel location details (name, address, timezone, settings).',
      inputSchema: {
        type: 'object',
        properties: {},
      },
      handler: async () => {
        const data = await client.get(`/locations/${config.ghl.locationId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

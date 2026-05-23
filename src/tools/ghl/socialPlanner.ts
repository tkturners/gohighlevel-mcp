import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

const loc = () => config.ghl.locationId;

export function createSocialPlannerTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_social_accounts: {
      description: 'List all connected social media accounts (Facebook, Instagram, LinkedIn, TikTok, Twitter/X, Google Business, YouTube) for the configured location.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/social-media-posting/${loc()}/accounts`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_social_post: {
      description: 'Get a single social media post by its ID.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string', description: 'Social media post ID (_id from list response)' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/social-media-posting/${loc()}/posts/${args.postId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_social_posts: {
      description: 'List social media posts with optional status and account filters.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results (default: 20)', default: 20 },
          status: { type: 'string', description: 'Filter by status', enum: ['scheduled', 'published', 'draft', 'failed'] },
          accountId: { type: 'string', description: 'Filter by social account ID' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = { limit: String(args.limit ?? 20) };
        if (args.status) payload.status = args.status;
        if (args.accountId) payload.accountId = args.accountId;
        const data = await client.post(`/social-media-posting/${loc()}/posts/list`, payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_social_post: {
      description: 'Create a new social media post. Supports Facebook, Instagram, LinkedIn, TikTok, YouTube, Pinterest, Google Business.',
      inputSchema: {
        type: 'object',
        properties: {
          summary: { type: 'string', description: 'Post content/caption' },
          accountIds: { type: 'array', items: { type: 'string' }, description: 'Social account IDs to post to' },
          scheduleDate: { type: 'string', description: 'ISO date to schedule the post (omit for immediate)' },
          status: { type: 'string', description: 'draft or scheduled', enum: ['draft', 'scheduled'] },
          type: { type: 'string', description: 'Post type: post, story, or reel', default: 'post' },
          categoryId: { type: 'string', description: 'Category ID' },
          tags: { type: 'array', items: { type: 'string' }, description: 'Tags to apply' },
          media: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, caption: { type: 'string' }, type: { type: 'string' } } }, description: 'Media attachments' },
        },
        required: ['summary', 'accountIds'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload: Record<string, unknown> = {
          summary: args.summary,
          accountIds: args.accountIds,
          type: args.type ?? 'post',
          status: args.status ?? 'draft',
        };
        if (args.scheduleDate) payload.scheduleDate = args.scheduleDate;
        if (args.categoryId) payload.categoryId = args.categoryId;
        if (args.tags) payload.tags = args.tags;
        if (args.media) payload.media = args.media;
        const data = await client.post(`/social-media-posting/${loc()}/posts`, payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_social_post: {
      description: 'Update an existing social media post.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string', description: 'Post ID to update' },
          summary: { type: 'string', description: 'Updated post content' },
          scheduleDate: { type: 'string', description: 'Updated schedule date (ISO)' },
          status: { type: 'string', description: 'draft or scheduled', enum: ['draft', 'scheduled'] },
          categoryId: { type: 'string', description: 'Category ID' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { postId, ...body } = args;
        const data = await client.put(`/social-media-posting/${loc()}/posts/${postId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_social_post: {
      description: 'Delete a single social media post.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string', description: 'Post ID to delete' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/social-media-posting/${loc()}/posts/${args.postId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_bulk_delete_social_posts: {
      description: 'Delete multiple social media posts by their IDs.',
      inputSchema: {
        type: 'object',
        properties: {
          ids: { type: 'array', items: { type: 'string' }, description: 'Array of post IDs to delete' },
        },
        required: ['ids'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post(`/social-media-posting/${loc()}/posts/bulk-delete`, { ids: args.ids });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_social_statistics: {
      description: 'Get social media analytics including posts, likes, impressions, comments, followers, and engagement breakdowns by platform. Automatically fetches all accounts if no profileIds provided.',
      inputSchema: {
        type: 'object',
        properties: {
          profileIds: { type: 'array', items: { type: 'string' }, description: 'Profile IDs to filter by (omit for all accounts)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        let profileIds = args.profileIds as string[] | undefined;
        if (!profileIds || profileIds.length === 0) {
          const accts = await client.get(`/social-media-posting/${loc()}/accounts`);
          profileIds = (accts as any)?.results?.accounts?.map((a: any) => a.profileId).filter(Boolean) ?? [];
        }
        const data = await client.post(`/social-media-posting/statistics?locationId=${loc()}`, { profileIds });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_social_categories: {
      description: 'List all social media post categories.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/social-media-posting/${loc()}/categories`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_social_tags: {
      description: 'List all social media post tags.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/social-media-posting/${loc()}/tags`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_social_tags_by_ids: {
      description: 'Get details for specific social media post tags by their IDs.',
      inputSchema: {
        type: 'object',
        properties: {
          ids: { type: 'array', items: { type: 'string' }, description: 'Array of tag IDs' },
        },
        required: ['ids'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post(`/social-media-posting/${loc()}/tags/details`, { ids: args.ids });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_social_oauth_url: {
      description: 'Get the OAuth URL to connect a social media account (Facebook, Instagram, LinkedIn, TikTok, Twitter/X, Google Business). Requires a userId from the location.',
      inputSchema: {
        type: 'object',
        properties: {
          platform: { type: 'string', description: 'Platform to connect', enum: ['facebook', 'instagram', 'linkedin', 'tiktok', 'twitter', 'google'] },
          userId: { type: 'string', description: 'GHL user ID initiating the OAuth connection' },
          callback: { type: 'string', description: 'Optional custom callback URL' },
        },
        required: ['platform', 'userId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = { userId: args.userId };
        if (args.callback) params.callback = args.callback;
        const data = await client.get(`/social-media-posting/oauth/${args.platform}/start?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_social_account: {
      description: 'Disconnect/delete a connected social media account.',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string', description: 'Social account ID to disconnect' },
        },
        required: ['accountId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/social-media-posting/${loc()}/accounts/${args.accountId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_upload_social_csv: {
      description: 'Upload a CSV file for bulk social media post scheduling.',
      inputSchema: {
        type: 'object',
        properties: {
          fileUrl: { type: 'string', description: 'URL of the CSV file to upload' },
          accountIds: { type: 'array', items: { type: 'string' }, description: 'Social account IDs to assign posts to' },
        },
        required: ['fileUrl'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.post(`/social-media-posting/${loc()}/csv`, { fileUrl: args.fileUrl, accountIds: args.accountIds });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_social_csv_status: {
      description: 'Get the status of a CSV upload for bulk post scheduling.',
      inputSchema: {
        type: 'object',
        properties: {
          csvId: { type: 'string', description: 'CSV upload ID' },
        },
        required: ['csvId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/social-media-posting/${loc()}/csv/${args.csvId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

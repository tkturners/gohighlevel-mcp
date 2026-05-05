import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

export function createBlogTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_list_blog_sites: {
      description: 'List all blog sites for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 },
          skip: { type: 'number', default: 0 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/blogs/site/all', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 10,
          skip: args.skip ?? 0,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_blog_authors: {
      description: 'List all blog authors for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 },
          offset: { type: 'number', default: 0 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/blogs/authors', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 10,
          offset: args.offset ?? 0,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_blog_categories: {
      description: 'List all blog categories for the configured location.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 },
          offset: { type: 'number', default: 0 },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/blogs/categories', {
          locationId: config.ghl.locationId,
          limit: args.limit ?? 10,
          offset: args.offset ?? 0,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_blog_posts: {
      description: 'List blog posts for a specific blog site.',
      inputSchema: {
        type: 'object',
        properties: {
          blogId: { type: 'string', description: 'Blog site ID' },
          limit: { type: 'number', default: 10 },
          offset: { type: 'number', default: 0 },
          status: { type: 'string', enum: ['PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'] },
        },
        required: ['blogId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get('/blogs/posts/all', {
          locationId: config.ghl.locationId,
          blogId: args.blogId,
          limit: args.limit ?? 10,
          offset: args.offset ?? 0,
          status: args.status,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_blog_post: {
      description: 'Get a single blog post by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/blogs/posts/${args.postId}`, {
          locationId: config.ghl.locationId,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_create_blog_post: {
      description: 'Create a new blog post in GoHighLevel.',
      inputSchema: {
        type: 'object',
        properties: {
          blogId: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          content: { type: 'string' },
          description: { type: 'string' },
          authorId: { type: 'string' },
          categories: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['PUBLISHED', 'DRAFT', 'SCHEDULED'] },
          coverImageUrl: { type: 'string' },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
        },
        required: ['blogId', 'title', 'slug', 'content', 'authorId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const payload = { locationId: config.ghl.locationId, ...args };
        const data = await client.post('/blogs/posts', payload);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_update_blog_post: {
      description: 'Update an existing blog post.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string' },
          title: { type: 'string' },
          slug: { type: 'string' },
          content: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['PUBLISHED', 'DRAFT', 'SCHEDULED'] },
          coverImageUrl: { type: 'string' },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const { postId, ...body } = args;
        const data = await client.put(`/blogs/posts/${postId}`, body);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_delete_blog_post: {
      description: 'Delete a blog post by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          postId: { type: 'string' },
        },
        required: ['postId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.delete(`/blogs/posts/${args.postId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

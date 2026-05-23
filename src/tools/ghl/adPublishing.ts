import { GhlClient } from '../../services/ghl/client.js';
import { config } from '../../config/environment.js';
import { Tool } from './types.js';

const loc = () => config.ghl.locationId;

export function createAdPublishingTools(client: GhlClient): Record<string, Tool> {
  return {
    ghl_get_facebook_me: {
      description: 'Get the authenticated Facebook user details.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/me?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_facebook_pages: {
      description: 'List Facebook pages connected to the ad publishing integration.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/pages?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_page_instagram: {
      description: 'Get the Instagram account connected to a specific Facebook page.',
      inputSchema: {
        type: 'object',
        properties: {
          pageId: { type: 'string', description: 'Facebook page ID' },
        },
        required: ['pageId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/ad-publishing/facebook/page/${args.pageId}/instagram?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_facebook_ad_accounts: {
      description: 'List Facebook ad accounts available through the connected integration.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/ad-accounts?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_ad_account: {
      description: 'Get a single Facebook ad account by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          adAccountId: { type: 'string', description: 'Facebook ad account ID (e.g. act_123456789)' },
        },
        required: ['adAccountId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/ad-publishing/facebook/ad-accounts/${args.adAccountId}?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_facebook_campaigns: {
      description: 'List Facebook ad campaigns.',
      inputSchema: {
        type: 'object',
        properties: {
          status: { type: 'string', description: 'Filter by campaign status' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.status) params.status = args.status;
        const data = await client.get(`/ad-publishing/facebook/campaigns?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_campaign: {
      description: 'Get a single Facebook ad campaign by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          campaignId: { type: 'string', description: 'Facebook campaign ID' },
        },
        required: ['campaignId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/ad-publishing/facebook/campaign/${args.campaignId}?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_ad: {
      description: 'Get a single Facebook ad by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          adId: { type: 'string', description: 'Facebook ad ID' },
        },
        required: ['adId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/ad-publishing/facebook/ads/${args.adId}?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_ad_insights: {
      description: 'Get Facebook ad insights/analytics data.',
      inputSchema: {
        type: 'object',
        properties: {
          level: { type: 'string', description: 'Insight level: account, campaign, adset, ad' },
          datePreset: { type: 'string', description: 'Date range: today, yesterday, last_7d, last_30d, last_90d, this_month, last_month, lifetime' },
          timeStart: { type: 'string', description: 'Custom start date (ISO)' },
          timeEnd: { type: 'string', description: 'Custom end date (ISO)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.level) params.level = args.level;
        if (args.datePreset) params.date_preset = args.datePreset;
        if (args.timeStart) params.time_start = args.timeStart;
        if (args.timeEnd) params.time_end = args.timeEnd;
        const data = await client.get(`/ad-publishing/facebook/ad-insights?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_reporting: {
      description: 'Get Facebook ad reporting data across campaigns.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Report type (account, campaign, adset, ad)' },
          datePreset: { type: 'string', description: 'Date range: today, yesterday, last_7d, last_30d, last_90d, this_month, last_month, lifetime' },
          timeStart: { type: 'string', description: 'Custom start date (ISO)' },
          timeEnd: { type: 'string', description: 'Custom end date (ISO)' },
          fields: { type: 'array', items: { type: 'string' }, description: 'Fields to include (impressions, reach, clicks, spend, cpm, etc.)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.type) params.type = args.type;
        if (args.datePreset) params.date_preset = args.datePreset;
        if (args.timeStart) params.time_start = args.timeStart;
        if (args.timeEnd) params.time_end = args.timeEnd;
        if (args.fields) params.fields = args.fields;
        const data = await client.get(`/ad-publishing/facebook/reporting?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_campaign_reporting: {
      description: 'Get Facebook ad reporting data for a specific campaign.',
      inputSchema: {
        type: 'object',
        properties: {
          campaignId: { type: 'string', description: 'Facebook campaign ID' },
          datePreset: { type: 'string', description: 'Date range preset' },
          timeStart: { type: 'string', description: 'Custom start date (ISO)' },
          timeEnd: { type: 'string', description: 'Custom end date (ISO)' },
        },
        required: ['campaignId'],
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.datePreset) params.date_preset = args.datePreset;
        if (args.timeStart) params.time_start = args.timeStart;
        if (args.timeEnd) params.time_end = args.timeEnd;
        const data = await client.get(`/ad-publishing/facebook/reporting/campaign/${args.campaignId}?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_reporting_list: {
      description: 'Get a list of Facebook ad reporting data.',
      inputSchema: {
        type: 'object',
        properties: {
          listType: { type: 'string', description: 'Report list type' },
          startDate: { type: 'string', description: 'Start date (ISO, required)' },
          endDate: { type: 'string', description: 'End date (ISO, required)' },
        },
        required: ['listType', 'startDate', 'endDate'],
      },
      handler: async (args: Record<string, unknown>) => {
        const data = await client.get(`/ad-publishing/facebook/reporting/list?locationId=${loc()}`, {
          listType: args.listType,
          startDate: args.startDate,
          endDate: args.endDate,
        });
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_facebook_pixels: {
      description: 'List Facebook pixels connected to the integration.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/pixels?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_list_facebook_custom_audiences: {
      description: 'List Facebook custom audiences.',
      inputSchema: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Audience type filter' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.type) params.type = args.type;
        const data = await client.get(`/ad-publishing/facebook/custom-audience?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_max_budget: {
      description: 'Get the maximum budget for Facebook ad accounts.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/max-budget?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_facebook_integration: {
      description: 'Get the Facebook ad publishing integration status.',
      inputSchema: { type: 'object', properties: {} },
      handler: async () => {
        const data = await client.get(`/ad-publishing/facebook/integration?locationId=${loc()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_google_reporting: {
      description: 'Get Google Ads reporting data.',
      inputSchema: {
        type: 'object',
        properties: {
          datePreset: { type: 'string', description: 'Date range preset' },
          timeStart: { type: 'string', description: 'Custom start date (ISO)' },
          timeEnd: { type: 'string', description: 'Custom end date (ISO)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.datePreset) params.date_preset = args.datePreset;
        if (args.timeStart) params.time_start = args.timeStart;
        if (args.timeEnd) params.time_end = args.timeEnd;
        const data = await client.get(`/ad-publishing/google/reporting?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },

    ghl_get_linkedin_reporting: {
      description: 'Get LinkedIn Ads reporting data.',
      inputSchema: {
        type: 'object',
        properties: {
          datePreset: { type: 'string', description: 'Date range preset' },
          timeStart: { type: 'string', description: 'Custom start date (ISO)' },
          timeEnd: { type: 'string', description: 'Custom end date (ISO)' },
        },
      },
      handler: async (args: Record<string, unknown>) => {
        const params: Record<string, unknown> = {};
        if (args.datePreset) params.date_preset = args.datePreset;
        if (args.timeStart) params.time_start = args.timeStart;
        if (args.timeEnd) params.time_end = args.timeEnd;
        const data = await client.get(`/ad-publishing/linkedin/reporting?locationId=${loc()}`, params);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      },
    },
  };
}

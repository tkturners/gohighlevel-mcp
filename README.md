# gohighlevel-mcp

[![npm version](https://img.shields.io/npm/v/gohighlevel-mcp.svg)](https://www.npmjs.com/package/gohighlevel-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A production-ready **Model Context Protocol (MCP) server** for [GoHighLevel](https://www.gohighlevel.com/) (GHL / LeadConnector). Connect Claude Code, Cursor, Windsurf, and any MCP-compatible client directly to your GoHighLevel CRM, pipelines, appointments, conversations, blogs, workflows, AI agents, and more.

**81 built-in tools** — the most comprehensive open-source GoHighLevel MCP integration available.

> **Note:** This project was originally built for NanoShield Roofing. It has been generalized for public use. Replace placeholder values with your own GHL credentials.

## Table of Contents

- [Why gohighlevel-mcp?](#why-gohighlevel-mcp)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Tools](#available-tools)
- [Development](#development)
- [Known API Limitations](#known-api-limitations)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Related Projects](#related-projects)
- [License](#license)

---

## Why gohighlevel-mcp?

Most GoHighLevel integrations require no-code platforms like Zapier or n8n. This **GoHighLevel MCP server** lets you control your entire GHL account using natural language through AI assistants like Claude. Instead of clicking through dashboards, you can:

- Query contacts, deals, and calendars conversationally
- Automate CRM workflows with AI-generated commands
- Integrate GoHighLevel data into software projects using TypeScript
- Build custom GoHighLevel automations without writing boilerplate API code

If you are looking for a **GoHighLevel API wrapper**, **GHL CLI tool**, or **LeadConnector integration**, this MCP server provides a type-safe, well-documented bridge between GoHighLevel and modern AI agents.

---

## Features

- **81 MCP tools** covering Contacts, Opportunities, Appointments, Pipelines, Calendars, Conversations, Blogs, Tasks, Notes, Custom Fields, Tags, Workflows, Voice AI, Conversation AI, Webhooks, Custom Values, and Locations
- **Dual authentication** — Private Integration Token (PIT) or OAuth 2.0 with automatic refresh
- **TypeScript-first** — fully typed handlers, no `any` types, strict ESLint rules
- **Zero config** — `prepare` script builds automatically after `npm install`
- **CLI helper** — built-in OAuth code exchange script
- **CI ready** — GitHub Actions workflow included for lint, format, build, and secret scanning

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/tkturners/gohighlevel-mcp.git
cd gohighlevel-mcp

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your GHL_API_TOKEN and GHL_LOCATION_ID

# 4. Start the server
npm run dev
```

To connect Claude Code, add this to your `~/.claude.json`:

```json
{
  "mcpServers": {
    "gohighlevel-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/gohighlevel-mcp/dist/index.js"],
      "env": {
        "GHL_API_TOKEN": "YOUR_TOKEN",
        "GHL_LOCATION_ID": "your_location_id_here"
      }
    }
  }
}
```

---

## Architecture

```
src/
  index.ts                       # MCP server entry point (stdio transport)
  config/
    environment.ts               # Env var loading and validation
  services/
    ghl/
      client.ts                  # Axios-based GHL API client with auth & token refresh
  tools/
    ghl/
      types.ts                   # Shared Tool interface
      contacts.ts                # Contact CRUD + search
      opportunities.ts           # Opportunity/deal CRUD
      appointments.ts            # Calendar event CRUD
      pipelines.ts               # Pipeline stages + calendars
      conversations.ts           # Messaging, conversations, users
      blogs.ts                   # Blog sites, authors, categories, posts
      tasksAndNotes.ts           # Tasks and contact notes
      customFieldsAndTags.ts     # Custom fields and tags
      customValues.ts            # Location-level custom values
      workflows.ts               # Automation workflow metadata
      aiAgents.ts                # Voice AI + Conversation AI agents + actions + knowledge bases
      webhooks.ts                # Webhook management
      locations.ts               # Location details
scripts/
  oauth-exchange.ts              # CLI helper to exchange OAuth codes for tokens
```

### Auth Flow

The `GhlClient` supports two authentication methods:

1. **Private Integration Token (PIT)** — A long-lived bearer token generated in GHL. Preferred for single-location integrations.
2. **OAuth 2.0** — Short-lived access tokens with automatic refresh. Required for app-marketplace integrations.

The client applies `Authorization: Bearer <token>` to every request and attaches the `Version: 2021-07-28` header required by GHL API v2.

---

## Installation

```bash
npm install
```

Installs all runtime and dev dependencies. The `prepare` script automatically runs `npm run build` after install.

---

## Configuration

Copy `.env.example` to `.env` and configure **one** authentication method.

### Method 1: Private Integration Token (Recommended)

Generate in GHL: **Settings > Private Integrations > Create Token**

Select scopes:

- `contacts`
- `opportunities`
- `conversations`
- `workflows`
- `voice-ai-agents`
- `blogs`
- `calendars`
- `tasks`
- `users`

```bash
GHL_API_TOKEN=your_pit_here
GHL_LOCATION_ID=your_location_id_here
GHL_API_BASE=https://services.leadconnectorhq.com
GHL_API_VERSION=2021-07-28
```

### Method 2: OAuth 2.0

If you already have a refresh token:

```bash
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REFRESH_TOKEN=your_refresh_token
GHL_LOCATION_ID=your_location_id_here
```

If you only have an authorization code, exchange it:

```bash
npm run oauth:exchange -- --code=<code> --client-id=<id> --client-secret=<secret>
```

**Note:** OAuth authorization codes are single-use. If the code was already consumed (e.g., by n8n), generate a new one or switch to a Private Integration Token.

### Claude Code MCP Config

Add to your project or global `~/.claude.json`:

```json
{
  "mcpServers": {
    "ghl-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/nanoshield/dist/index.js"],
      "env": {
        "GHL_API_TOKEN": "YOUR_TOKEN",
        "GHL_LOCATION_ID": "your_location_id_here"
      }
    }
  }
}
```

---

## Available Tools

**Total: 81 tools**

### Contacts (8)

| Tool | Description |
|------|-------------|
| `ghl_list_contacts` | List/search contacts with pagination |
| `ghl_get_contact` | Get contact by ID |
| `ghl_create_contact` | Create contact |
| `ghl_update_contact` | Update contact |
| `ghl_delete_contact` | Delete contact |
| `ghl_search_contacts` | **Modern POST search** (recommended over list) |
| `ghl_add_contact_tags` | Add tags to a contact |
| `ghl_remove_contact_tags` | Remove tags from a contact |

### Opportunities (6)

| Tool | Description |
|------|-------------|
| `ghl_list_opportunities` | List pipeline deals with filters |
| `ghl_get_opportunity` | Get deal by ID |
| `ghl_create_opportunity` | Create deal |
| `ghl_update_opportunity` | Update deal |
| `ghl_delete_opportunity` | Delete deal |
| `ghl_search_opportunities` | **Modern POST search** with date ranges |

### Appointments (5)

| Tool | Description |
|------|-------------|
| `ghl_list_appointments` | List calendar events with date range |
| `ghl_get_appointment` | Get event by ID |
| `ghl_create_appointment` | Schedule event |
| `ghl_update_appointment` | Update event |
| `ghl_delete_appointment` | Delete event |

### Pipelines & Calendars (5)

| Tool | Description |
|------|-------------|
| `ghl_get_pipelines` | List all pipelines |
| `ghl_get_pipeline` | Get pipeline with stages |
| `ghl_list_calendars` | List calendars |
| `ghl_get_calendar` | Get calendar by ID with config |
| `ghl_list_calendar_groups` | List calendar groups |

### Conversations & Messaging (6)

| Tool | Description |
|------|-------------|
| `ghl_list_conversations` | List SMS/email/chat threads |
| `ghl_get_conversation` | Get conversation messages |
| `ghl_send_message` | Send SMS/email/WhatsApp |
| `ghl_search_conversations` | Search conversations |
| `ghl_list_users` | List staff/users |
| `ghl_get_user` | Get user by ID |

### Blogs (8)

| Tool | Description |
|------|-------------|
| `ghl_list_blog_sites` | List blog sites |
| `ghl_list_blog_authors` | List blog authors |
| `ghl_list_blog_categories` | List blog categories |
| `ghl_list_blog_posts` | List blog posts |
| `ghl_get_blog_post` | Get blog post by ID |
| `ghl_create_blog_post` | Create blog post |
| `ghl_update_blog_post` | Update blog post |
| `ghl_delete_blog_post` | Delete blog post |

### Tasks & Notes (8)

| Tool | Description |
|------|-------------|
| `ghl_list_tasks` | List tasks |
| `ghl_create_task` | Create task |
| `ghl_update_task` | Update task |
| `ghl_delete_task` | Delete task |
| `ghl_list_notes` | List contact notes |
| `ghl_create_note` | Create contact note |
| `ghl_update_note` | Update contact note |
| `ghl_delete_note` | Delete contact note |

### Custom Fields & Tags (8)

| Tool | Description |
|------|-------------|
| `ghl_list_custom_fields` | List custom fields |
| `ghl_create_custom_field` | Create custom field |
| `ghl_update_custom_field` | Update custom field |
| `ghl_delete_custom_field` | Delete custom field |
| `ghl_list_tags` | List tags |
| `ghl_create_tag` | Create tag |
| `ghl_update_tag` | Update tag |
| `ghl_delete_tag` | Delete tag |

### Workflows (5)

| Tool | Description |
|------|-------------|
| `ghl_list_workflows` | List automation workflows |
| `ghl_get_workflow` | Get workflow metadata by ID |
| `ghl_create_workflow` | Create workflow shell |
| `ghl_update_workflow` | Update workflow |
| `ghl_delete_workflow` | Delete workflow |

### Voice AI Agents (5)

| Tool | Description |
|------|-------------|
| `ghl_list_voice_ai_agents` | List voice AI agents |
| `ghl_get_voice_ai_agent` | Get voice AI agent by ID |
| `ghl_create_voice_ai_agent` | Create voice AI agent |
| `ghl_update_voice_ai_agent` | Update voice AI agent |
| `ghl_delete_voice_ai_agent` | Delete voice AI agent |

### Conversation AI Agents (5)

| Tool | Description |
|------|-------------|
| `ghl_list_conversation_ai_agents` | Search conversation AI agents |
| `ghl_get_conversation_ai_agent` | Get conversation AI agent by ID |
| `ghl_create_conversation_ai_agent` | Create conversation AI agent |
| `ghl_update_conversation_ai_agent` | Update conversation AI agent |
| `ghl_delete_conversation_ai_agent` | Delete conversation AI agent |

### Conversation AI Actions (3)

| Tool | Description |
|------|-------------|
| `ghl_get_conversation_ai_action` | Get action by ID |
| `ghl_create_conversation_ai_action` | Create action for an agent |
| `ghl_delete_conversation_ai_action` | Delete action from an agent |

### Knowledge Bases (1)

| Tool | Description |
|------|-------------|
| `ghl_get_knowledge_base` | Get knowledge base by ID |

### Webhooks (3)

| Tool | Description |
|------|-------------|
| `ghl_list_webhooks` | List webhooks |
| `ghl_create_webhook` | Create webhook |
| `ghl_delete_webhook` | Delete webhook |

### Custom Values (4)

| Tool | Description |
|------|-------------|
| `ghl_list_custom_values` | List location-level custom values |
| `ghl_create_custom_value` | Create custom value |
| `ghl_update_custom_value` | Update custom value |
| `ghl_delete_custom_value` | Delete custom value |

### Location (1)

| Tool | Description |
|------|-------------|
| `ghl_get_location` | Get location details |

---

## Development

### Scripts

```bash
npm run build          # Compile TypeScript to dist/
npm run watch          # Watch mode compilation
npm run dev            # Run directly via tsx (no build needed)
npm run lint           # Run ESLint
npm run lint:fix       # Run ESLint with auto-fix
npm run format         # Run Prettier (write)
npm run format:check   # Run Prettier (check only)
npm run oauth:exchange # Exchange OAuth code for tokens
```

### Code Style

- **No `any` types.** All handlers use `Record<string, unknown>`.
- **Explicit types** on all exported functions and public APIs.
- **Immutable updates** — spread objects instead of mutating.
- **Error handling** — narrow `unknown` errors safely before using.

### Adding a New Tool

1. Open the relevant domain file in `src/tools/ghl/` (or create a new one).
2. Import `Tool` from `./types.js`.
3. Add a new entry to the returned object:

```typescript
'ghl_my_new_tool': {
  description: 'What this tool does.',
  inputSchema: {
    type: 'object',
    properties: {
      myParam: { type: 'string', description: 'Param description' },
    },
    required: ['myParam'],
  },
  handler: async (args: Record<string, unknown>) => {
    const data = await client.get('/some-endpoint', {
      locationId: config.ghl.locationId,
      myParam: args.myParam,
    });
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  },
}
```

4. Import and merge the tool factory in `src/index.ts`.
5. Run `npm run lint && npm run build` before committing.

---

## Known API Limitations

These are platform limitations of the GoHighLevel REST API, not bugs in this server.

| Endpoint | Limitation |
|----------|------------|
| `GET /workflows/{id}` | **Does not exist.** Returns 404. Only `GET /workflows/` (metadata list) is exposed. Workflow steps/actions must be viewed in the GHL dashboard. |
| `GET /conversation-ai/agents/search` | **Returns incomplete data.** The API reports `totalCount: 4` and `count: 4` but only includes 1 agent in the `agents` array. This is a confirmed GHL bug. |
| `GET /knowledge-bases` | **Does not exist.** Returns 404. Only `GET /knowledge-bases/{id}` works. |
| `POST /conversation-ai/agents/{id}/actions` | **Complex validation schemas.** Creating actions via API often fails with opaque 400/422 errors due to undocumented required fields. Use the GHL dashboard for reliable action configuration. |

---

## Troubleshooting

### "Invalid JWT" / 401 on every endpoint

Your token has expired. If using OAuth, the refresh token may also be invalid. **Switch to a Private Integration Token** — it does not expire.

### "Not Found" on workflow endpoints

See [Known API Limitations](#known-api-limitations). Workflow detail endpoints are not exposed by GHL.

### "Cannot GET /voice-ai/agents"

The correct endpoint is `/voice-ai/agents` (no trailing slash). This server uses the correct paths verified against the live API.

### `client.patch()` throws Axios 422

Axios `patch` only accepts 2 arguments. This server uses `client.request('PATCH', path, { data: body, params: {...} })` to work around this.

### OAuth code already consumed

Authorization codes are single-use. If n8n or another service already exchanged it, generate a fresh code in GHL or use a Private Integration Token instead.

---

## FAQ

**What is an MCP server?**
A Model Context Protocol (MCP) server exposes tools that AI assistants like Claude, Cursor, and Windsurf can invoke. This lets you control GoHighLevel using natural language.

**Do I need a GoHighLevel subscription?**
Yes. You need an active GoHighLevel account and a Private Integration Token or OAuth credentials.

**Is this an official GoHighLevel project?**
No. This is an open-source community project. It is not affiliated with or endorsed by GoHighLevel.

**Can I use this with n8n or Zapier?**
This server is designed for MCP clients (Claude Code, Cursor, etc.). For n8n, use the native GoHighLevel node.

**Does it support multiple locations?**
Currently, one server instance connects to a single `GHL_LOCATION_ID`. You can run multiple instances with different environment files.

---

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) — The open protocol standard for connecting AI assistants to data sources and tools.
- [GoHighLevel Official Docs](https://help.gohighlevel.com/) — Official documentation for the GoHighLevel platform.
- [LeadConnector API Reference](https://public-api.gohighlevel.com/) — Official REST API documentation.

---

If you find this project useful, please consider [starring the repository](https://github.com/tkturners/gohighlevel-mcp) on GitHub!

## License

MIT

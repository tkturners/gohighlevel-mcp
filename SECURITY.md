# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do NOT open a public issue.**

Instead, please email security concerns to the maintainers privately. Include:

- A description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fix (if you have one)

We will acknowledge receipt within 48 hours and provide a timeline for resolution.

## Security Best Practices for Users

### Authentication

- **Use Private Integration Tokens (PIT)** for single-location integrations. These are long-lived and do not require refresh logic.
- **Rotate tokens regularly** if using OAuth 2.0.
- **Never commit tokens** to version control. Use `.env` files (already in `.gitignore`).

### Environment Variables

Store all sensitive configuration in environment variables:

```bash
GHL_API_TOKEN=your_token_here
GHL_CLIENT_ID=your_client_id
GHL_CLIENT_SECRET=your_client_secret
GHL_REFRESH_TOKEN=your_refresh_token
GHL_LOCATION_ID=your_location_id
```

### Scope of This Server

This MCP server is a **client** to the GoHighLevel API. It does not:

- Store data locally (stateless)
- Expose its own authentication endpoints
- Handle webhooks directly (it can list/create/delete webhook subscriptions)

All API requests are authenticated via the configured token and sent over HTTPS to GHL's servers.

## Known Security Considerations

### Log Output

The server logs the location ID and API base URL on startup to stderr. It **never** logs tokens or secrets.

### Error Messages

API errors are passed through to the MCP client. They may contain GHL-specific error messages but do not leak local secrets.

### Dependency Updates

Run `npm audit` regularly and update dependencies promptly. The project uses:

- `axios` for HTTP requests
- `@modelcontextprotocol/sdk` for MCP protocol
- `dotenv` for environment loading

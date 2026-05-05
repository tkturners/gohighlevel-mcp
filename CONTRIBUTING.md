# Contributing to GHL MCP Server

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/ghl-mcp-server.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure your GHL credentials
5. Build the project: `npm run build`

## Development Workflow

### Before Making Changes

1. Create a new branch: `git checkout -b feat/your-feature-name`
2. Make your changes
3. Run quality checks:
   ```bash
   npm run build
   npm run lint
   npm run format:check
   ```

### Code Style

- **No `any` types.** Use `Record<string, unknown>` for tool handler arguments.
- **Explicit types** on all exported functions and public APIs.
- **Immutable updates** — spread objects instead of mutating.
- **Error handling** — narrow `unknown` errors safely before using.

### Adding a New Tool

1. Open the relevant domain file in `src/tools/ghl/` (or create a new one).
2. Import `Tool` from `./types.js`.
3. Add a new entry following the existing pattern.
4. Import and merge the tool factory in `src/index.ts`.
5. Update the README tool catalog.
6. Run `npm run lint && npm run build` before committing.

## Commit Messages

Follow conventional commits:

```
feat: add new ghl tool for custom values
fix: handle 404 errors in workflow endpoints
docs: update README with new endpoints
refactor: extract shared types into types.ts
```

## Testing

Before submitting a PR:

- [ ] `npm run build` passes with no errors
- [ ] `npm run lint` passes with no errors
- [ ] `npm run format:check` passes
- [ ] You have tested the new/updated tool against the live GHL API

## Security

- **Never** commit `.env` files or real API tokens
- **Never** hardcode secrets, IDs, or URLs in source code
- Use environment variables for all configuration
- Report security vulnerabilities privately (see [SECURITY.md](SECURITY.md))

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Fill out the PR template (if applicable)
3. Link any related issues
4. Request review from maintainers

## Questions?

Open an issue for discussion before starting major work.

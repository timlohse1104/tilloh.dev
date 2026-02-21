# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**tilloh.dev** is a personal portfolio website built as a monorepo with NX workspace management. It features a SvelteKit static SPA frontend and a NestJS REST API backend with MongoDB persistence.

## Development Commands

### Root Level (Start Here)
```bash
npm install                 # Install all dependencies + setup git hooks
npm run dev                 # Start both frontend and backend in parallel
npm run dev-frontend        # Frontend only
npm run dev-backend         # Backend only
```

### Backend (`/backend`)
```bash
npm run dev                 # Start NestJS with pretty-printed logs
npm run build               # Build to dist/apps/tilloh-dev/
npm run lint                # ESLint across all projects
npm run start:db            # Start MongoDB Docker container
npm run build:db            # Pull and start MongoDB (first time)
npm run stop:db             # Stop MongoDB container
```

### Frontend (`/frontend`)
```bash
npm run dev                 # Vite dev server (localhost:5173)
npm run build               # Build static SPA to dist/
npm run check               # TypeScript type checking
npm run check:watch         # Type checking in watch mode
```

### Testing
```bash
cd backend && nx run-many -t test    # Jest tests
cd frontend && nx run-many -t test   # Vitest tests
```

## Architecture

```
/
├── frontend/              # SvelteKit SPA (Carbon Components, Socket.io client)
├── backend/               # NestJS API (Fastify, Mongoose, Socket.io)
│   ├── apps/tilloh-dev/   # Main application entry
│   └── libs/              # Feature modules (NX libraries)
├── docker-compose.yaml    # Docker orchestration
└── git-hooks/             # Pre/post-commit automation
```

### Backend Library Structure (`/backend/libs/`)
Feature modules follow NX library pattern with `@backend/` path aliases:
- `admin`, `memorandum`, `chat`, `todo`, `jokes`, `ocr`, `catch-em-all` - Feature modules
- `shared/common/types`, `shared/common/texts` - Shared types and strings
- `shared/provider/identifiers`, `shared/provider/keystore-persistence`, `shared/provider/ocr` - Shared services
- `shared/controller/health`, `shared/controller/metrics` - Common controllers
- `shared/util/` - Guards, filters, middleware

### Frontend Structure (`/frontend/src/`)
- `/routes/` - SvelteKit pages and routing
- `/lib/api/` - Backend API client calls
- `/lib/components/` - Reusable Svelte components
- `/lib/config/` - i18n translations (de, en locales)
- `/lib/types/` - TypeScript definitions
- `/lib/util/` - Helper functions

## Tech Stack

**Backend**: NestJS 11, Fastify, MongoDB/Mongoose, Socket.io, Swagger/OpenAPI, Pino logging, Prometheus metrics

**Frontend**: SvelteKit 2, Svelte 5, Carbon Components Svelte, Socket.io client, sveltekit-i18n

**Tooling**: NX monorepo, TypeScript 5.8, ESLint, Prettier (singleQuote: true), Jest/Vitest

## Coding Best Practices

### Frontend Organization
- **API calls**: Always place in `/frontend/src/lib/api/`
- **Type definitions**: Always place in `/frontend/src/lib/types/`
- **Functions**: Always define as lambda const (e.g., `const myFunction = () => { ... }`)

### Naming Conventions
- **Service functions** (business logic): Use descriptive names (e.g., `listIdentifiers`, `removeMessage`, `createFolder`)
- **MongoDB functions** (database layer): Use generic CRUD names (e.g., `findAll`, `findById`, `update`, `remove`)

### Svelte 5 Component Structure
Components using Svelte 5 runes should follow this order in the `<script>` section:

```svelte
<script lang="ts">
  // 1. IMPORTS
  import Component from './Component.svelte';
  import type { MyType } from '$lib/types';

  // 2. PROPS
  let { prop1, prop2 = 'default', bindableProp = $bindable() } = $props();

  // 3. CONST (non-reactive constants)
  const CONSTANT_VALUE = 42;

  // 4. STATE
  let myState = $state(initialValue);
  let anotherState = $state({ nested: 'value' });

  // 5. DERIVED
  const computed = $derived(myState * 2);
  const filtered = $derived(items.filter(item => item.active));

  // 6. EFFECTS
  $effect(() => {
    // Side effects here
  });

  // 7. LIFECYCLE
  onMount(() => {
    // Initialization logic
  });

  // 8. FUNCTIONS
  const handleClick = () => {
    // Handler logic
  };

  const processData = (data) => {
    // Processing logic
  };
</script>
```

**Note**: For components not yet migrated to Svelte 5, use the legacy structure:
1. `export let` (props)
2. `const` (constants)
3. `let` (non-reactive variables)
4. `$:` (reactive declarations)
5. `onMount` (lifecycle)
6. `const` functions

## Git Workflow

### Pre-commit Hook (Automatic)
Runs linting and tests on both frontend and backend. **Commits are rejected if any checks fail.**

### Post-commit Hook (Automatic)
Adds Gitmoji emoji based on commit message keywords:
- "fix" → 🐛, "add" → ✨, "remove" → 🔥, "refactor" → ♻️
- "docs"/"readme" → 📝, "config" → 🔧, "security" → 🔒
- "workflow"/"deployment" → 💚, "dependencies" → 📌
- Default → 🚀

### PR Requirements
**All PRs must update CHANGELOG.md** (enforced by GitHub Actions).

### CHANGELOG Updates (Required)
**Always update CHANGELOG.md** when implementing:
- New features or functionality
- Bug fixes
- Breaking changes
- Significant refactoring or improvements

**Format**: Add entries under `## [Unreleased]` section:
```markdown
### Added
- [module] Description of new feature.

### Changed
- [module] Description of changes.

### Fixed
- [module] Description of bug fix.
```

**Example modules**: `[memorandum]`, `[global]`, `[admin]`, `[backend]`, `[frontend]`

## Environment Setup

Backend requires `.env` file in `/backend/`:
```env
SERVER_ADDRESS="localhost"         # Use "0.0.0.0" for Docker
GLOBAL_PREFIX="v1"
PORT="61154"
MONGO_DB_URL="mongodb://localhost/tilloh-dev"
ADMIN_IDENTIFIER="<secret>"
OCR_SPACE_URL="https://api.ocr.space/parse/image"
OCR_SPACE_API_KEY="<api-key>"
```

## API

- **Base URL**: `http://localhost:61154/v1`
- **Swagger Docs**: Available at the base URL
- **WebSocket**: Chat module uses Socket.io for real-time messaging
- **Throttling**: 500 requests per 5 minutes

## Deployment

Uses Docker + GitHub Actions CI/CD to Uberspace hosting:
- Frontend: Static files served via Nginx (port 5173)
- Backend: Node.js process managed by supervisor (port 61154)
- MongoDB: Separate container (port 27017)

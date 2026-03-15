# Feature Name

> One-liner: What this feature does in one sentence.

## Architecture Pattern

2-3 sentences describing the data flow, persistence strategy, and any external APIs involved.

---

## Backend

**NX Library**: `backend/libs/<name>/`
**Path alias**: `@backend/<name>`

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/<name>.module.ts` | NestJS module definition |
| `src/lib/<name>.controller.ts` | HTTP endpoints |
| `src/lib/<name>.service.ts` | Business logic |
| `src/lib/<name>-mongodb.service.ts` | MongoDB layer (if applicable) |
| `src/lib/schema/<name>.schema.ts` | Mongoose schema |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/<resource>` | Public / Bearer | ... |
| POST | `/v1/<resource>` | Public / Bearer | ... |
| PUT | `/v1/<resource>/:id` | Public / Bearer | ... |
| DELETE | `/v1/<resource>/:id` | Bearer | ... |

### DTOs

- `InputDto` — ...
- `OutputDto` — ...

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VAR_NAME` | Yes | Description |

### Cron Jobs

| Schedule | Timezone | Method | Description |
|----------|----------|--------|-------------|
| `0 3 * * *` | Europe/Berlin | `methodName` | What it does |

---

## Frontend

**Route**: `/feature-name`
**Route files**: `frontend/src/routes/feature-name/`

### Components

| Component | Path | Purpose |
|-----------|------|---------|
| `+page.svelte` | `routes/feature-name/` | Main page |
| `+page.ts` | `routes/feature-name/` | Prerender config + toggle gate |

### API Client

`frontend/src/lib/api/<name>.api.ts`

| Function | Description |
|----------|-------------|
| `getResource()` | ... |
| `createResource()` | ... |

### Types

`frontend/src/lib/types/<name>.dto.ts`

| Type/Interface | Description |
|----------------|-------------|
| `ResourceDto` | ... |

### Stores

`frontend/src/lib/util/stores/store-<name>.ts`

| Store | localStorage key | Description |
|-------|-----------------|-------------|
| `featureStore` | `feature.key` | ... |

### i18n Key Prefix

Keys live under `feature.<sub-key>` in `frontend/src/lib/config/en.json` and `de.json`.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_FEATURE_NAME` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.featureName` |
| Route config | `applicationRoutes.featureName` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md) — toggle seed + frontend config
- [route-page-pattern.md](../shared/route-page-pattern.md) — `+page.ts` toggle gate
- [auth-guard.md](../shared/auth-guard.md) — `@Public()` decorator + `AdminGuard`
- [i18n.md](../shared/i18n.md) — translation system
- [stores.md](../shared/stores.md) — localStorage store pattern
- [application-routes.md](../shared/application-routes.md) — route registry

---

## Key Implementation Notes

- Note any gotchas, non-obvious design decisions, or patterns specific to this feature.
- Mention if this feature deviates from common patterns.

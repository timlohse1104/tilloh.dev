# Admin

> Admin dashboard with 5 sub-routes for managing identifiers, jokes, link presets, toggles, and activities.

## Architecture Pattern

The admin feature has a thin NestJS backend (single `POST /verify` endpoint) and a rich frontend with nested routes. The backend aggregates data from the `IdentifiersService`. Frontend admin pages call the respective resource APIs directly (identifiers, jokes, keystore).

---

## Backend

**NX Library**: `backend/libs/admin/`
**Path alias**: `@backend/admin`

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/admin.module.ts` | NestJS module |
| `src/lib/admin.controller.ts` | HTTP endpoints |
| `src/lib/admin.service.ts` | Verify admin/user identity |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/v1/admin/verify` | Public | Verify if ID is admin or registered user |

**Rate limit**: 300 requests per 5 minutes (stricter than default 500).

### `verifyAdmin` Logic

```ts
// type = 'admin' → compare against ADMIN_IDENTIFIER env var
// type = 'user'  → check if identifier exists in MongoDB
{ id: string, type: 'admin' | 'user' } → { isVerified: boolean }
```

---

## Frontend

**Route**: `/admin` + sub-routes
**Route files**: `frontend/src/routes/admin/`

### Sub-Routes

| Sub-route | Path | Toggle | Description |
|-----------|------|--------|-------------|
| Activities | `/admin` | `TOGGLE_ADMIN_ACTIVITIES` | Main dashboard / activity log |
| Identifiers | `/admin/identifiers` | `TOGGLE_ADMIN_IDENTIFIERS` | Manage user identifiers |
| Jokes | `/admin/jokes` | `TOGGLE_ADMIN_JOKES` | Manage jokes CRUD |
| Presets | `/admin/presets` | `TOGGLE_ADMIN_LINK_PRESETS` | Manage memorandum link presets |
| Toggles | `/admin/toggles` | — | Manage feature toggles via Keystore |

### Navigation

Sub-routes defined in `adminSubRoutes` in `frontend/src/lib/config/applications.ts`. Note: there is a typo in the code — key is `idenfiers` (missing 't') but it's not user-facing.

### API Clients Used

- `frontend/src/lib/api/admin.api.ts` — verify admin identity
- `frontend/src/lib/api/identifiers.api.ts` — identifiers management
- `frontend/src/lib/api/jokes.api.ts` — jokes management
- `frontend/src/lib/api/keystore.api.ts` — toggle management

### Types

`frontend/src/lib/types/admin.dto.ts`

### i18n Key Prefix

Keys under `admin.*` in translation files.

---

## Toggle Configuration

Admin routes use their own toggles (not a single nav toggle):

| Toggle key | Enum | Controls |
|------------|------|---------|
| `TOGGLE_ADMIN_DASHBOARD` | `TogglesEnum.adminDashboard` | Admin area visibility |
| `TOGGLE_ADMIN_ACTIVITIES` | `TogglesEnum.adminActivities` | Activities tab |
| `TOGGLE_ADMIN_IDENTIFIERS` | `TogglesEnum.adminIdentifiers` | Identifiers tab |
| `TOGGLE_ADMIN_JOKES` | `TogglesEnum.adminJokes` | Jokes tab |
| `TOGGLE_ADMIN_LINK_PRESETS` | `TogglesEnum.adminLinkPreset` | Presets tab |

Admin is accessible via `utilityRoutes.admin` (always shown, no global toggle gate).

---

## Shared Infrastructure Dependencies

- [auth-guard.md](../shared/auth-guard.md) — admin verification + ADMIN_IDENTIFIER
- [identifiers.md](../shared/identifiers.md) — user identity management
- [keystore-persistence.md](../shared/keystore-persistence.md) — toggle management UI
- [toggle-system.md](../shared/toggle-system.md)
- [application-routes.md](../shared/application-routes.md) — adminSubRoutes

---

## Key Implementation Notes

- The admin area is not toggle-gated at the route level (no `+page.ts` toggle redirect). Auth is enforced by the verify flow in the frontend.
- `ADMIN_IDENTIFIER` is the same secret used by `AdminGuard` for Bearer token auth on protected endpoints.

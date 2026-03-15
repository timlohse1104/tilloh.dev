# Catch-em-all

> Stub / placeholder — feature not yet implemented.

## Status

This is a placeholder route. The navigation toggle and route entry exist, but the feature has no meaningful functionality.

---

## Frontend

**Route**: `/catch-em-all`
**Route files**: `frontend/src/routes/catch-em-all/+page.svelte`, `+page.ts`

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_CATCH_EM_ALL` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.catchEmAll` |
| Route config | `applicationRoutes['catch-em-all']` |

---

## Backend

**NX Library**: `backend/libs/catch-em-all/` (exists in path aliases but may be minimal)
**Path alias**: `@backend/catch-em-all`

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)

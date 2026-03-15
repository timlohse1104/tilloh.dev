# About

> Static "About me" page — frontend-only, no backend.

## Architecture Pattern

Static page with personal information. No backend API calls, no stores.

---

## Frontend

**Route**: `/about`
**Route files**: `frontend/src/routes/about/+page.svelte`, `+page.ts`

### i18n Key Prefix

Keys under `about.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_ABOUT` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.about` |
| Route config | `applicationRoutes.about` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [i18n.md](../shared/i18n.md)

---

## Key Implementation Notes

- No backend library, no API client, no stores.
- Content is static and localized via i18n keys.

# Settings

> User settings page — frontend-only, no backend. Controls UI preferences stored in localStorage.

## Architecture Pattern

Settings are managed entirely in the frontend. No backend API calls. User preferences (locale, theme, etc.) are stored in Svelte stores backed by localStorage.

---

## Frontend

**Route**: `/settings`
**Route files**: `frontend/src/routes/settings/+page.svelte`

No `+page.ts` toggle gate — settings is always accessible (part of `utilityRoutes`).

### Key Functionality

- Language selection (de / en) via `setLocale()` from the i18n system
- Any other user preferences managed via localStorage stores

### i18n Key Prefix

Keys under `settings.*` in translation files.

---

## Toggle Configuration

Settings is in `utilityRoutes`, not `applicationRoutes` — no toggle gate, always visible.

---

## Shared Infrastructure Dependencies

- [stores.md](../shared/stores.md) — localStorage store pattern
- [i18n.md](../shared/i18n.md) — locale switching
- [application-routes.md](../shared/application-routes.md) — `utilityRoutes.settings`

---

## Key Implementation Notes

- No `+page.ts` needed — no toggle to check, no prerender restrictions specific to this route.
- Locale changes via `setLocale()` take effect immediately without page reload.

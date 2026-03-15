# Uno Sort

> Frontend-only UNO card sorting utility — no backend.

## Architecture Pattern

Pure frontend feature. Players input their UNO hand and the app sorts the cards by color and value. No persistence, no API calls.

---

## Frontend

**Route**: `/uno-sort`
**Route files**: `frontend/src/routes/uno-sort/+page.svelte`, `+page.ts`

### Types

`frontend/src/lib/types/uno-sort.ts` — UNO card type definitions
`frontend/src/lib/types/cards.ts` — generic card type definitions

### i18n Key Prefix

Keys under `unoSort.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_UNO_SORT` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.unoSort` |
| Route config | `applicationRoutes['uno-sort']` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)

---

## Key Implementation Notes

- No backend library — frontend-only feature.
- No API client or stores needed.

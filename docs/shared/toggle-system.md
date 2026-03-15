# Toggle System

> Feature flags stored in MongoDB via the Keystore, seeded on startup, consumed by both backend guards and frontend route gates.

## Overview

Toggles control which features appear in the navigation and are accessible. They are stored as Keystore entries under the `tilloh-toggles` identifier and seeded automatically on application boot.

---

## Backend: Seed Config

**File**: `backend/libs/shared/provider/keystore-persistence/src/lib/toggle-seed.config.ts`

```ts
export const TOGGLE_IDENTIFIER = 'tilloh-toggles';

export const TOGGLE_SEED_CONFIG: ToggleSeedEntry[] = [
  { key: 'TOGGLE_RANDOM_JOKE',       defaultValue: 'true' },
  { key: 'TOGGLE_NAV_MEMORANDUM',    defaultValue: 'true' },
  { key: 'TOGGLE_NAV_TODO',          defaultValue: 'true' },
  { key: 'TOGGLE_NAV_FOOD_SCAN',     defaultValue: 'true' },
  { key: 'TOGGLE_NAV_JOKES',         defaultValue: 'true' },
  { key: 'TOGGLE_NAV_CATCH_EM_ALL',  defaultValue: 'true' },
  { key: 'TOGGLE_NAV_UNO_SORT',      defaultValue: 'true' },
  { key: 'TOGGLE_NAV_ABOUT',         defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_DASHBOARD',   defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_ACTIVITIES',  defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_IDENTIFIERS', defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_JOKES',       defaultValue: 'true' },
  { key: 'TOGGLE_ADMIN_LINK_PRESETS',defaultValue: 'true' },
  { key: 'TOGGLE_NAV_HITSTAR',       defaultValue: 'true' },
];
```

**File**: `backend/libs/shared/provider/keystore-persistence/src/lib/toggle-seed.service.ts`

`ToggleSeedService` implements `OnApplicationBootstrap`. On startup it reads all existing toggle keys and only creates missing ones — idempotent seeding.

---

## Backend: Reading Toggles

The frontend reads toggles via the public Keystore endpoint:

```
GET /v1/keystore/tilloh-toggles/:toggleKey
```

Returns `{ identifier, key, value }` where `value` is `"true"` or `"false"`.

Admin users can change toggle values via:

```
PUT /v1/keystore/tilloh-toggles/:toggleKey
Body: { "value": "false" }
```

The admin UI at `/admin/toggles` provides a UI for this.

---

## Frontend: Toggle Enum

**File**: `frontend/src/lib/types/toggle.dto.ts`

```ts
export enum TogglesEnum {
  randomJoke      = 'TOGGLE_RANDOM_JOKE',
  memorandum      = 'TOGGLE_NAV_MEMORANDUM',
  todo            = 'TOGGLE_NAV_TODO',
  foodScan        = 'TOGGLE_NAV_FOOD_SCAN',
  jokes           = 'TOGGLE_NAV_JOKES',
  catchEmAll      = 'TOGGLE_NAV_CATCH_EM_ALL',
  unoSort         = 'TOGGLE_NAV_UNO_SORT',
  about           = 'TOGGLE_NAV_ABOUT',
  adminDashboard  = 'TOGGLE_ADMIN_DASHBOARD',
  adminActivities = 'TOGGLE_ADMIN_ACTIVITIES',
  adminIdentifiers= 'TOGGLE_ADMIN_IDENTIFIERS',
  adminJokes      = 'TOGGLE_ADMIN_JOKES',
  adminLinkPreset = 'TOGGLE_ADMIN_LINK_PRESETS',
  hitstar         = 'TOGGLE_NAV_HITSTAR',
}
```

---

## Frontend: Navigation Toggle

**File**: `frontend/src/lib/config/applications.ts`

`loadApplications()` calls `getToggleValue()` for each nav toggle, then sets the `applicationRoutes` writable store. The `activeApplicationRoutes` derived store filters to only routes with `toggle: true`.

---

## Adding a New Toggle

1. Add entry to `TOGGLE_SEED_CONFIG` in `toggle-seed.config.ts`
2. Add enum value to `TogglesEnum` in `frontend/src/lib/types/toggle.dto.ts`
3. Add `getToggleValue(TogglesEnum.newFeature)` call in `loadApplications()` in `applications.ts`
4. Add the route to `ApplicationRoutes` type and both `loadApplications()` return and `defaultApplicationRoutes`
5. Use it in `+page.ts` toggle gate (see [route-page-pattern.md](route-page-pattern.md))

---

## Related

- [keystore-persistence.md](keystore-persistence.md) — the underlying Keystore service
- [application-routes.md](application-routes.md) — route registry
- [route-page-pattern.md](route-page-pattern.md) — frontend toggle gate

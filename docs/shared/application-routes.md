# Application Routes

> Centralized route registry — `ApplicationRoutes` type + `loadApplications()` + reactive writable store.

## Overview

All navigable routes are defined in `applications.ts`. The file exports a typed route map, a function that hydrates toggles from the backend, and a reactive Svelte store. The navigation sidebar reads from the derived `activeApplicationRoutes` store.

---

## File

`frontend/src/lib/config/applications.ts`

---

## Types

```ts
export type ApplicationRoutes = {
  home: Route;
  memorandum: Route;
  jokes: Route;
  todo: Route;
  'food-scan': Route;
  'catch-em-all': Route;
  'uno-sort': Route;
  hitstar: Route;
  about: Route;
};
```

`Route` type is defined in `frontend/src/lib/types/route.ts`:

```ts
export type Route = {
  id: string;
  name: { en: string; de: string };
  path: string;
  icon: ComponentType;
  toggle: boolean;
};
```

---

## Stores

```ts
// Writable store — starts with all toggles = false (default)
export const applicationRoutes = writable<ApplicationRoutes>(defaultApplicationRoutes);

// Derived store — only routes where toggle is true
export const activeApplicationRoutes = derived(applicationRoutes,
  ($routes) => Object.values($routes).filter((route) => route.toggle)
);
```

On module load, `loadApplications()` fires and updates the store with actual toggle values from the backend.

---

## Utility Routes (not in ApplicationRoutes)

```ts
export const utilityRoutes = {
  settings: { path: '/settings', ... },
  admin: { path: '/admin', ... },
};
```

Always shown, no toggle gate.

---

## Admin Sub-Routes

```ts
export const adminSubRoutes = {
  activities: { path: '/admin', ... },
  idenfiers:  { path: '/admin/identifiers', ... },   // typo in code: "idenfiers"
  jokes:      { path: '/admin/jokes', ... },
  presets:    { path: '/admin/presets', ... },
  toggles:    { path: '/admin/toggles', ... },
};
```

---

## Adding a New Route

1. Add to `ApplicationRoutes` type
2. Add `getToggleValue(TogglesEnum.newFeature)` in `loadApplications()`
3. Add entry in `loadApplications()` return object
4. Add entry in `defaultApplicationRoutes` (with `toggle: false`)
5. Add toggle key to `TOGGLE_SEED_CONFIG` (see [toggle-system.md](toggle-system.md))
6. Add `TogglesEnum.newFeature` enum entry (see [toggle-system.md](toggle-system.md))

---

## Related

- [toggle-system.md](toggle-system.md) — toggle lifecycle
- [route-page-pattern.md](route-page-pattern.md) — `+page.ts` toggle gate per route

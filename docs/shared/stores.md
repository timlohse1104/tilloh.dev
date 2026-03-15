# Svelte Stores (localStorage Pattern)

> Writable stores that automatically sync to `localStorage` for persistence across sessions.

## Pattern

The standard pattern for persistent stores (used by Hitstar, settings, etc.):

```ts
// frontend/src/lib/util/stores/store-<feature>.ts
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'feature.subkey';

const getInitialValue = (): MyType | null => {
  if (!browser) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as MyType;
  } catch {
    return null;
  }
};

export const myStore = writable<MyType | null>(getInitialValue());

// Sync store changes → localStorage
if (browser) {
  myStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    }
  });
}
```

---

## Key Principles

1. **Guard with `browser`**: `$app/environment`'s `browser` flag prevents `localStorage` access during SSR.
2. **Null = deleted**: Setting the store to `null` removes the key from localStorage.
3. **JSON serialization**: Objects are stored as JSON strings.
4. **Subscribe for sync**: The `subscribe` call in the `if (browser)` block wires store changes to storage.

---

## Existing Stores

| Store file | Keys | Used by |
|------------|------|---------|
| `store-hitstar.ts` | `hitstar.classic.bestRound`, `hitstar.classic.gameState`, `hitstar.range.bestRound`, `hitstar.range.gameState` | Hitstar game |
| `stores-global.ts` | Various global state | App-wide (e.g. `celebrate()`) |

---

## Migration Pattern

When renaming localStorage keys, check for old keys on `browser` init:

```ts
if (browser) {
  const oldValue = localStorage.getItem('old.key');
  if (oldValue) {
    localStorage.setItem('new.key', oldValue);
    localStorage.removeItem('old.key');
  }
}
```

This pattern is used in `store-hitstar.ts` to migrate from `hitstar.bestRound` → `hitstar.classic.bestRound`.

---

## Global Utilities

**File**: `frontend/src/lib/util/stores/stores-global.ts`

Exports `celebrate()` — triggers a confetti animation (used by Hitstar, potentially others).

---

## Related

- [route-page-pattern.md](route-page-pattern.md) — Svelte component structure
- [i18n.md](i18n.md) — locale store also uses this writable pattern

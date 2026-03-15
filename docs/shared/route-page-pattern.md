# Route Page Pattern

> Every feature route uses a two-file pattern: `+page.ts` for prerender + toggle gate, `+page.svelte` for the UI.

## File Pair

```
frontend/src/routes/<feature>/
├── +page.ts      # prerender:true + toggle redirect
└── +page.svelte  # main page component (Svelte 5 runes)
```

---

## `+page.ts` — Prerender + Toggle Gate

```ts
// frontend/src/routes/jokes/+page.ts
import { TogglesEnum } from '$lib/types/toggle.dto';
import { getToggleValue } from '$lib/util/toggle';
import { redirect } from '@sveltejs/kit';

export const prerender = true;

export const load = async () => {
  const jokeToggle = await getToggleValue(TogglesEnum.jokes);
  if (!jokeToggle) {
    throw redirect(307, '/');
  }
};
```

**Purpose**: If the feature's toggle is `false` in the backend keystore, redirect to `/` so the page is never accessible.

---

## `+page.svelte` — Svelte 5 Runes Component

Follows the Svelte 5 component order from `CLAUDE.md`:

```svelte
<script lang="ts">
  // 1. IMPORTS
  // 2. PROPS (if any)
  // 3. CONST
  // 4. STATE
  // 5. DERIVED
  // 6. EFFECTS
  // 7. LIFECYCLE (onMount)
  // 8. FUNCTIONS
</script>

<!-- template -->
```

---

## Toggle Utility

**File**: `frontend/src/lib/util/toggle.ts`

```ts
import { getKeystoreEntry } from '$lib/api/keystore.api';

export const getToggleValue = async (toggleKey: string): Promise<boolean> => {
  try {
    const entry = await getKeystoreEntry('tilloh-toggles', toggleKey);
    return entry?.value === 'true';
  } catch {
    return false;
  }
};
```

---

## Key Notes

- `prerender = true` enables SvelteKit static generation for that route.
- The toggle check happens at load time; if `false`, the user is silently redirected to home.
- The `TogglesEnum` maps feature names to their backend keystore keys (see `frontend/src/lib/types/toggle.dto.ts`).
- See [toggle-system.md](toggle-system.md) for the full toggle lifecycle (seed → storage → frontend).

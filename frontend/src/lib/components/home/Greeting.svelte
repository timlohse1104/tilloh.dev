<script lang="ts">
  // 1. IMPORTS
  import { getIdentifier } from '$lib/api/identifiers.api';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { t } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 3. CONST
  const VARIANTS = 3;

  // 4. STATE
  let identifier = $state<IdentifierDto | null>(null);
  let nameLoaded = $state(false);

  // 5. DERIVED
  const timeOfDay = $derived.by(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 22) return 'Evening';
    return 'Night';
  });

  const greetingVariant = Math.floor(Math.random() * VARIANTS);

  const greetingHtml = $derived.by(() => {
    if (!nameLoaded) return '';

    const hasName = !!identifier?.name;
    const prefix = hasName ? '' : 'Anon';
    const key =
      `page.home.greeting${prefix}${timeOfDay}${greetingVariant}` as Parameters<
        typeof $t
      >[0];

    if (!hasName) return $t(key);

    const escapedName = identifier!.name
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const highlighted = `<span class="username">${escapedName}</span>`;
    return $t(key, { username: highlighted });
  });

  // 7. LIFECYCLE
  onMount(async () => {
    if ($identifierStore) {
      try {
        const result = await getIdentifier($identifierStore);
        if (result?.name) {
          identifier = result;
        }
      } catch {
        // fall through to anonymous greeting
      }
    }
    nameLoaded = true;
  });
</script>

{#if nameLoaded}
  <div class="greeting">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p class="greeting-text">{@html greetingHtml}</p>
  </div>
{/if}

<style lang="scss">
  .greeting {
    text-align: center;
    padding: 1rem 0;
  }

  .greeting-text {
    font-size: 1.5rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;

    :global(.username) {
      font-weight: 600;
      color: var(--color_bg_light_0);
    }
  }
</style>

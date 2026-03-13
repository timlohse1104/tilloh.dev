<script lang="ts">
  // 1. IMPORTS
  import Hitstar from '$lib/components/hitstar/Hitstar.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 4. STATE
  let locale = $state($languageStore);

  // 5. DERIVED
  const hitstarRoute = $derived($applicationRoutes.hitstar);

  // 7. LIFECYCLE
  onMount(async () => {
    await setLocale($languageStore);
  });

  // 8. FUNCTIONS
  const updateLocale = () => {
    locale = $languageStore;
  };

  $effect(() => {
    updateLocale();
  });
</script>

<svelte:head>
  <title>{hitstarRoute.name[locale]}</title>
  <meta name={hitstarRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if hitstarRoute.toggle}
  <Hitstar />
{:else}
  <ToggledApplicationInfo />
{/if}

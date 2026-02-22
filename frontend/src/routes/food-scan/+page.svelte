<script lang="ts">
  // 1. IMPORTS
  import FoodScan from '$lib/components/food-scan/FoodScan.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 2. CONST (non-reactive constants)
  const { 'food-scan': foodScanRoute } = applicationRoutes;

  // 4. STATE
  let locale = $state($languageStore);

  // 7. LIFECYCLE
  onMount(async () => {
    await setLocale($languageStore);
  });

  // Update locale when language store changes
  $effect(() => {
    locale = $languageStore;
  });
</script>

<svelte:head>
  <title>{foodScanRoute.name[locale]}</title>
  <meta name={foodScanRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if foodScanRoute.toggle}
  <FoodScan />
{:else}
  <ToggledApplicationInfo />
{/if}

<script lang="ts">
  import FoodScan from '$lib/components/food-scan/FoodScan.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { 'food-scan': foodScanRoute } = applicationRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
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

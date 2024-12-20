<script lang="ts">
  import FoodScan from '$lib/components/food-scan/FoodScan.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { getlocale } from '$lib/util/translations';

  const { 'food-scan': foodScanRoute } = applicationRoutes;
  const locale = getlocale();
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

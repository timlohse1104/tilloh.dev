<script lang="ts">
  import FlappyPikachu from '$lib/components/flappy-pikachu/FlappyPikachu.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { 'flappy-pikachu': flappyPikachuRoute } = applicationRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{flappyPikachuRoute.name[locale]}</title>
  <meta name={flappyPikachuRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if flappyPikachuRoute.toggle}
  <FlappyPikachu />
{:else}
  <ToggledApplicationInfo />
{/if}

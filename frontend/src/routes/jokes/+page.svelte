<script lang="ts">
  // 1. IMPORTS
  import Jokes from '$lib/components/jokes/Jokes.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 2. CONST (non-reactive constants)
  const { jokes: jokesRoute } = applicationRoutes;

  // 4. STATE
  let locale = $state($languageStore);

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
  <title>{jokesRoute.name[locale]}</title>
  <meta name={jokesRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if jokesRoute.toggle}
  <Jokes />
{:else}
  <ToggledApplicationInfo />
{/if}

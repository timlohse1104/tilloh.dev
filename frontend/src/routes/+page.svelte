<script lang="ts">
  // 1. IMPORTS
  import JokeOfTheDay from '$lib/components/home/JokeOfTheDay.svelte';
  import Navigation from '$lib/components/shared/Navigation.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { TogglesEnum } from '$lib/types/toggle.dto';
  import { languageStore } from '$lib/util/stores/store-language';
  import { getToggleValue } from '$lib/util/toggle';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 5. DERIVED
  const homeRoute = $derived($applicationRoutes.home);

  // 4. STATE
  let locale = $state($languageStore);
  let randomJokeToggle = $state(true);

  // 7. LIFECYCLE
  onMount(async () => {
    await setLocale($languageStore);
    randomJokeToggle = await getToggleValue(TogglesEnum.randomJoke);
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
  <title>{homeRoute.name[locale]}</title>
  <meta name={homeRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<section>
  <Navigation routes={Object.values($applicationRoutes)} />

  {#if randomJokeToggle}
    <JokeOfTheDay />
  {/if}
</section>

<style lang="scss">
  @use '../lib/styles/variables.scss' as *;

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 90vw;
    margin: var(--default_padding) auto;
    flex: 0.2;
  }
</style>

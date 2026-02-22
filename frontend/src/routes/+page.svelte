<script lang="ts">
  // 1. IMPORTS
  import JokeOfTheDay from '$lib/components/home/JokeOfTheDay.svelte';
  import SearchBar from '$lib/components/home/SearchBar.svelte';
  import Navigation from '$lib/components/shared/Navigation.svelte';
  import { TogglesEnum } from '$lib/types/toggle.dto';
  import { languageStore } from '$lib/util/stores/store-language';
  import { getToggleValue } from '$lib/util/toggle';
  import { setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Settings from 'carbon-icons-svelte/lib/Settings.svelte';
  import { onMount } from 'svelte';
  import { applicationRoutes, utilityRoutes } from '../lib/config/applications';

  // 2. CONST (non-reactive constants)
  const { home: homeRoute } = applicationRoutes;
  const { settings } = utilityRoutes;

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

<section class="mt1">
  <Navigation routes={Object.values(applicationRoutes)} />
  <SearchBar />

  <div class="mt2">
    <Button
      kind="tertiary"
      iconDescription={$t('page.shared.button.settings')}
      href={settings.path}
      icon={Settings}
    >
      {settings.name[locale]}
    </Button>
  </div>

  {#if randomJokeToggle}
    <JokeOfTheDay customClass="mt2" />
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.2;
  }
</style>

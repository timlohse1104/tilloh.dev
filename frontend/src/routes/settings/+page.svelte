<script lang="ts">
  // 1. IMPORTS
  import OnlinePersistenceCheck from '$lib/components/settings/OnlinePersistenceCheck.svelte';
  import SettingsDashboard from '$lib/components/settings/SettingsDashboard.svelte';
  import { utilityRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  // 2. CONST (non-reactive constants)
  const { settings: settingsRoute } = utilityRoutes;

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
  <title>{settingsRoute.name[locale]}</title>
  <meta name={settingsRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<section>
  <SettingsDashboard />
  <OnlinePersistenceCheck />
</section>

<style lang="scss">
  section {
    margin: 0;
    height: 88vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

<script lang="ts">
  import OnlinePersistenceCheck from '$lib/components/settings/OnlinePersistenceCheck.svelte';
  import SettingsDashboard from '$lib/components/settings/SettingsDashboard.svelte';
  import { utilityRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { settings: settingsRoute } = utilityRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
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

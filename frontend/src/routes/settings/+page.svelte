<script lang="ts">
  import LanguagueSwitch from '$lib/components/settings/LanguagueSwitch.svelte';
  import OnlinePersistenceCheck from '$lib/components/settings/OnlinePersistenceCheck.svelte';
  import { utilityRoutes } from '$lib/config/applications';
  import { locale } from '$lib/util/translations';

  const { settings: settingsRoute } = utilityRoutes;
</script>

<svelte:head>
  <title>{settingsRoute.name[$locale]}</title>
  <meta name={settingsRoute.name[$locale]} content="tilloh.dev" />
</svelte:head>

<section>
  <LanguagueSwitch />
  <OnlinePersistenceCheck />
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0;
    color: var(--light80);
    height: 88vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

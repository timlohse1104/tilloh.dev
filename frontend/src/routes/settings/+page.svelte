<script lang="ts">
  import OnlinePersistenceCheck from '$lib/components/settings/OnlinePersistenceCheck.svelte';
  import { utilityRoutes } from '$lib/config/applications';

  const { settings: settingsRoute } = utilityRoutes;
  const locale = navigator.language || 'de';
</script>

<svelte:head>
  <title>{settingsRoute.name[locale]}</title>
  <meta name={settingsRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<section>
  <OnlinePersistenceCheck />
</section>

<style lang="scss">
  section {
    margin: 0;
    color: var(--light80);
    height: 88vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

<script lang="ts">
  import { routes } from '../../lib/config/applications';
  import OnlinePersistenceCheck from './OnlinePersistenceCheck.svelte';

  const { settings: settingsRoute } = routes;
</script>

<svelte:head>
  <title>{settingsRoute.name}</title>
  <meta name={settingsRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <OnlinePersistenceCheck />
</section>

<style lang="scss">
</style>

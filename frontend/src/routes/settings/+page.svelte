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
  @import '../../lib/styles/global.scss';

  section {
    margin: 0;
    color: var(--light80);
    height: 88vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

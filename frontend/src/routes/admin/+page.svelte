<script lang="ts">
  import { utilityRoutes } from '$lib/config/applications';

  const { admin: adminRoute } = utilityRoutes;
</script>

<svelte:head>
  <title>{adminRoute.name}</title>
  <meta name={adminRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <div class="main-content">
    <h1>Admin</h1>
  </div>
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;

    .main-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-top: 2rem;
    }
  }
</style>

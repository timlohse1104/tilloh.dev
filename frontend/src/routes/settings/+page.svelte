<script lang="ts">
  import OnlinePersistenceCheck from './OnlinePersistenceCheck.svelte';
</script>

<svelte:head>
  <title>Einstellungen</title>
  <meta name="settings" content="Einstellungen" />
</svelte:head>

<section>
  <OnlinePersistenceCheck />
  <hr />
</section>

<style lang="scss">
  hr {
    width: 75%;
    margin-top: 4rem;
  }
</style>

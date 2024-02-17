<script lang="ts">
  import Navigation from './Navigation.svelte';
  import SearchBar from './SearchBar.svelte';
</script>

<svelte:head>
  <title>Home</title>
  <meta name="Home" content="tilloh.dev" />
</svelte:head>

<section>
  <Navigation />
  <SearchBar />
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;
  }
</style>

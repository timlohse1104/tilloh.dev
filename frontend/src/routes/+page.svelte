<script lang="ts">
  import Button, { Icon, Label } from '@smui/button';
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

  <div>
    <Button
      color="secondary"
      variant="outlined"
      href="/settings"
      style="text-decoration: none;"
    >
      <Icon class="material-icons">settings</Icon>
      <Label>Einstellungen</Label>
    </Button>
  </div>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;

    div {
      margin-top: 3rem;
    }
  }
</style>

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

  :global(::-webkit-scrollbar) {
    width: 12px;
    background-color: var(--darkgrey80);
  }

  :global(::-webkit-scrollbar-track) {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: var(--darkgrey80);
  }

  :global(::-webkit-scrollbar-thumb) {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--color-theme-2-50);

    &:hover {
      background-color: var(--color-theme-2);
    }
  }
</style>

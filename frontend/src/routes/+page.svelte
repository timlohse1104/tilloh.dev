<script lang="ts">
  import Button, { Icon, Label } from '@smui/button';
  import { routes } from '../lib/config/applications';
  import Navigation from './_home/Navigation.svelte';
  import SearchBar from './_home/SearchBar.svelte';

  const { home: homeRoute, settings } = routes;
</script>

<svelte:head>
  <title>{homeRoute.name}</title>
  <meta name={homeRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <Navigation />
  <SearchBar />

  <div>
    <Button
      color="secondary"
      variant="outlined"
      href={settings.path}
      style="text-decoration: none;"
    >
      <Icon class="material-icons">{settings.icon}</Icon>
      <Label>{settings.name}</Label>
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

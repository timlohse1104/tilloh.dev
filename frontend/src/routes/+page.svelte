<script lang="ts">
  import { getToggleValue } from '$lib/util/toggle';
  import Button, { Icon, Label } from '@smui/button';
  import { onMount } from 'svelte';
  import { applicationRoutes, utilityRoutes } from '../lib/config/applications';
  import JokeOfTheDay from './_home/JokeOfTheDay.svelte';
  import Navigation from './_home/Navigation.svelte';
  import SearchBar from './_home/SearchBar.svelte';

  const { home: homeRoute } = applicationRoutes;
  const { settings } = utilityRoutes;
  let randomJokeToggle = true;

  onMount(async () => {
    randomJokeToggle = await getToggleValue('TOGGLE_RANDOM_JOKE');
  });
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

  {#if randomJokeToggle}
    <JokeOfTheDay />
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;

    div {
      margin-top: 2rem;
    }
  }
</style>

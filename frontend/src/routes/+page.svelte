<script lang="ts">
  import JokeOfTheDay from '$lib/components/home/JokeOfTheDay.svelte';
  import Navigation from '$lib/components/home/Navigation.svelte';
  import SearchBar from '$lib/components/home/SearchBar.svelte';
  import { TogglesEnum } from '$lib/types/toggle.dto';
  import { getToggleValue } from '$lib/util/toggle';
  import Button, { Icon, Label } from '@smui/button';
  import { onMount } from 'svelte';
  import { applicationRoutes, utilityRoutes } from '../lib/config/applications';

  const { home: homeRoute } = applicationRoutes;
  const { settings } = utilityRoutes;
  const locale = navigator.language || 'de';
  let randomJokeToggle = true;

  onMount(async () => {
    randomJokeToggle = await getToggleValue(TogglesEnum.randomJoke);
  });
</script>

<svelte:head>
  <title>{homeRoute.name[locale]}</title>
  <meta name={homeRoute.name[locale]} content="tilloh.dev" />
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
    flex: 0.2;

    div {
      margin-top: 2rem;
    }
  }
</style>

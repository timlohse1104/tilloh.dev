<script lang="ts">
  import JokeOfTheDay from '$lib/components/home/JokeOfTheDay.svelte';
  import Navigation from '$lib/components/home/Navigation.svelte';
  import SearchBar from '$lib/components/home/SearchBar.svelte';
  import { TogglesEnum } from '$lib/types/toggle.dto';
  import { languageStore } from '$lib/util/stores/store-language';
  import { getToggleValue } from '$lib/util/toggle';
  import { setLocale } from '$lib/util/translations';
  import Button, { Icon, Label } from '@smui/button';
  import { onMount } from 'svelte';
  import { applicationRoutes, utilityRoutes } from '../lib/config/applications';

  setLocale($languageStore);

  const { home: homeRoute } = applicationRoutes;
  const { settings } = utilityRoutes;

  let randomJokeToggle = true;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
    randomJokeToggle = await getToggleValue(TogglesEnum.randomJoke);
  });
</script>

<svelte:head>
  <title>{homeRoute.name[locale]}</title>
  <meta name={homeRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<section>
  <Navigation routes={applicationRoutes} />
  <SearchBar />

  <div>
    <Button
      color="secondary"
      variant="outlined"
      href={settings.path}
      style="text-decoration: none;"
    >
      <Icon class="material-icons">{settings.icon}</Icon>
      <Label>{settings.name[locale]}</Label>
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
      margin-top: 1rem;
    }
  }
</style>

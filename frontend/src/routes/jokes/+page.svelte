<script lang="ts">
  import Jokes from '$lib/components/jokes/Jokes.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/languageStore';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { jokes: jokesRoute } = applicationRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{jokesRoute.name[locale]}</title>
  <meta name={jokesRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if jokesRoute.toggle}
  <Jokes />
{:else}
  <ToggledApplicationInfo />
{/if}

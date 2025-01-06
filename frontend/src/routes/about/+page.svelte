<script lang="ts">
  import AboutInfo from '$lib/components/about/AboutInfo.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { about: aboutRoute } = applicationRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{aboutRoute.name[locale]}</title>
  <meta name={aboutRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if aboutRoute.toggle}
  <AboutInfo />
{:else}
  <ToggledApplicationInfo />
{/if}

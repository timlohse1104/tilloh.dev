<script lang="ts">
  import {
    default as AboutInfo,
    default as ToggledApplicationInfo,
  } from '$lib/components/about/AboutInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  const { about: aboutRoute } = applicationRoutes;
  const locale = navigator.language || 'de';
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

<script lang="ts">
  import {
    default as AboutInfo,
    default as ToggledApplicationInfo,
  } from '$lib/components/about/AboutInfo.svelte';
  import { applicationRoutes } from '../../lib/config/applications';
  const { about: aboutRoute } = applicationRoutes;
</script>

<svelte:head>
  <title>{aboutRoute.name}</title>
  <meta name={aboutRoute.name} content="tilloh.dev" />
</svelte:head>

{#if aboutRoute.toggle}
  <AboutInfo />
{:else}
  <ToggledApplicationInfo />
{/if}

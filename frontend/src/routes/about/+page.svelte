<script lang="ts">
  import AboutInfo from '$lib/components/about/AboutInfo.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { getlocale } from '$lib/util/translations';
  const { about: aboutRoute } = applicationRoutes;
  const locale = getlocale();
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

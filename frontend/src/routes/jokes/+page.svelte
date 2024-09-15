<script lang="ts">
  import Jokes from '$lib/components/jokes/Jokes.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { getlocale } from '$lib/util/translations';
  const { jokes: jokesRoute } = applicationRoutes;
  const locale = getlocale();
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

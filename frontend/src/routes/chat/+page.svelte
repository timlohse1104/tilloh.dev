<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { setLocale } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { chat: chatRoute } = applicationRoutes;

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{chatRoute.name[locale]}</title>
  <meta name={chatRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<ToggledApplicationInfo />

<style lang="scss">
</style>

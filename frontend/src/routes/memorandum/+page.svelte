<script lang="ts">
  import ContentArea from '$lib/components/memorandum/ContentArea.svelte';
  import FolderOverlay from '$lib/components/memorandum/FolderOverlay.svelte';
  import LinkOverlay from '$lib/components/memorandum/LinkOverlay.svelte';
  import PresetOverlay from '$lib/components/memorandum/PresetOverlay.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
    presetOverlayOptionsStore,
    refreshPresetStore,
  } from '$lib/util/memorandum/stores';
  import { onMount } from 'svelte';

  const { memorandum: memorandumRoute } = applicationRoutes;

  onMount(() => {
    refreshPresetStore();
  });

  const showPresetOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = true;
  };
</script>

<svelte:head>
  <title>{memorandumRoute.name}</title>
  <meta name={memorandumRoute.name} content="tilloh.dev" />
</svelte:head>

{#if memorandumRoute.toggle}
  {#if $folderOrderFolder === 'flexible'}
    {#key $localPresetStore}
      <ContentArea on:showPresetOverlay={showPresetOverlay} />
    {/key}
  {:else}
    <ContentArea />
  {/if}

  {#if $folderOverlayOptionsStore.showOverlay}
    <FolderOverlay folderName={$folderOverlayOptionsStore.currentFolderName} />
  {/if}

  {#if $linkOverlayOptionsStore.showOverlay}
    <LinkOverlay
      newLinkName={$linkOverlayOptionsStore.currLinkName}
      newLinkUrl={$linkOverlayOptionsStore.currLinkUrl}
    />
  {/if}

  {#if $presetOverlayOptionsStore.showOverlay}
    <PresetOverlay />
  {/if}
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  @import '../../lib/styles/variables.scss';
</style>

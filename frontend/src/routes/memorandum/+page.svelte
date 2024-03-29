<script lang="ts">
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { onMount } from 'svelte';
  import BoxArea from './content/FolderArea.svelte';
  import FolderOverlay from './content/FolderOverlay.svelte';
  import LinkOverlay from './content/LinkOverlay.svelte';
  import PresetOverlay from './content/PresetOverlay.svelte';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
    presetOverlayOptionsStore,
    refreshPresetStore,
  } from './util/stores';
  import type { Order } from './util/types';

  const orders: Order[] = [
    {
      id: 'fixed',
      name: 'Feste Ordnergröße',
      icon: 'border_all',
    },
    {
      id: 'flexible',
      name: 'Anpassbare Ordnergröße',
      icon: 'expand',
    },
  ];
  let order = $folderOrderFolder
    ? orders.find((o) => o.id === $folderOrderFolder)
    : orders[0];

  function showPresetOverlay() {
    $presetOverlayOptionsStore.showOverlay = true;
  }

  function updateOrder(order: Order) {
    $folderOrderFolder = order.id;
  }

  onMount(() => {
    refreshPresetStore();
  });
</script>

<svelte:head>
  <title>Memorandum</title>
  <meta name="description" content="Memorandum" />
</svelte:head>

<div class="menuLine">
  <SegmentedButton
    segments={orders}
    let:segment
    singleSelect
    bind:selected={order}
  >
    <Segment {segment}>
      <Icon class="material-icons" on:click={() => updateOrder(segment)}
        >{segment.icon}</Icon
      >
    </Segment>
  </SegmentedButton>

  <IconButton
    style="color: white"
    on:click={showPresetOverlay}
    class="material-icons">swap_vert</IconButton
  >

  <div class="infoButtons">
    <Wrapper>
      <IconButton style="color: white" size="mini">
        <Icon class="material-icons">info</Icon>
      </IconButton>
      <Tooltip xPos="end" yPos="above"
        >Willst du was bearbeiten? Versuchs doch mal mit einem Doppelklick.</Tooltip
      >
    </Wrapper>
  </div>
</div>

<div class="boxArea">
  {#if $folderOrderFolder === 'flexible'}
    {#key $localPresetStore}
      <BoxArea />
    {/key}
  {:else}
    <BoxArea />
  {/if}
</div>

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

<style lang="scss">
  @import '../../lib/styles/global.scss';

  .menuLine {
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: calc(var(--default-padding) / 2);
    gap: calc(var(--default-padding) / 2);
  }

  .infoButtons {
    display: flex;
    flex-grow: 10;
    justify-content: end;
  }

  .boxArea {
    height: 85vh;
    display: grid;
    grid-template-columns: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    scroll-behavior: unset;
    margin-top: 1rem;
    grid-auto-flow: dense;

    @media #{$tablet} {
      height: 82vh;
    }

    @media #{$phone} {
      height: 80vh;
    }
  }
</style>

<script lang="ts">
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import BoxArea from './content/BoxArea.svelte';
  import LinkOverlay from './content/LinkOverlay.svelte';
  import PresetOverlay from './content/PresetOverlay.svelte';
  import {
    folderOrder,
    linkOverlayOptions,
    localPreset,
    presetOverlayOptions,
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
  let order = $folderOrder
    ? orders.find((o) => o.id === $folderOrder)
    : orders[0];

  function showPresetOverlay() {
    $presetOverlayOptions.showOverlay = true;
  }

  function updateOrder(order: Order) {
    $folderOrder = order.id;
  }
</script>

<svelte:head>
  <title>Memorandum</title>
  <meta name="description" content="Memorandum" />
</svelte:head>

<div class="menuLine">
  <IconButton
    style="color: white"
    on:click={showPresetOverlay}
    class="material-icons">build</IconButton
  >

  <SegmentedButton
    segments={orders}
    let:segment
    singleSelect
    bind:selected={order}
  >
    <Segment {segment}>
      <IconButton class="material-icons" on:click={() => updateOrder(segment)}>
        {segment.icon}
      </IconButton>
    </Segment>
  </SegmentedButton>

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
  {#if $folderOrder === 'flexible'}
    {#key $localPreset}
      <BoxArea />
    {/key}
  {:else}
    <BoxArea />
  {/if}
</div>

{#if $linkOverlayOptions.showOverlay}
  <LinkOverlay
    newLinkName={$linkOverlayOptions.currLinkName}
    newLinkUrl={$linkOverlayOptions.currLinkUrl}
  />
{/if}

{#if $presetOverlayOptions.showOverlay}
  <PresetOverlay />
{/if}

<style lang="scss">
  @import '../../lib/styles/global.scss';

  .menuLine {
    display: flex;
    align-items: center;
    justify-content: start;
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

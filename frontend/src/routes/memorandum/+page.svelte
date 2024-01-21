<script lang="ts">
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import BoxArea from './content/BoxArea.svelte';
  import LinkOverlay from './content/LinkOverlay.svelte';
  import PresetOverlay from './content/PresetOverlay.svelte';
  import { linkOverlayOptions, presetOverlayOptions } from './util/stores.js';

  function showPresetOverlay() {
    $presetOverlayOptions.showOverlay = true;
  }
</script>

<svelte:head>
  <title>Memorandum</title>
  <meta name="description" content="Memorandum" />
</svelte:head>

<div class="menuLine">
  <IconButton on:click={showPresetOverlay} class="material-icons"
    >build</IconButton
  >

  <Wrapper>
    <IconButton size="mini">
      <Icon class="material-icons">info</Icon>
    </IconButton>
    <Tooltip xPos="end" yPos="above"
      >Willst du was bearbeiten? Versuchs doch mal mit einem Doppelklick.</Tooltip
    >
  </Wrapper>
</div>

<div class="boxArea">
  <BoxArea />
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
  @import '$lib/styles/_variables';

  .menuLine {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .boxArea {
    height: 85vh;
    display: grid;
    grid-template-columns: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    scroll-behavior: unset;

    @media #{$tablet} {
      height: 82vh;
    }

    @media #{$phone} {
      height: 80vh;
    }
  }
</style>

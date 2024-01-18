<script lang="ts">
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import BoxArea from './content/BoxArea.svelte';
  import LinkOverlay from './content/LinkOverlay.svelte';
  import { linkOverlayOptions } from './util/stores.js';
</script>

<svelte:head>
  <title>Memorandum</title>
  <meta name="description" content="Memorandum" />
</svelte:head>

<div class="editTooltip">
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

<style lang="scss">
  @import '$lib/styles/_variables';

  .editTooltip {
    position: absolute;
    left: 0.25rem;
    top: 5.5rem;
  }

  .boxArea {
    height: 75vh;
    display: grid;
    grid-template-columns: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    scroll-behavior: unset;
  }
</style>

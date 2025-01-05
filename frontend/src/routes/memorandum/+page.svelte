<script lang="ts">
  import BoxArea from '$lib/components/memorandum/FolderArea.svelte';
  import FolderOverlay from '$lib/components/memorandum/FolderOverlay.svelte';
  import LinkOverlay from '$lib/components/memorandum/LinkOverlay.svelte';
  import PresetOverlay from '$lib/components/memorandum/PresetOverlay.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import type { Order } from '$lib/types/memorandum.dto';
  import { languageStore } from '$lib/util/languageStore';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
    presetOverlayOptionsStore,
    refreshPresetStore,
  } from '$lib/util/memorandum/stores';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import Textfield from '@smui/textfield';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { onMount } from 'svelte';

  const { memorandum: memorandumRoute } = applicationRoutes;
  const orders: Order[] = [
    {
      id: 'fixed',
      name: $t('page.memorandum.orders.fixed'),
      icon: 'border_all',
    },
    {
      id: 'flexible',
      name: $t('page.memorandum.orders.dynamic'),
      icon: 'expand',
    },
  ];

  let order = $folderOrderFolder
    ? orders.find((o) => o.id === $folderOrderFolder)
    : orders[0];
  let searchQuery = '';

  $: locale = $languageStore;

  onMount(async () => {
    await setLocale($languageStore);
    refreshPresetStore();
  });

  const showPresetOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = true;
  };

  const updateOrder = (order: Order) => {
    $folderOrderFolder = order.id;
  };
</script>

<svelte:head>
  <title>{memorandumRoute.name[locale]}</title>
  <meta name={memorandumRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if memorandumRoute.toggle}
  {#if $initialized}
    <div class="menu_line">
      <SegmentedButton
        segments={orders}
        let:segment
        singleSelect
        bind:selected={order}
        style="background-color: var(--trans);"
      >
        <Segment
          {segment}
          style={segment !== order ? 'background-color: var(--trans);' : ''}
        >
          <Icon class="material-icons" on:click={() => updateOrder(segment)}
            >{segment.icon}</Icon
          >
        </Segment>
      </SegmentedButton>

      <IconButton on:click={showPresetOverlay} class="material-icons"
        >swap_vert</IconButton
      >

      <Textfield
        variant="standard"
        bind:value={searchQuery}
        label={$t('page.memorandum.searchPlaceholder')}
      >
        <Icon class="material-icons search_icon" slot="trailingIcon"
          >search</Icon
        >
      </Textfield>

      <div class="info_buttons">
        <Wrapper>
          <IconButton style="color: white" size="mini">
            <Icon class="material-icons">info</Icon>
          </IconButton>
          <Tooltip xPos="end" yPos="above">
            {$t('page.memorandum.doubleClickInfo')}
          </Tooltip>
        </Wrapper>
      </div>
    </div>

    <div class="box_area">
      {#key $localPresetStore}
        <BoxArea bind:searchQuery />
      {/key}
    </div>

    {#if $folderOverlayOptionsStore.showOverlay}
      <FolderOverlay
        folderName={$folderOverlayOptionsStore.currentFolderName}
      />
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
    <section>Locale initializing...</section>
  {/if}
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  @use '../../lib/styles/variables.scss' as *;

  :global(.search_icon) {
    margin: 1rem;
  }

  .menu_line {
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: calc(var(--default_padding) / 2);
    gap: calc(var(--default_padding) / 2);
  }

  .info_buttons {
    display: flex;
    flex-grow: 10;
    justify-content: end;
  }

  .box_area {
    display: grid;
    height: 85vh;
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
      height: 65vh;
    }
  }
</style>

<script lang="ts">
  import BoxArea from '$lib/components/memorandum/FolderArea.svelte';
  import FolderOverlay from '$lib/components/memorandum/FolderOverlay.svelte';
  import LinkOverlay from '$lib/components/memorandum/LinkOverlay.svelte';
  import PresetOverlay from '$lib/components/memorandum/PresetOverlay.svelte';
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import type { Order } from '$lib/types/memorandum.dto';
  import { languageStore } from '$lib/util/stores/store-language';
  import { folderOrderFolder } from '$lib/util/stores/store-memorandum-folder-order';
  import {
    localPresetStore,
    refreshPresetStore,
  } from '$lib/util/stores/store-memorandum-preset';
  import {
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    presetOverlayOptionsStore,
  } from '$lib/util/stores/stores-memorandum';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Search from 'carbon-components-svelte/src/Search/Search.svelte';
  import ChangeCatalog from 'carbon-icons-svelte/lib/ChangeCatalog.svelte';
  import Information from 'carbon-icons-svelte/lib/Information.svelte';
  import { onMount } from 'svelte';

  const { memorandum: memorandumRoute } = applicationRoutes;
  const orders: Order[] = [
    {
      id: 'fixed',
      name: $t('page.memorandum.orders.fixed'),
      icon: 'Grid',
    },
    {
      id: 'flexible',
      name: $t('page.memorandum.orders.dynamic'),
      icon: 'Workspace',
    },
  ];

  let searchQuery = '';
  let orderFixedIcon;
  let orderDynamicIcon;

  $: locale = $languageStore;
  $: order = $folderOrderFolder
    ? orders.find((o) => o.id === $folderOrderFolder)
    : orders[0];

  const showPresetOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = true;
  };

  function updateOrder(orderId: string) {
    $folderOrderFolder = orderId;
  }

  onMount(async () => {
    await setLocale($languageStore);
    refreshPresetStore();

    orderFixedIcon = await import(
      /* @vite-ignore */
      `/node_modules/carbon-icons-svelte/lib/${orders[0].icon}.svelte`
    ).then((icon) => icon.default);
    orderDynamicIcon = await import(
      /* @vite-ignore */
      `/node_modules/carbon-icons-svelte/lib/${orders[1].icon}.svelte`
    ).then((icon) => icon.default);
  });
</script>

<svelte:head>
  <title>{memorandumRoute.name[locale]}</title>
  <meta name={memorandumRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if memorandumRoute.toggle}
  {#if $initialized}
    <div class="menu_line">
      <div class="order_buttons">
        <Button
          kind="ghost"
          iconDescription={$t('page.memorandum.orders.fixed')}
          tooltipAlignment="start"
          icon={orderFixedIcon}
          class={order === orders[0] ? 'active_order' : ''}
          on:click={() => updateOrder(orders[0].id)}
        />
        <Button
          kind="ghost"
          iconDescription={$t('page.memorandum.orders.dynamic')}
          tooltipAlignment="start"
          icon={orderDynamicIcon}
          class={order === orders[1] ? 'active_order' : ''}
          on:click={() => updateOrder(orders[1].id)}
        />
      </div>

      <Button
        kind="ghost"
        iconDescription={$t('page.memorandum.openPresetMenu')}
        icon={ChangeCatalog}
        on:click={showPresetOverlay}
      />

      <Search
        placeholder={$t('page.memorandum.searchPlaceholder')}
        bind:value={searchQuery}
        searchClass="memorandum_search_bar"
        autofocus
      />

      <div class="info_buttons">
        <Button
          kind="ghost"
          iconDescription={$t('page.memorandum.rightClickInfo')}
          tooltipPosition="left"
          icon={Information}
        />
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

  .order_buttons {
    display: flex;
    gap: 0;
  }

  :global(.bx--btn.active_order) {
    color: green;
    border-color: green;
  }

  :global(.memorandum_search_bar) {
    max-width: 33vw;
  }

  .info_buttons {
    display: flex;
    flex-grow: 10;
    justify-content: end;
  }

  .box_area {
    display: grid;
    grid-template-columns: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    scroll-behavior: unset;
    margin-top: 1rem;
    grid-auto-flow: dense;
  }
</style>

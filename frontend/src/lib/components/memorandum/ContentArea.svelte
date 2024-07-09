<script lang="ts">
  import Masonry from '$lib/components/shared/Masonry.svelte';
  import type { Order } from '$lib/types/memorandum-folder';
  import { fetchJson } from '$lib/util/memorandum/async.js';
  import { FolderClass } from '$lib/util/memorandum/classes.js';
  import { defaultColor } from '$lib/util/memorandum/constants.js';
  import {
    folderOrderFolder,
    localPresetStore,
    presetOverlayOptionsStore,
  } from '$lib/util/memorandum/stores.js';
  import { Icon as CommonIcon } from '@smui/common';
  import Fab from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import SegmentedButton, { Segment } from '@smui/segmented-button';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Folder from './Folder.svelte';
  import Startup from './Startup.svelte';

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
  let refreshLayout;
  let confirmDeleteFolderOpenOverlay = false;
  let confirmDeleteFolderAction;
  let linkFilter = '';
  $: filteredPreset = $localPresetStore;

  $: if (linkFilter) {
    console.log('localPresetStore');
    console.log($localPresetStore.Folders);
    console.log('old');
    console.log(filteredPreset.Folders);
    filteredPreset = {
      Folders: $localPresetStore.Folders.map((folder) => {
        return {
          ...folder,
          links: folder.links.filter((link) =>
            link.linkName.toLowerCase().includes(linkFilter.toLowerCase()),
          ),
        };
      }).filter((folder) => folder.links.length > 0),
    };
    console.log('new');
    console.log(filteredPreset.Folders);
  }

  const createFolder = () => {
    // svelte stores using html5 localstorage with stringified objects cannot be updated directly
    // we need to create a copy and set the store again, so that the stores set method gets called
    // that happens because there is no localstorage update function, only get, set, remove and clear
    let currentPreset = $localPresetStore;

    currentPreset.Folders.push(
      new FolderClass(currentPreset.Folders.length, `Neu`, [], defaultColor),
    );
    $localPresetStore = currentPreset;
  };

  const loadPreset = async () => {
    const DEFAUL_PRESET_URL = '/config/default-preset.json';

    let defaultPreset = await fetchJson(DEFAUL_PRESET_URL);

    $localPresetStore = defaultPreset;
  };

  const deleteFolder = (event) => {
    confirmDeleteFolderAction = () => {
      let currentPreset = $localPresetStore;
      currentPreset.Folders.splice(event.detail, 1);
      $localPresetStore = currentPreset;
    };

    confirmDeleteFolderOpenOverlay = true;
  };

  const updateOrder = (order: Order) => {
    $folderOrderFolder = order.id;
  };

  const showPresetOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = true;
  };
</script>

{#await $localPresetStore}
  <p>Lädt lokalen Speicher...</p>
{:then value}
  <div class="menuLine">
    <SegmentedButton
      segments={orders}
      let:segment
      singleSelect
      bind:selected={order}
    >
      <Segment {segment}>
        <CommonIcon class="material-icons" on:click={() => updateOrder(segment)}
          >{segment.icon}</CommonIcon
        >
      </Segment>
    </SegmentedButton>

    <IconButton
      style="color: white"
      on:click={showPresetOverlay}
      class="material-icons">swap_vert</IconButton
    >

    <Textfield variant="outlined" bind:value={linkFilter} label="Link Suche" />

    <div class="infoButtons">
      <Wrapper>
        <IconButton style="color: white" size="mini">
          <CommonIcon class="material-icons">info</CommonIcon>
        </IconButton>
        <Tooltip xPos="end" yPos="above"
          >Willst du was bearbeiten? Versuchs doch mal mit einem Doppelklick.</Tooltip
        >
      </Wrapper>
    </div>
  </div>

  <div class="boxArea">
    {#if value.Folders.length > 0}
      {#if filteredPreset.Folders.length > 0}
        {#if $folderOrderFolder === 'fixed'}
          <section class="contentAreaFixed">
            {#each filteredPreset.Folders as { folderName, customBackgroundColor }, i}
              <Folder
                id={i}
                folderHeader={folderName}
                folderBackground={customBackgroundColor}
                on:delFolder={deleteFolder}
              />
            {/each}
          </section>
        {:else}
          <section class="contentAreaFlexible">
            <Masonry
              reset
              gridGap={'0.75rem'}
              items={filteredPreset.Folders}
              bind:refreshLayout
            >
              {#each filteredPreset.Folders as { folderName, customBackgroundColor }, i}
                <Folder
                  id={i}
                  folderHeader={folderName}
                  folderBackground={customBackgroundColor}
                  on:delFolder={deleteFolder}
                />
              {/each}
            </Masonry>
          </section>
        {/if}
      {:else}
        <p>Keine Links gefunden</p>
      {/if}
    {:else}
      <Startup on:new={createFolder} on:default={loadPreset} />
    {/if}
  </div>
{:catch error}
  <p>Etwas ist schieß gelaufen: {error.message}</p>
{/await}

<Fab
  style="position:fixed;bottom: var(--default-padding);right: var(--default-padding);z-index: 100;"
  color="secondary"
  on:click={createFolder}
>
  <Icon style="font-size:2rem;" class="material-icons">add</Icon>
</Fab>

<ConfirmOverlay
  open={confirmDeleteFolderOpenOverlay}
  questionHeader="Ordner löschen"
  questionContent="Möchtest du diesen Ordner wirklich löschen?"
  noActionText="Nein"
  noAction={() => (confirmDeleteFolderOpenOverlay = false)}
  yesActionText="Ja"
  yesAction={confirmDeleteFolderAction}
  on:close={() => (confirmDeleteFolderOpenOverlay = false)}
/>

<style lang="scss">
  @import '../../styles/variables.scss';

  .infoButtons {
    display: flex;
    flex-grow: 10;
    justify-content: end;
  }

  .boxArea {
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
      height: 75vh;
    }
  }

  .menuLine {
    display: flex;
    align-items: center;
    justify-content: start;
    padding-left: calc(var(--default-padding) / 2);
    gap: calc(var(--default-padding) / 2);
  }

  .contentAreaFixed {
    color: white;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 35%;

    @media #{$wide} {
      grid-template-columns: repeat(5, 1fr);
    }

    @media #{$tablet} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media #{$phone} {
      grid-template-columns: 1fr;
    }
  }

  .contentAreaFlexible {
    overflow-y: auto;
    overflow-x: hidden;
  }

  * :global(svg:focus) {
    outline: 0;
  }
</style>

<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import MagicGrid from 'magic-grid';
  import { fetchJson } from '../util/async.js';
  import { FolderClass } from '../util/classes.js';
  import { defaultColor } from '../util/constants.js';
  import { folderOrderFolder, localPresetStore } from '../util/stores.js';
  import Folder from './Folder.svelte';
  import Startup from './Startup.svelte';

  function createFolder() {
    // svelte stores using html5 localstorage with stringified objects cannot be updated directly
    // we need to create a copy and set the store again, so that the stores set method gets called
    // that happens because there is no localstorage update function, only get, set, remove and clear
    let currentPreset = $localPresetStore;

    currentPreset.Folders.push(
      new FolderClass(currentPreset.Folders.length, `Neu`, [], defaultColor),
    );
    $localPresetStore = currentPreset;
  }

  async function loadPreset() {
    const DEFAUL_PRESET_URL = '/config/default-preset.json';

    let defaultPreset = await fetchJson(DEFAUL_PRESET_URL);

    $localPresetStore = defaultPreset;
  }

  function deleteFolder(event) {
    let currentPreset = $localPresetStore;
    currentPreset.Folders.splice(event.detail, 1);
    $localPresetStore = currentPreset;
  }

  let contentAreaElement;
  let magicGrid;
  $: if ($folderOrderFolder === 'flexible' && contentAreaElement) {
    const magicGridOptions = {
      container: contentAreaElement as HTMLElement,
      static: true,
      animate: true,
      center: false,
      gutter: 25,
      items: $localPresetStore.Folders.length,
    };
    magicGrid = new MagicGrid(magicGridOptions);
    magicGrid.listen();
  }
</script>

{#await $localPresetStore}
  <p>Waiting for the promise to resolve...</p>
{:then value}
  {#if value.Folders.length > 0}
    <section
      bind:this={contentAreaElement}
      class={$folderOrderFolder === 'fixed'
        ? 'contentAreaFixed'
        : 'contentAreaFlexible'}
    >
      {#each $localPresetStore.Folders as { folderName, customBackgroundColor }, i}
        <Folder
          id={i}
          folderHeader={folderName}
          folderBackground={customBackgroundColor}
          on:delFolder={deleteFolder}
        />
      {/each}
    </section>
  {:else}
    <Startup on:new={createFolder} on:default={loadPreset} />
  {/if}
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<Fab
  style="position:fixed;bottom: 20px;right: 20px;z-index: 100;"
  color="primary"
  on:click={createFolder}
>
  <Icon style="font-size:2rem;" class="material-icons">add</Icon>
</Fab>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

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
    color: white;
    margin: 0;
    padding: calc(var(--default-padding) / 2);
    // overflow-y: auto;
    overflow-x: hidden;
    height: unset;
  }

  * :global(svg:focus) {
    outline: 0;
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: var(--darkgrey80);
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: var(--darkgrey80);
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--red70);

    &:hover {
      background-color: var(--red);
    }
  }
</style>

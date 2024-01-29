<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Fab, { Icon } from '@smui/fab';
  import MagicGrid from 'magic-grid';
  import { fetchJson } from '../util/async.js';
  import { Folder } from '../util/folder.js';
  import { folderOrder, localPreset } from '../util/stores.js';
  import LinkBox from './LinkBox.svelte';
  import Startup from './Startup.svelte';

  function createFolder() {
    // svelte stores using html5 localstorage with stringified objects cannot be updated directly
    // we need to create a copy and set the store again, so that the stores set method gets called
    // that happens because there is no localstorage update function, only get, set, remove and clear
    let currentPreset = $localPreset;

    currentPreset.Folders.push(new Folder(currentPreset.Folders.length, `Neu`));
    $localPreset = currentPreset;
  }

  async function loadPreset() {
    const DEFAUL_PRESET_URL = '/config/default-preset.json';

    let defaultPreset = await fetchJson(DEFAUL_PRESET_URL);

    $localPreset = defaultPreset;
  }

  function deleteFolder(event) {
    let currentPreset = $localPreset;
    currentPreset.Folders.splice(event.detail, 1);
    $localPreset = currentPreset;
  }

  let contentAreaElement;
  let magicGrid;
  $: if ($folderOrder === 'flexible' && contentAreaElement) {
    const magicGridOptions = {
      container: contentAreaElement as HTMLElement,
      static: true,
      animate: true,
      center: false,
    };
    magicGrid = new MagicGrid(magicGridOptions);
    magicGrid.listen();
  }
</script>

{#await $localPreset}
  <p>Waiting for the promise to resolve...</p>
{:then value}
  {#if value.Folders.length > 0}
    <section
      bind:this={contentAreaElement}
      class={$folderOrder === 'fixed'
        ? 'contentAreaFixed'
        : 'contentAreaFlexible'}
    >
      {#each $localPreset.Folders as { folderName, links }, i}
        <LinkBox id={i} folderHeader={folderName} on:delFolder={deleteFolder} />
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
  @import '$lib/styles/_variables';

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
    padding: calc($defPadding / 2);
    overflow-y: auto;
    overflow-x: hidden;
  }

  * :global(svg:focus) {
    outline: 0;
  }

  ::-webkit-scrollbar {
    width: 12px;
    background-color: $darkgrey80;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: $darkgrey80;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: $red70;

    &:hover {
      background-color: $red;
    }
  }
</style>

<script lang="ts">
  import Fab, { Icon } from '@smui/fab';
  import Masonry from '../../../lib/components/Masonry.svelte';
  import { fetchJson } from '../util/async.js';
  import { FolderClass } from '../util/classes.js';
  import { defaultColor } from '../util/constants.js';
  import { folderOrderFolder, localPresetStore } from '../util/stores.js';
  import Folder from './Folder.svelte';
  import Startup from './Startup.svelte';

  let refreshLayout;

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
</script>

{#await $localPresetStore}
  <p>Waiting for the promise to resolve...</p>
{:then value}
  {#if value.Folders.length > 0}
    {#if $folderOrderFolder === 'fixed'}
      <section class="contentAreaFixed">
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
      <section class="contentAreaFlexible">
        <Masonry
          reset
          gridGap={'0.75rem'}
          items={$localPresetStore.Folders}
          bind:refreshLayout
        >
          {#each $localPresetStore.Folders as { folderName, customBackgroundColor }, i}
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
    <Startup on:new={createFolder} on:default={loadPreset} />
  {/if}
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<Fab
  style="position:fixed;bottom: var(--default-padding);right: var(--default-padding);z-index: 100;"
  color="secondary"
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
    overflow-y: auto;
    overflow-x: hidden;
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
    background-color: var(--color-theme-2-50);

    &:hover {
      background-color: var(--color-theme-2);
    }
  }
</style>

<script lang="ts">
  import Masonry from '$lib/components/shared/Masonry.svelte';
  import { fetchJson } from '$lib/util/memorandum/async.js';
  import { FolderClass } from '$lib/util/memorandum/classes.js';
  import { defaultColor } from '$lib/util/memorandum/constants.js';
  import {
    folderOrderFolder,
    localPresetStore,
  } from '$lib/util/memorandum/stores.js';
  import { initialized, t } from '$lib/util/translations';
  import Fab, { Icon } from '@smui/fab';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Folder from './Folder.svelte';
  import Startup from './Startup.svelte';

  export let searchQuery;

  let refreshLayout;
  let confirmDeleteFolderOpenOverlay = false;
  let confirmDeleteFolderAction;

  // Filter folders and links based on search query
  $: filteredFolders = $localPresetStore.Folders.filter((folder) => {
    if (!searchQuery) return true;
    return folder.links.some((link) =>
      link.linkName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  const createFolder = () => {
    // svelte stores using html5 localstorage with stringified objects cannot be updated directly
    // we need to create a copy and set the store again, so that the stores set method gets called
    // that happens because there is no localstorage update function, only get, set, remove and clear
    let currentPreset = $localPresetStore;

    currentPreset.Folders.push(
      new FolderClass(
        currentPreset.Folders.length,
        $t('page.memorandum.newFolderHeader'),
        [],
        defaultColor,
      ),
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
</script>

{#if $initialized}
  {#await $localPresetStore}
    <p>{$t('page.memorandum.loadingLocalPreset')}</p>
  {:then value}
    {#if value.Folders.length > 0}
      {#if $folderOrderFolder === 'fixed'}
        <section class="content_area_fixed">
          {#each filteredFolders as { folderName, customBackgroundColor, id }}
            <Folder
              {searchQuery}
              {id}
              folderHeader={folderName}
              folderBackground={customBackgroundColor}
              on:delFolder={deleteFolder}
            />
          {/each}
        </section>
      {:else}
        <section class="content_area_flexible">
          <Masonry
            reset
            gridGap={'0.75rem'}
            items={filteredFolders}
            bind:refreshLayout
          >
            {#each filteredFolders as { folderName, customBackgroundColor, id }}
              <Folder
                {searchQuery}
                {id}
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
    <p>
      {$t('page.shared.somethingWentWrong', {
        error: error.message,
      })}
    </p>
  {/await}

  <Fab
    style="position:fixed;bottom: var(--default_padding);right: var(--default_padding);z-index: 100;"
    color="secondary"
    on:click={createFolder}
  >
    <Icon style="font-size:2rem;" class="material-icons">add</Icon>
  </Fab>

  <ConfirmOverlay
    open={confirmDeleteFolderOpenOverlay}
    questionHeader={$t('page.memorandum.folder.deleteTitle')}
    questionContent={$t('page.memorandum.folder.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => (confirmDeleteFolderOpenOverlay = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={confirmDeleteFolderAction}
    on:close={() => (confirmDeleteFolderOpenOverlay = false)}
  />
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @import '../../styles/variables.scss';

  .content_area_fixed {
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

  .content_area_flexible {
    overflow-y: auto;
    overflow-x: hidden;
  }

  * :global(svg:focus) {
    outline: 0;
  }
</style>

<script lang="ts">
  import Masonry from '$lib/components/shared/Masonry.svelte';
  import { defaultPreset } from '$lib/config/default-preset.ts';
  import { FolderClass } from '$lib/util/memorandum/classes.js';
  import { defaultColor } from '$lib/util/memorandum/constants.js';
  import { folderOrderFolder } from '$lib/util/stores/store-memorandum-folder-order';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Folder from './Folder.svelte';
  import Startup from './Startup.svelte';

  let { searchQuery } = $props();

  let confirmDeleteFolderOpenOverlay = $state(false);
  let confirmDeleteFolderAction = $state();

  // Filter folders and links based on search query
  const filteredFolders = $derived($localPresetStore.Folders.filter((folder) => {
    if (!searchQuery) return true;
    return folder.links.some((link) =>
      link.linkName?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }));

  const createFolder = () => {
    // svelte stores using html5 localstorage with stringified objects cannot be updated directly
    // we need to create a copy and set the store again, so that the stores set method gets called
    // that happens because there is no localstorage update function, only get, set, remove and clear
    const currentPreset = structuredClone($localPresetStore);

    currentPreset.Folders.push(
      new FolderClass(
        crypto.randomUUID(),
        $t('page.memorandum.newFolderHeader'),
        [],
        defaultColor,
      ),
    );
    $localPresetStore = currentPreset;
  };

  const loadPreset = () => {
    $localPresetStore = defaultPreset;
  };

  const deleteFolder = (folderId) => {
    confirmDeleteFolderAction = () => {
      const currentPreset = structuredClone($localPresetStore);
      const folderToBeDeletedIndex = currentPreset.Folders.findIndex(
        (folder) => folder.id === folderId,
      );
      currentPreset.Folders.splice(folderToBeDeletedIndex, 1);
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
          {#each filteredFolders as { folderName, customBackgroundColor, id } (id)}
            <Folder
              {searchQuery}
              folderId={id}
              folderHeader={folderName}
              folderBackground={customBackgroundColor}
              onDeleteFolder={deleteFolder}
            />
          {/each}
        </section>
      {:else}
        <section class="content_area_flexible">
          <Masonry
            reset
            gridGap={'0.75rem'}
            items={filteredFolders}
          >
            {#each filteredFolders as { folderName, customBackgroundColor, id } (id)}
              <Folder
                {searchQuery}
                folderId={id}
                folderHeader={folderName}
                folderBackground={customBackgroundColor}
                onDeleteFolder={deleteFolder}
              />
            {/each}
          </Masonry>
        </section>
      {/if}
    {:else}
      <Startup onNew={createFolder} onDefault={loadPreset} />
    {/if}
  {:catch error}
    <p>
      {$t('page.shared.somethingWentWrong', {
        error: error.message,
      })}
    </p>
  {/await}

  <Button
    kind="tertiary"
    iconDescription={$t('page.memorandum.startup.createEmptyFolder')}
    icon={Add}
    id="add_folder_button"
    tooltipPosition="left"
    on:click={createFolder}
  />

  <ConfirmOverlay
    bind:open={confirmDeleteFolderOpenOverlay}
    questionHeader={$t('page.memorandum.folder.deleteTitle')}
    questionContent={$t('page.memorandum.folder.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => (confirmDeleteFolderOpenOverlay = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={confirmDeleteFolderAction}
    onClose={() => (confirmDeleteFolderOpenOverlay = false)}
  />
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .content_area_fixed {
    color: white;
    margin: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: repeat(3, 1fr);

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

  :global(#add_folder_button) {
    position: fixed;
    bottom: var(--default_padding);
    right: var(--default_padding);
    z-index: 100;
  }
</style>

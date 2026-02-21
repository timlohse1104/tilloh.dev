<script lang="ts">
  import type { FolderDto } from '$lib/types/memorandum.dto';
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import { folderOrderFolder } from '$lib/util/stores/store-memorandum-folder-order';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import {
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
  } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import ContextMenu from 'carbon-components-svelte/src/ContextMenu/ContextMenu.svelte';
  import ContextMenuDivider from 'carbon-components-svelte/src/ContextMenu/ContextMenuDivider.svelte';
  import ContextMenuOption from 'carbon-components-svelte/src/ContextMenu/ContextMenuOption.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
  import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte';
  import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
  import CopyFile from 'carbon-icons-svelte/lib/CopyFile.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Link from './Link.svelte';

  let { folderId, searchQuery = '', folderHeader, folderBackground, onDeleteFolder } = $props();

  let folderHeaderObject: HTMLElement | undefined = $state(undefined);
  let folderBackgroundColor = $state('');
  let confirmDeleteLinkOpenOverlay = $state(false);
  let confirmDeleteLinkAction = $state();

  const currentFolder = $derived($localPresetStore?.Folders.find(
    (folder) => folder.id === folderId,
  ));
  const currentFolderIndex = $derived($localPresetStore?.Folders.findIndex(
    (folder) => folder.id === folderId,
  ));
  const filteredLinks = $derived(currentFolder?.links?.filter((link) => {
    if (!searchQuery) return true;
    return link.linkName?.toLowerCase().includes(searchQuery.toLowerCase());
  }));

  $effect(() => {
    if (folderBackground) {
      folderBackgroundColor = new RGBBackgroundClass(folderBackground).getRGBA();
    }
  });

  const showLinkOverlay = (linkId = null, linkName = null, linkUrl = null) => {
    $linkOverlayOptionsStore.showOverlay =
      !$linkOverlayOptionsStore.showOverlay;
    $linkOverlayOptionsStore.currentFolderId = folderId;
    $linkOverlayOptionsStore.currentFolder = folderHeader;

    if (linkId) {
      $linkOverlayOptionsStore.currLinkId = linkId;
      $linkOverlayOptionsStore.currLinkName = linkName;
      $linkOverlayOptionsStore.currLinkUrl = linkUrl;
    }
  };
  const deleteLink = (linkId) => {
    console.log(`Deleting link with ID: ${linkId}`);
    confirmDeleteLinkAction = () => {
      const currentPreset = structuredClone($localPresetStore);

      currentPreset.Folders.forEach((folder: FolderDto) => {
        const linkIndex = folder.links.findIndex((link) => link.id === linkId);
        if (linkIndex !== -1) folder.links.splice(linkIndex, 1);
      });

      $localPresetStore = currentPreset;
    };

    confirmDeleteLinkOpenOverlay = true;
  };
  const showFolderOverlay = () => {
    $folderOverlayOptionsStore.showOverlay =
      !$folderOverlayOptionsStore.showOverlay;
    $folderOverlayOptionsStore.currentFolderId = folderId;
    $folderOverlayOptionsStore.currentFolderName = folderHeader;
    $folderOverlayOptionsStore.currentFolderBackgroundColor =
      $localPresetStore.Folders.find(
        (f) => f.id === folderId,
      ).customBackgroundColor;
  };
  const openFolderLinks = () => {
    let currentPreset = $localPresetStore;
    let folder = currentPreset.Folders.find((folder) => (folder.id = folderId));

    if (folder.links.length > 0) {
      folder.links.map((link) => {
        window.open(link.linkUrl, '_blank');
      });
    }
  };
  const moveFolderUp = () => {
    if (currentFolderIndex > 0) {
      const currPreset = structuredClone($localPresetStore);
      const folder = currPreset.Folders[currentFolderIndex];
      currPreset.Folders.splice(currentFolderIndex, 1);
      currPreset.Folders.splice(currentFolderIndex - 1, 0, folder);
      $localPresetStore = currPreset;
    }
  };
  const moveFolderDown = () => {
    if (currentFolderIndex < $localPresetStore.Folders.length - 1) {
      const currPreset = structuredClone($localPresetStore);
      const folder = currPreset.Folders[currentFolderIndex];
      currPreset.Folders.splice(currentFolderIndex, 1);
      currPreset.Folders.splice(currentFolderIndex + 1, 0, folder);
      $localPresetStore = currPreset;
    }
  };
  const moveFolderToTop = () => {
    if (currentFolderIndex > 0) {
      const currPreset = structuredClone($localPresetStore);
      const folder = currPreset.Folders[currentFolderIndex];
      currPreset.Folders.splice(currentFolderIndex, 1);
      currPreset.Folders.unshift(folder);
      $localPresetStore = currPreset;
    }
  };
  const moveFolderToBottom = () => {
    if (currentFolderIndex < $localPresetStore.Folders.length - 1) {
      const currPreset = structuredClone($localPresetStore);
      const folder = currPreset.Folders[currentFolderIndex];
      currPreset.Folders.splice(currentFolderIndex, 1);
      currPreset.Folders.push(folder);
      $localPresetStore = currPreset;
    }
  };
  const provideLinkFaviconUrl = (linkUrl) => {
    const url = new URL(linkUrl);
    const baseUrl = url.hostname;
    let domain = baseUrl.split('.').slice(-2).join('.');
    let mainUrl = `https://${domain}`;
    let faviconLink = `https://www.google.com/s2/favicons?domain=${mainUrl}`;
    return faviconLink;
  };
  const duplicateFolder = () => {
    const currentPreset = structuredClone($localPresetStore);
    const currentFolder = currentPreset.Folders.find((folder) => folder.id === folderId);

    const duplicatedFolder = structuredClone(currentFolder);
    duplicatedFolder.id = crypto.randomUUID();
    duplicatedFolder.folderName = $t('page.memorandum.folder.copiedName', {
      folderName: folderHeader,
    });

    currentPreset.Folders.push(duplicatedFolder);

    $localPresetStore = currentPreset;
  };
</script>

{#if $initialized}
  <section
    class={$folderOrderFolder === 'fixed'
      ? 'link_box_fixed'
      : 'link_box_flexible'}
    style={`border: solid 0.1em ${folderBackgroundColor};`}
    role="presentation"
  >
    <div
      bind:this={folderHeaderObject}
      class="box_header"
      style={folderBackgroundColor
        ? `background-color: ${folderBackgroundColor}`
        : 'var(--darkgrey80)'}
      role="presentation"
    >
      <span class="folder_title">{folderHeader}</span>
      <div class="folder_controls">
        <button
          class="arrow_button"
          onclick={() => moveFolderUp()}
          disabled={currentFolderIndex === 0}
          title={$t('page.memorandum.folder.moveUp')}
        >
          <ChevronUp size={20} />
        </button>
        <button
          class="arrow_button"
          onclick={() => moveFolderDown()}
          disabled={currentFolderIndex === $localPresetStore.Folders.length - 1}
          title={$t('page.memorandum.folder.moveDown')}
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>

    <div class="box_content">
      {#await $localPresetStore}
        <p>
          {$t('page.memorandum.loadHyperlinksInfo')}
        </p>
      {:then value}
        {#if filteredLinks?.length > 0}
          {#each filteredLinks as { id: linkId, linkName, linkUrl, faviconLink } (linkId)}
            <Link
              onDeleteLink={deleteLink}
              onEditLink={showLinkOverlay}
              {linkId}
              {folderId}
              {linkName}
              {linkUrl}
              faviconLink={faviconLink || provideLinkFaviconUrl(linkUrl)}
            />
          {/each}
        {/if}
      {:catch error}
        <p>
          {$t('page.memorandum.errorLoadingHyperlinks', {
            error: error.message,
          })}
        </p>
      {/await}
    </div>

    <ConfirmOverlay
      bind:open={confirmDeleteLinkOpenOverlay}
      questionHeader={$t('page.memorandum.link.deleteTitle')}
      questionContent={$t('page.memorandum.link.deleteQuestion')}
      noActionText={$t('page.shared.no')}
      noAction={() => (confirmDeleteLinkOpenOverlay = false)}
      yesActionText={$t('page.shared.yes')}
      yesAction={confirmDeleteLinkAction}
      onClose={() => (confirmDeleteLinkOpenOverlay = false)}
    />

    <ContextMenu target={folderHeaderObject ? [folderHeaderObject] : []}>
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.folder.newLink')}
        icon={Add}
        on:click={showLinkOverlay}
      />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.folder.openLinks', {
          amount: filteredLinks.length,
        })}
        icon={Launch}
        on:click={openFolderLinks}
      />
      {#if $localPresetStore.Folders.length > 1}
        <ContextMenuDivider />
        {#if currentFolderIndex > 0}
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.folder.moveUp')}
            icon={ChevronUp}
            on:click={moveFolderUp}
          />
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.folder.moveToTop')}
            icon={ArrowUp}
            on:click={moveFolderToTop}
          />
        {/if}
        {#if currentFolderIndex < $localPresetStore.Folders.length - 1}
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.folder.moveDown')}
            icon={ChevronDown}
            on:click={moveFolderDown}
          />
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.folder.moveToBottom')}
            icon={ArrowDown}
            on:click={moveFolderToBottom}
          />
        {/if}
      {/if}
      <ContextMenuDivider />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.folder.editTitle')}
        icon={Edit}
        on:click={showFolderOverlay}
      />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.folder.duplicate')}
        icon={CopyFile}
        on:click={duplicateFolder}
      />
      <ContextMenuDivider />
      <ContextMenuOption
        indented
        kind="danger"
        labelText={$t('page.memorandum.folder.deleteTitle', {
          amount: filteredLinks.length,
        })}
        icon={TrashCan}
        on:click={() => onDeleteFolder(folderId)}
      />
    </ContextMenu>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    color: white;
    text-shadow: 0.5px 0.5px black;
  }

  .link_box_fixed {
    display: grid;
    margin: 0 calc(var(--default_padding) / 2) var(--default_padding)
      calc(var(--default_padding) / 2);
    grid-template-rows: 2.5rem 250px;
    grid-template-areas:
      'header'
      'content';
  }
  .link_box_flexible {
    display: grid;
    width: 100%;
    grid-template-rows: 2.5rem auto;
    grid-template-areas:
      'header'
      'content';
    box-shadow: unset;

    &:hover {
      box-shadow: 0 0 20px var(--white30);
    }
  }

  .box_header {
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bolder;
    padding-left: var(--default_padding);
    padding-right: calc(var(--default_padding) / 2);
    font-size: 18px;
  }

  .folder_title {
    flex: 1;
  }

  .folder_controls {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;

    @media #{$phone}, #{$tablet} {
      display: none;
    }
  }

  .box_header:hover .folder_controls {
    opacity: 1;
  }

  .arrow_button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: var(--white30);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .box_content {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: var(--black30);
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }
</style>

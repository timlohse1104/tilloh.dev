<script lang="ts">
  import type { FolderDto } from '$lib/types/memorandum.dto';
  import { draggable, dropzone } from '$lib/util/drag-and-drop';
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import { folderOrderFolder } from '$lib/util/stores/store-memorandum-folder-order';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import {
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
  } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import {
    ContextMenu,
    ContextMenuDivider,
    ContextMenuOption,
  } from 'carbon-components-svelte';
  import { Add, CopyFile, Edit, Launch, TrashCan } from 'carbon-icons-svelte';
  import { createEventDispatcher } from 'svelte';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Link from './Link.svelte';
  const dispatch = createEventDispatcher();

  export let folderId;
  export let searchQuery = '';
  export let folderHeader;
  export let folderBackground;
  export let folderBackgroundColor = '';
  let folderObject;

  let confirmDeleteLinkOpenOverlay = false;
  let confirmDeleteLinkAction;

  $: currentFolder = $localPresetStore?.Folders.find(
    (folder) => folder.id === folderId,
  );
  $: currentFolderIndex = $localPresetStore?.Folders.findIndex(
    (folder) => folder.id === folderId,
  );
  $: filteredLinks = currentFolder?.links?.filter((link) => {
    if (!searchQuery) return true;
    return link.linkName?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  $: if (folderBackground) {
    folderBackgroundColor = new RGBBackgroundClass(folderBackground).getRGBA();
  }

  const showLinkOverlay = (event) => {
    $linkOverlayOptionsStore.showOverlay =
      !$linkOverlayOptionsStore.showOverlay;
    $linkOverlayOptionsStore.currentFolderId = folderId;
    $linkOverlayOptionsStore.currentFolder = folderHeader;

    if (event.detail) {
      $linkOverlayOptionsStore.currLinkId = event.detail.linkId;
      $linkOverlayOptionsStore.currLinkName = event.detail.linkName;
      $linkOverlayOptionsStore.currLinkUrl = event.detail.linkUrl;
    }
  };
  const deleteLink = (event) => {
    const linkId = event.detail;
    console.log(`Deleting link with ID: ${linkId}`);
    confirmDeleteLinkAction = () => {
      let currentPreset = $localPresetStore;

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
  const dropFolder = (originFolderId) => {
    if (originFolderId !== folderId) {
      let currPreset = $localPresetStore;
      const originFolderIndex = currPreset.Folders.findIndex(
        (folder) => folder.id === originFolderId,
      );
      const originFolder = currPreset.Folders.splice(originFolderIndex, 1)[0];

      currPreset.Folders.splice(currentFolderIndex, 0, originFolder);

      $localPresetStore = currPreset;
    }
  };
  const dropLink = (originLinkId) => {
    let currPreset = $localPresetStore;
    let originFolderIndex;
    let originLinkIndex;

    currPreset.Folders.some((folder) => {
      originLinkIndex = folder.links.findIndex((link) => {
        return link.id === originLinkId;
      });
      if (originLinkIndex !== -1) {
        originFolderIndex = currPreset.Folders.indexOf(folder);
        return true;
      }
    });

    const originLink = currPreset.Folders[originFolderIndex].links.splice(
      originLinkIndex,
      1,
    )[0];

    currPreset.Folders[currentFolderIndex].links.splice(0, 0, originLink);
    $localPresetStore = currPreset;
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
    let currentPreset = $localPresetStore;
    let currentFolder = {
      ...currentPreset.Folders.find(
        (folder) => folder.id === $folderOverlayOptionsStore.currentFolderId,
      ),
    };

    const duplicatedFolder = JSON.parse(JSON.stringify(currentFolder));
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
    bind:this={folderObject}
    class={$folderOrderFolder === 'fixed'
      ? 'link_box_fixed'
      : 'link_box_flexible'}
    style={`border: solid 0.1em ${folderBackgroundColor};`}
    use:draggable={`{ "type": "folder", "originFolderId": "${folderId}" }`}
    use:dropzone={{
      onDrop(input, event) {
        event.stopPropagation();
        const { type, linkId, originFolderId } = JSON.parse(input);

        if (type === 'folder') {
          dropFolder(originFolderId);
        } else if (type === 'link') {
          dropLink(linkId);
        }
      },
    }}
    role="presentation"
  >
    <div
      class="box_header"
      style={folderBackgroundColor
        ? `background-color: ${folderBackgroundColor}`
        : 'var(--darkgrey80)'}
      role="presentation"
    >
      {folderHeader}
    </div>

    <div class="box_content">
      {#await $localPresetStore}
        <p>
          {$t('page.memorandum.loadHyperlinksInfo')}
        </p>
      {:then value}
        {#if filteredLinks?.length > 0}
          {#each filteredLinks as { id: linkId, linkName, linkUrl, faviconLink }}
            <Link
              on:delLink={deleteLink}
              on:editLink={showLinkOverlay}
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
      open={confirmDeleteLinkOpenOverlay}
      questionHeader={$t('page.memorandum.link.deleteTitle')}
      questionContent={$t('page.memorandum.link.deleteQuestion')}
      noActionText={$t('page.shared.no')}
      noAction={() => (confirmDeleteLinkOpenOverlay = false)}
      yesActionText={$t('page.shared.yes')}
      yesAction={confirmDeleteLinkAction}
      on:close={() => (confirmDeleteLinkOpenOverlay = false)}
    />
  </section>

  <ContextMenu target={folderObject}>
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
      on:click={() => dispatch('delFolder', folderId)}
    />
  </ContextMenu>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

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
    font-weight: bolder;
    padding-left: var(--default_padding);
    font-size: 18px;
  }

  .box_content {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: var(--black30);
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
</style>

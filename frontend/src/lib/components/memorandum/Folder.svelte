<script>
  import { draggable, dropzone } from '$lib/util/drag-and-drop';
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
  } from '$lib/util/memorandum/stores.js';
  import { initialized, t } from '$lib/util/translations';
  import { createEventDispatcher } from 'svelte';
  import ConfirmOverlay from '../shared/ConfirmOverlay.svelte';
  import Link from './Link.svelte';
  const dispatch = createEventDispatcher();

  export let id;
  export let searchQuery = '';
  export let folderHeader;
  export let folderBackground;
  export let folderBackgroundColor = '';

  let confirmDeleteLinkOpenOverlay = false;
  let confirmDeleteLinkAction;

  $: filteredLinks = $localPresetStore?.Folders.find(
    (folder) => folder.id === id,
  )?.links.filter((link) => {
    if (!searchQuery) return true;
    return link.linkName?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  $: if (folderBackground) {
    folderBackgroundColor = new RGBBackgroundClass(folderBackground).getRGBA();
  }

  const showOverlay = (event) => {
    $linkOverlayOptionsStore.showOverlay =
      !$linkOverlayOptionsStore.showOverlay;
    $linkOverlayOptionsStore.currentFolderId = id;
    $linkOverlayOptionsStore.currentFolder = folderHeader;

    if (event.detail) {
      $linkOverlayOptionsStore.currLinkId = event.detail.linkId;
      $linkOverlayOptionsStore.currLinkName = event.detail.linkName;
      $linkOverlayOptionsStore.currLinkUrl = event.detail.linkUrl;
    }
  };

  const deleteLink = (event) => {
    confirmDeleteLinkAction = () => {
      let currentPreset = $localPresetStore;

      currentPreset.Folders[id].links.splice(event.detail, 1);
      updateLinkIds(currentPreset.Folders[id].links);

      $localPresetStore = currentPreset;
    };

    confirmDeleteLinkOpenOverlay = true;
  };

  const showFolderOverlay = () => {
    $folderOverlayOptionsStore.showOverlay =
      !$folderOverlayOptionsStore.showOverlay;
    $folderOverlayOptionsStore.currentFolderId = id;
    $folderOverlayOptionsStore.currentFolderName = folderHeader;
    $folderOverlayOptionsStore.currentFolderBackgroundColor =
      $localPresetStore.Folders[id].customBackgroundColor;
  };

  const openFolderLinks = () => {
    let currentPreset = $localPresetStore;
    let folder = currentPreset.Folders[id];

    if (folder.links.length > 0) {
      folder.links.map((link) => {
        window.open(link.linkUrl, '_blank');
      });
    }
  };

  const dropFolder = (event, dropInfo) => {
    const { originFolderIndex } = dropInfo;
    let targetIndex = getTargetFolderIndex(event);

    if (originFolderIndex !== targetIndex) {
      let currPreset = $localPresetStore;

      currPreset.Folders.splice(
        targetIndex,
        0,
        currPreset.Folders.splice(originFolderIndex, 1)[0],
      );

      $localPresetStore = currPreset;
    }
  };

  const dropLink = (event, dropInfo) => {
    const { originFolderIndex, originLinkIndex } = dropInfo;
    let targetFolderIndex = getTargetFolderIndex(event);
    let targetLinkIndex = getTargetLinkIndex(event);
    let currPreset = $localPresetStore;

    // push link to target folder on position of target link
    currPreset.Folders[targetFolderIndex].links.splice(
      targetLinkIndex,
      0,
      // get the link from the origin folder and remove it
      currPreset.Folders[originFolderIndex]?.links.splice(
        originLinkIndex,
        1,
      )[0],
    );

    // updates links ids in array to be reactively updated
    // origin folder
    let originLinks = currPreset.Folders[originFolderIndex].links;
    updateLinkIds(originLinks);
    // target folder
    let targetLinks = currPreset.Folders[targetFolderIndex].links;
    updateLinkIds(targetLinks);

    $localPresetStore = currPreset;
  };

  const updateLinkIds = (links) => {
    links.map((link) => (link.id = links.indexOf(link)));
  };

  const getTargetLinkIndex = (event) => {
    let targetIndex;

    if (
      event.target.nodeName === 'A' ||
      event.target.nodeName === 'IMG' ||
      event.target.nodeName === 'BUTTON' ||
      (event.target.previousElementSibling &&
        event.target.previousElementSibling.nodeName === 'A')
    ) {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.children)
        .indexOf(event.target.parentNode);
    } else if (event.target.nodeName === 'DIV' && event.target.id === 'link') {
      targetIndex = [].slice
        .call(event.target.parentNode.children)
        .indexOf(event.target);
    }

    return targetIndex;
  };

  const getTargetFolderIndex = (event) => {
    let targetIndex;

    if (
      event.target.nodeName === 'A' ||
      event.target.nodeName === 'IMG' ||
      (event.target.previousElementSibling &&
        event.target.previousElementSibling.nodeName === 'A')
    ) {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.parentNode.parentNode.children)
        .indexOf(event.target.parentNode.parentNode.parentNode);
    } else if (event.target.nodeName === 'DIV' && event.target.id === 'link') {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.parentNode.children)
        .indexOf(event.target.parentNode.parentNode);
    } else {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.children)
        .indexOf(event.target.parentNode);
    }

    return targetIndex || 0;
  };

  const provideLinkFaviconUrl = (linkUrl) => {
    const url = new URL(linkUrl);
    const baseUrl = url.hostname;
    let domain = baseUrl.split('.').slice(-2).join('.');
    let mainUrl = `https://${domain}`;
    let faviconLink = `https://www.google.com/s2/favicons?domain=${mainUrl}`;
    return faviconLink;
  };
</script>

{#if $initialized}
  <section
    class={$folderOrderFolder === 'fixed'
      ? 'link_box_fixed'
      : 'link_box_flexible'}
    style={`border: solid 0.1em ${folderBackgroundColor};`}
    use:draggable={`{ "type": "folder", "folderId": "${id}" }`}
    use:dropzone={{
      onDrop(input, event) {
        event.stopPropagation();
        const { type, linkId, folderId } = JSON.parse(input);

        if (type === 'folder') {
          const dropInfo = { originFolderIndex: folderId };
          dropFolder(event, dropInfo);
        } else if (type === 'link') {
          const dropInfo = {
            originFolderIndex: folderId,
            originLinkIndex: linkId,
          };
          dropLink(event, dropInfo);
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
      on:dblclick={showFolderOverlay}
      role="presentation"
    >
      <button on:click={openFolderLinks} class="folder_header_button">
        {folderHeader}
      </button>
    </div>

    <button
      class="box_delete_button"
      style={folderBackgroundColor
        ? `background-color: ${folderBackgroundColor}`
        : 'var(--darkgrey80)'}
      on:click={() => dispatch('delFolder', id)}
    >
      -
    </button>

    <div class="box_content">
      {#await $localPresetStore}
        <p>
          {$t('page.memorandum.loadHyperlinksInfo')}
        </p>
      {:then value}
        {#if $localPresetStore?.Folders[id]?.links.length > 0}
          {#each filteredLinks as { id: index, linkName, linkUrl, faviconLink }}
            <Link
              on:delLink={deleteLink}
              on:editLink={showOverlay}
              linkId={index}
              folderId={id}
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

    <button
      class="link_add_button"
      style={folderBackgroundColor
        ? `background-color: ${folderBackgroundColor}`
        : 'var(--darkgrey80)'}
      on:click={showOverlay}
    >
      <span>{$t('page.memorandum.newLink')}</span>

      <span>+</span>
    </button>

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
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .link_box_fixed {
    display: grid;
    margin: 0 calc(var(--default_padding) / 2) var(--default_padding)
      calc(var(--default_padding) / 2);
    grid-template-columns: calc(100% - 50px) 50px;
    grid-template-rows: 2.5rem auto 2rem;
    grid-template-areas:
      'header delBtn'
      'content content'
      'addLinkBtn addLinkBtn';
  }
  .link_box_flexible {
    display: grid;
    width: 100%;
    grid-template-columns: calc(100% - 50px) 50px;
    grid-template-rows: 2.5rem auto 2rem;
    grid-template-areas:
      'header delBtn'
      'content content'
      'addLinkBtn addLinkBtn';
    box-shadow: unset;

    &:hover {
      box-shadow: 0 0 20px var(--white30);
    }
  }

  .folder_header_button {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--white);
    text-shadow: var(--sharpen);
    padding: 0;
  }

  .box_header {
    grid-area: header;
    display: flex;
    align-items: center;
    font-weight: bolder;
    padding-left: var(--default_padding);
    text-shadow: var(--sharpen);
    font-size: 18px;
  }

  .box_delete_button {
    grid-area: delBtn;
    @include mem_button;
    text-align: center;
    font-weight: bolder;
    text-shadow: var(--sharpen);

    &:hover {
      background-color: var(--red);
    }
  }

  .link_add_button {
    grid-area: addLinkBtn;
    @include mem_button;
    text-align: left;
    padding-left: var(--default_padding);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    text-shadow: var(--sharpen);
  }

  .box_content {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: var(--black30);
  }
</style>

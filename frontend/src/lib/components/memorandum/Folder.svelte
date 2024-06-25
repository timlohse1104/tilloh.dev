<script>
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
  } from '$lib/util/memorandum/stores.js';
  import { createEventDispatcher } from 'svelte';
  import Link from './Link.svelte';

  export let id;
  export let folderHeader;
  export let folderBackground;
  export let folderBackgroundColor = '';

  $: if (folderBackground) {
    folderBackgroundColor = new RGBBackgroundClass(folderBackground).getRGBA();
  }

  const dispatch = createEventDispatcher();

  function showOverlay(event) {
    $linkOverlayOptionsStore.showOverlay =
      !$linkOverlayOptionsStore.showOverlay;
    $linkOverlayOptionsStore.currentFolderId = id;
    $linkOverlayOptionsStore.currentFolder = folderHeader;

    if (event.detail) {
      $linkOverlayOptionsStore.currLinkId = event.detail.linkId;
      $linkOverlayOptionsStore.currLinkName = event.detail.linkName;
      $linkOverlayOptionsStore.currLinkUrl = event.detail.linkUrl;
    }
  }

  function deleteLink(event) {
    let currentPreset = $localPresetStore;

    currentPreset.Folders[id].links.splice(event.detail, 1);
    _updateLinkIds(currentPreset.Folders[id].links);

    $localPresetStore = currentPreset;
  }

  function showFolderOverlay() {
    $folderOverlayOptionsStore.showOverlay =
      !$folderOverlayOptionsStore.showOverlay;
    $folderOverlayOptionsStore.currentFolderId = id;
    $folderOverlayOptionsStore.currentFolderName = folderHeader;
    $folderOverlayOptionsStore.currentFolderBackgroundColor =
      $localPresetStore.Folders[id].customBackgroundColor;
  }

  function openFolderLinks() {
    let currentPreset = $localPresetStore;
    let folder = currentPreset.Folders[id];

    if (folder.links.length > 0) {
      folder.links.map((link) => {
        window.open(link.linkUrl, '_blank');
      });
    }
  }

  function dragStartFolder(event) {
    event.stopPropagation();
    let originIndex = [].slice
      .call(event.target.parentNode.children)
      .indexOf(event.target);

    event.dataTransfer.setData('type', 'folder');
    event.dataTransfer.setData('originIndex', originIndex);
  }

  function dropFolder(event) {
    let originIndex = event.dataTransfer.getData('originIndex');
    let targetIndex = _getTargetFolderIndex(event);

    if (originIndex !== targetIndex) {
      let currPreset = $localPresetStore;

      currPreset.Folders.splice(
        targetIndex,
        0,
        currPreset.Folders.splice(originIndex, 1)[0],
      );

      $localPresetStore = currPreset;
    }
  }

  function dragStartLink(event) {
    event.stopPropagation();
    let originFolderIndex;
    let originLinkIndex;

    if (event.target.nodeName !== 'DIV') {
      originFolderIndex = [].slice
        .call(event.target.parentNode.parentNode.parentNode.parentNode.children)
        .indexOf(event.target.parentNode.parentNode.parentNode);
      originLinkIndex = [].slice
        .call(event.target.parentNode.parentNode.children)
        .indexOf(event.target.parentNode);
    } else {
      originFolderIndex = [].slice
        .call(event.target.parentNode.parentNode.parentNode.children)
        .indexOf(event.target.parentNode.parentNode);
      originLinkIndex = [].slice
        .call(event.target.parentNode.children)
        .indexOf(event.target);
    }

    event.dataTransfer.setData('type', 'link');
    event.dataTransfer.setData('originFolderIndex', originFolderIndex);
    event.dataTransfer.setData('originLinkIndex', originLinkIndex);
  }

  function dropLink(event) {
    let originFolderIndex = event.dataTransfer.getData('originFolderIndex');
    let originLinkIndex = event.dataTransfer.getData('originLinkIndex');
    let targetFolderIndex = _getTargetFolderIndex(event);
    let targetLinkIndex = _getTargetLinkIndex(event);
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
    _updateLinkIds(originLinks);
    // target folder
    let targetLinks = currPreset.Folders[targetFolderIndex].links;
    _updateLinkIds(targetLinks);

    $localPresetStore = currPreset;
  }

  function _updateLinkIds(links) {
    links.map((link) => (link.id = links.indexOf(link)));
  }

  function _getTargetLinkIndex(event) {
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
    }

    return targetIndex;
  }

  function _getTargetFolderIndex(event) {
    let targetIndex;

    if (
      event.target.nodeName === 'A' ||
      event.target.nodeName === 'IMG' ||
      event.target.nodeName === 'DIV' ||
      (event.target.previousElementSibling &&
        event.target.previousElementSibling.nodeName === 'A')
    ) {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.parentNode.parentNode.children)
        .indexOf(event.target.parentNode.parentNode.parentNode);
    } else {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.children)
        .indexOf(event.target.parentNode);
    }

    return targetIndex || 0;
  }

  function provideLinkFaviconUrl(linkUrl) {
    const url = new URL(linkUrl);
    const baseUrl = url.hostname;
    let domain = baseUrl.split('.').slice(-2).join('.');
    let mainUrl = `https://${domain}`;
    let faviconLink = `https://www.google.com/s2/favicons?domain=${mainUrl}`;
    return faviconLink;
  }
</script>

<section
  class={$folderOrderFolder === 'fixed' ? 'linkBoxFixed' : 'linkBoxFlexible'}
  style={`border: solid 0.1em ${folderBackgroundColor};`}
  draggable={true}
  on:dragstart={(event) => dragStartFolder(event)}
  on:drop|preventDefault={(event) => {
    if (event.dataTransfer.getData('type') === 'folder') {
      dropFolder(event);
    } else if (event.dataTransfer.getData('type') === 'link') {
      dropLink(event);
    }
  }}
  on:dragover|preventDefault
  role="presentation"
>
  <div
    class="boxHeader"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : 'var(--darkgrey80)'}
    on:dblclick={showFolderOverlay}
    role="presentation"
  >
    <button on:click={openFolderLinks} class="folderHeaderButton">
      {folderHeader}
    </button>
  </div>

  <button
    class="boxDelBtn"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : 'var(--darkgrey80)'}
    on:click={() => dispatch('delFolder', id)}
  >
    -
  </button>

  <div class="boxContent">
    {#await $localPresetStore}
      <p>Lädt gespeicherte Hyperlinks...</p>
    {:then value}
      {#if $localPresetStore?.Folders[id]?.links.length > 0}
        {#each $localPresetStore?.Folders[id]?.links as { id: index, linkName, linkUrl, faviconLink }}
          <Link
            on:delLink={deleteLink}
            on:editLink={showOverlay}
            linkId={index}
            {linkName}
            {linkUrl}
            faviconLink={faviconLink || provideLinkFaviconUrl(linkUrl)}
            on:dragstart={(event) => dragStartLink(event)}
          />
        {/each}
      {/if}
    {:catch error}
      <p>
        Beim laden der Hyperlinks ist etwas schief gelaufen: {error.message}
      </p>
    {/await}
  </div>

  <button
    class="linkAddBtn"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : 'var(--darkgrey80)'}
    on:click={showOverlay}
  >
    <span>Neuer Link</span>
    <span>+</span>
  </button>
</section>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  .linkBoxFixed {
    display: grid;
    margin: 0 calc(var(--default-padding) / 2) var(--default-padding)
      calc(var(--default-padding) / 2);
    grid-template-columns: calc(100% - 50px) 50px;
    grid-template-rows: 2.5rem auto 2rem;
    grid-template-areas:
      'header delBtn'
      'content content'
      'addLinkBtn addLinkBtn';
  }
  .linkBoxFlexible {
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

  .folderHeaderButton {
    cursor: pointer;
    background-color: transparent;
    border: none;
    color: var(--white);
    text-shadow: var(--sharpen);
    padding: 0;
  }

  .boxHeader {
    grid-area: header;
    display: flex;
    align-items: center;
    font-weight: bolder;
    padding-left: var(--default-padding);
    text-shadow: var(--sharpen);
    font-size: 18px;
  }

  .boxDelBtn {
    grid-area: delBtn;
    @include mem-button;
    text-align: center;
    font-weight: bolder;
    text-shadow: var(--sharpen);

    &:hover {
      background-color: var(--red);
    }
  }

  .linkAddBtn {
    grid-area: addLinkBtn;
    @include mem-button;
    text-align: left;
    padding-left: var(--default-padding);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    text-shadow: var(--sharpen);
  }

  .boxContent {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: var(--black30);
  }
</style>

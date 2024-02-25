<script>
  import { createEventDispatcher } from 'svelte';
  import { RGBBackgroundClass } from '../util/classes.js';
  import {
    folderOrderFolder,
    folderOverlayOptionsStore,
    linkOverlayOptionsStore,
    localPresetStore,
  } from '../util/stores.js';
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
    let targetIndex = _getTargetIndex(event);

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
    let targetFolderIndex = _getTargetIndex(event);
    let currPreset = $localPresetStore;

    currPreset.Folders[targetFolderIndex].links.push(
      currPreset.Folders[originFolderIndex].links.splice(originLinkIndex, 1)[0],
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

  function _getTargetIndex(event) {
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
    } else {
      targetIndex = [].slice
        .call(event.target.parentNode.parentNode.children)
        .indexOf(event.target.parentNode);
    }

    return targetIndex;
  }
</script>

<section
  class={$folderOrderFolder === 'fixed' ? 'linkBoxFixed' : 'linkBoxFlexible'}
  draggable={true}
  on:dragstart={(event) => dragStartFolder(event)}
  on:drop|preventDefault={(event) => {
    if (event.dataTransfer.getData('type') === 'folder') {
      dropFolder(event);
    } else if (event.dataTransfer.getData('type') === 'link') {
      dropLink(event);
    }
  }}
  on:dragover={() => false}
  role="presentation"
>
  <div
    class="boxHeader"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : ''}
    on:dblclick={showFolderOverlay}
    role="presentation"
  >
    <p>
      {folderHeader}
    </p>
  </div>

  <button
    class="boxDelBtn"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : ''}
    on:click={() => dispatch('delFolder', id)}
  >
    -
  </button>

  <div class="boxContent">
    {#await $localPresetStore}
      <p>Loading links</p>
    {:then value}
      {#each $localPresetStore.Folders[id].links as { index, linkName, linkUrl }, i}
        <Link
          on:delLink={deleteLink}
          on:editLink={showOverlay}
          linkId={index}
          {linkName}
          {linkUrl}
          on:dragstart={(event) => dragStartLink(event)}
        />
      {/each}
    {:catch error}
      <p>Something went wrong: {error.message}</p>
    {/await}
  </div>

  <button
    class="linkAddBtn"
    style={folderBackgroundColor
      ? `background-color: ${folderBackgroundColor}`
      : ''}
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
    border: solid 3px var(--darkgrey80);

    &:hover {
      box-shadow: 0 0 20px var(--white30);
    }
  }
  .linkBoxFlexible {
    display: grid;
    width: calc(100% / 3);
    grid-template-columns: calc(100% - 50px) 50px;
    grid-template-rows: 2.5rem auto 2rem;
    grid-template-areas:
      'header delBtn'
      'content content'
      'addLinkBtn addLinkBtn';
    border: solid 3px var(--darkgrey80);

    &:hover {
      box-shadow: 0 0 20px var(--white30);
    }

    @media #{$wide} {
      width: calc(100% / 5);
    }

    @media #{$tablet} {
      width: calc(80% / 2);
    }

    @media #{$phone} {
      width: calc(90% / 1);
    }
  }

  .boxHeader {
    grid-area: header;
    display: flex;
    align-items: center;
    font-weight: bolder;
    padding-left: var(--default-padding);
    background-color: var(--darkgrey80);
    text-shadow: var(--sharpen);
    font-size: 18px;
  }

  .boxDelBtn {
    grid-area: delBtn;
    @include mem-button;
    text-align: center;
    font-weight: bolder;
    background-color: var(--darkgrey80);
    border-left: 1px solid var(--white30);
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
    background-color: var(--darkgrey80);
    text-shadow: var(--sharpen);

    &:hover {
      background-color: var(--green);
    }
  }

  .boxContent {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: var(--black30);
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: var(--darkgrey80);
  }

  ::-webkit-scrollbar {
    width: 0px;
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

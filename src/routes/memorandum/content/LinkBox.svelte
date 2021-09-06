<script>
  import Link from "./Link.svelte";
  import { localPreset, linkOverlayOptions } from "../util/stores.js";
  import { createEventDispatcher } from "svelte";
  import { Hyperlink } from "../util/hyperlink.js";

  export let id;
  export let folderHeader;
  const dispatch = createEventDispatcher();
  let links = $localPreset.Folders[id].links;
  let headerText;
  let headerInput;

  function showOverlay(event) {
    $linkOverlayOptions.showOverlay = !$linkOverlayOptions.showOverlay;
    $linkOverlayOptions.currentFolderId = id;
    $linkOverlayOptions.currentFolder = folderHeader;

    if (event.detail) {
      $linkOverlayOptions.currLinkId = event.detail.linkId;
      $linkOverlayOptions.currLinkName = event.detail.linkName;
      $linkOverlayOptions.currLinkUrl = event.detail.linkUrl;
    }
  }

  function toggleRename() {
    if (headerText.style.display !== "none") {
      headerText.style.display = "none";
      headerInput.style.display = "flex";
      headerInput.focus();
    } else {
      headerInput.blur();
      headerInput.style.display = "none";
      headerText.style.display = "flex";
      changeFolderName();
    }
  }

  function changeFolderName() {
    let currPreset = $localPreset;

    currPreset.Folders[id].folderName = folderHeader;

     $localPreset = currPreset;
  }

  function deleteLink(event) {
    let currentPreset = $localPreset;

    currentPreset.Folders[id].links.splice(event.detail, 1);
    _updateLinkIds(currentPreset.Folders[id].links);

    $localPreset = currentPreset;
  }

  function submitNewName(event) {
    if (event.keyCode === 13 || event.keyCode === 27) {
      toggleRename();
    }
  }

  function dragStartFolder(event) {
    event.stopPropagation();
    let originIndex = [].slice
      .call(event.target.parentNode.children)
      .indexOf(event.target);

    event.dataTransfer.setData("type", "folder");
    event.dataTransfer.setData("originIndex", originIndex);
  }
  function dropFolder(event) {
    let originIndex = event.dataTransfer.getData("originIndex");
    let targetIndex = _getTargetIndex(event);

    if (originIndex !== targetIndex) {
      let currPreset = $localPreset;

      currPreset.Folders.splice(
        targetIndex,
        0,
        currPreset.Folders.splice(originIndex, 1)[0]
      );

      $localPreset = currPreset;
    }
  }

  function dragStartLink(event) {
    event.stopPropagation();
    let originFolderIndex;
    let originLinkIndex;

    if (event.target.nodeName !== "DIV") {
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

    event.dataTransfer.setData("type", "link");
    event.dataTransfer.setData("originFolderIndex", originFolderIndex);
    event.dataTransfer.setData("originLinkIndex", originLinkIndex);
  }
  function dropLink(event) {
    let originFolderIndex = event.dataTransfer.getData("originFolderIndex");
    let originLinkIndex = event.dataTransfer.getData("originLinkIndex");
    let targetFolderIndex = _getTargetIndex(event);
    let currPreset = $localPreset;

    currPreset.Folders[targetFolderIndex].links.push(
      currPreset.Folders[originFolderIndex].links.splice(originLinkIndex, 1)[0]
    );

    // updates links ids in array to be reactively updated
    // origin folder
    let originLinks = currPreset.Folders[originFolderIndex].links;
    _updateLinkIds(originLinks);
    // target folder
    let targetLinks = currPreset.Folders[targetFolderIndex].links;
    _updateLinkIds(targetLinks);

    $localPreset = currPreset;
  }

  function _updateLinkIds(links) {
    links.map((link) => (link.id = links.indexOf(link)));
  }

  function _getTargetIndex(event) {
    let targetIndex;

    if (
      event.target.nodeName === "A" ||
      event.target.nodeName === "IMG" ||
      (event.target.previousElementSibling &&
        event.target.previousElementSibling.nodeName === "A")
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
  draggable={true}
  on:dragstart={(event) => dragStartFolder(event)}
  on:drop|preventDefault={(event) => {
    if (event.dataTransfer.getData("type") === "folder") {
      dropFolder(event);
    } else if (event.dataTransfer.getData("type") === "link") {
      dropLink(event);
    }
  }}
  ondragover="return false"
  id="linkBox"
>
  <div class="boxHeader" bind:this={headerText} on:dblclick={toggleRename}>
    <p>
      {folderHeader}
    </p>
  </div>

  <input
    class="boxHeaderEdit"
    maxlength="40"
    bind:this={headerInput}
    placeholder={folderHeader}
    on:blur={toggleRename}
    bind:value={folderHeader}
    on:keyup={(event) => submitNewName(event)}
    onfocus="this.select();"
  />

  <button class="boxDelBtn" on:click={() => dispatch("delFolder", id)}>
    -
  </button>

  <div class="boxContent">
    {#await $localPreset}
      <p>Loading links</p>
    {:then value}
      {#each $localPreset.Folders[id].links as { id, linkName, linkUrl }, i}
        <Link
          on:delLink={deleteLink}
          on:editLink={showOverlay}
          linkId={id}
          {linkName}
          {linkUrl}
          on:dragstart={(event) => dragStartLink(event)}
        />
      {/each}
    {:catch error}
      <p>Something went wrong: {error.message}</p>
    {/await}
  </div>

  <button class="linkAddBtn" on:click={showOverlay}>
    <span>New link</span>
    <span>+</span>
  </button>
</section>

<style type="scss">
  @import "./_mixins.scss";
  @import "./_variables.scss";

  section {
    display: grid;
    height: calc(100% - 40px);
    margin: $defPadding;
    grid-template-columns: calc(100% - 50px) 50px;
    grid-template-rows: 50px calc(90% - 50px) 10%;
    grid-template-areas:
      "header delBtn"
      "content content"
      "addLinkBtn addLinkBtn";
    border: solid 3px $darkgrey80;

    &:hover {
      box-shadow: 0 0 20px $white30;
    }
  }

  :global(body.light-theme) #linkBox {
    border: solid 3px $lightgrey80;
  }

  .boxHeader {
    grid-area: header;
    display: flex;
    align-items: center;
    font-weight: bolder;
    padding-left: $defPadding;
    background-color: $darkgrey80;
    text-shadow: $sharpen;
    font-size: 18px;
  }

  :global(body.light-theme) .boxHeader {
    background-color: $lightgrey80;
  }

  .boxHeaderEdit {
    display: none;
    grid-area: header;
    align-items: center;
    padding-left: $defPadding;
    font-size: 18px;
    height: 100%;
  }

  .boxDelBtn {
    grid-area: delBtn;
    @include mem-button;
    text-align: center;
    font-weight: bolder;
    background-color: $darkgrey80;
    border-left: 1px solid $white30;
    text-shadow: $sharpen;

    &:hover {
      background-color: $red;
    }
  }

  :global(body.light-theme) .boxDelBtn {
    background-color: $lightgrey80;
  }

  .boxContent {
    grid-area: content;
    box-sizing: border-box;
    overflow: auto;
    background-color: $black30;
  }

  :global(body.light-theme) .boxContent {
    background-color: $white30;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: $darkgrey80;
  }

  ::-webkit-scrollbar {
    width: 0px;
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

  .linkAddBtn {
    grid-area: addLinkBtn;
    @include mem-button;
    text-align: left;
    padding-left: $defPadding;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: $darkgrey80;
    text-shadow: $sharpen;

    &:hover {
      background-color: $green;
    }
  }

  :global(body.light-theme) .linkAddBtn {
    background-color: $lightgrey80;
  }
</style>

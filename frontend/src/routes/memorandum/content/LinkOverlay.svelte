<script>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { onMount } from 'svelte';
  import { Hyperlink } from '../util/hyperlink.js';
  import { linkOverlayOptions, localPreset } from '../util/stores.js';

  export let newLinkName = undefined;
  export let newLinkUrl = undefined;

  $: submittable = newLinkName && newLinkUrl;
  let type = $linkOverlayOptions.currLinkName ? 'edit' : 'new';
  let nameInput;

  onMount(() => {
    nameInput.focus();
  });

  function closeOverlay() {
    $linkOverlayOptions.showOverlay = false;
    $linkOverlayOptions.currentFolderId = undefined;
    $linkOverlayOptions.currentFolder = undefined;
    $linkOverlayOptions.currLinkId = undefined;
    $linkOverlayOptions.currLinkName = undefined;
    $linkOverlayOptions.currLinkUrl = undefined;
  }

  function addLink() {
    if (submittable) {
      let currPreset = $localPreset;
      let currLinks =
        currPreset.Folders[$linkOverlayOptions.currentFolderId].links;

      currLinks.push(new Hyperlink(currLinks.length, newLinkName, newLinkUrl));

      $localPreset = currPreset;
      closeOverlay();
    }
  }

  function editLink() {
    if (submittable) {
      let currPreset = $localPreset;
      let currLink =
        currPreset.Folders[$linkOverlayOptions.currentFolderId].links[
          $linkOverlayOptions.currLinkId
        ];

      currLink.linkName = newLinkName;
      currLink.linkUrl = newLinkUrl;

      $localPreset = currPreset;
      closeOverlay();
    }
  }
</script>

<section>
  <button id="exitOverlay" on:click={closeOverlay}> X </button>
  <div id="insertHead">
    {#if type === 'new'}
      <h1>Erstelle einen Link</h1>
    {:else}
      <h1>Bearbeite ''{newLinkName}'' Link</h1>
    {/if}
    <h2>Im Ordner ''{$linkOverlayOptions.currentFolder}''</h2>
  </div>
  <div id="insertContent">
    <input
      bind:this={nameInput}
      maxlength="40"
      type="text"
      bind:value={newLinkName}
      placeholder="Link Name"
      on:keyup={(event) => {
        if (event.keyCode === 13) {
          type === 'new' ? addLink() : editLink();
        }
      }}
    />

    <input
      type="text"
      bind:value={newLinkUrl}
      placeholder="Link URL"
      on:keyup={(event) => {
        if (event.keyCode === 13) {
          type === 'new' ? addLink : editLink;
        }
      }}
    />
  </div>
  <button
    id="submitOverlay"
    class={!submittable ? 'disabled' : 'enabled'}
    on:click={type === 'new' ? addLink : editLink}
    disabled={!submittable}
  >
    Speichern
  </button>
</section>
<svelte:window
  on:keyup={(event) => (event.keyCode === 27 ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  @import '$lib/styles/_variables.scss';
  @import '$lib/styles/mixins.scss';

  section {
    position: fixed;
    display: grid;
    width: 100%;
    height: 100%;
    background-color: $darkgrey90;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    grid-template-columns: 1fr;
    grid-template-rows: 45% 35% 20%;
    grid-template-areas: 'header' 'input' 'submit';
    justify-items: center;
  }

  #exitOverlay {
    background-color: $red70;
    padding: 12px 18px;
    color: white;
    font-size: 18px;
    border: solid 0px;
    box-shadow: $sharpen;
    position: absolute;
    top: 0;
    right: 0;

    &:hover {
      background-color: $red;
    }
  }

  #insertHead {
    grid-area: header;
    color: white;
    text-align: center;
    padding-top: 100px;

    h1 {
      font-size: 48px;
    }

    h2 {
      font-size: 34px;
    }
  }

  #insertContent {
    grid-area: input;
    width: 100%;
    padding-top: 50px;
    text-align: center;
  }

  input {
    position: relative;
    width: 75%;
    height: 50px;
    font-size: 18px;
    text-align: center;
    margin: 20px 0 20px 0;
    outline: none;

    &:focus {
      background-color: $lightgrey80;
      color: $light80;
      border: solid 1px white;
      &::placeholder {
        color: $light80;
      }
    }
  }

  #submitOverlay {
    grid-area: submit;
    padding: 12px 18px;
    color: white;
    font-size: 32px;
    border: none;
    position: relative;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 100px;
  }

  .disabled {
    background-color: $white30;
  }

  .enabled {
    background-color: $red70;
    box-shadow: 2px 2px $red70;

    &:hover {
      background-color: $red;
    }
  }
</style>

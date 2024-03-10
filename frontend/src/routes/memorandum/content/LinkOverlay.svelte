<script>
  import { isEnter } from '$lib/util/helper.js';
  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import { HyperlinkClass } from '../util/classes.js';
  import { linkOverlayOptionsStore, localPresetStore } from '../util/stores.js';

  export let newLinkName = '';
  export let newLinkUrl = '';

  $: submittable = newLinkName && newLinkUrl;
  let type = $linkOverlayOptionsStore.currLinkName ? 'edit' : 'new';
  let nameInput;

  onMount(() => {
    nameInput.focus();
  });

  function closeOverlay() {
    $linkOverlayOptionsStore.showOverlay = false;
    $linkOverlayOptionsStore.currentFolderId = undefined;
    $linkOverlayOptionsStore.currentFolder = undefined;
    $linkOverlayOptionsStore.currLinkId = undefined;
    $linkOverlayOptionsStore.currLinkName = undefined;
    $linkOverlayOptionsStore.currLinkUrl = undefined;
  }

  function addLink() {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links;

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
      );

      $localPresetStore = currPreset;
      closeOverlay();
    }
  }

  function editLink() {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLink =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links[
          $linkOverlayOptionsStore.currLinkId
        ];

      currLink.linkName = newLinkName;
      currLink.linkUrl = newLinkUrl;

      $localPresetStore = currPreset;
      closeOverlay();
    }
  }

  function duplicateLink() {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links;

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
      );

      $localPresetStore = currPreset;
      closeOverlay();
    }
  }
</script>

<Dialog
  bind:open={$linkOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if type === 'new'}
    <Title id="simple-title">
      Erstelle einen Link
      <p class="subtitle">
        Lege hier einen neuen Link im Ordner <b
          >{$linkOverlayOptionsStore.currentFolder}</b
        > an. Füge hierzu den Namen und die URL des Links ein.
      </p>
    </Title>
  {:else}
    <Title id="simple-title">
      Bearbeite den Link: {newLinkName}
      <p class="subtitle">
        Bearbeite hier den Link <b>{newLinkName}</b> im Ordner
        <b>{$linkOverlayOptionsStore.currentFolder}</b>.
      </p>
    </Title>
  {/if}
  <Content id="simple-content">
    <Textfield
      variant="outlined"
      bind:this={nameInput}
      bind:value={newLinkName}
      label="Name"
      style="margin-top: 1rem; width: 100%"
      on:keyup={(event) => {
        if (isEnter(event)) {
          type === 'new' ? addLink() : editLink();
        }
      }}
    >
      <Icon class="material-icons" slot="leadingIcon">text_format</Icon>
      <HelperText slot="helper">Name des Links</HelperText>
    </Textfield>
    <Textfield
      variant="outlined"
      bind:value={newLinkUrl}
      label="URL"
      style="margin-top: 1rem; width: 100%"
      on:keyup={(event) => {
        if (isEnter(event)) {
          type === 'new' ? addLink() : editLink();
        }
      }}
    >
      <Icon class="material-icons" slot="leadingIcon">link</Icon>
      <HelperText slot="helper">URL des Links</HelperText>
    </Textfield>
  </Content>
  <Actions>
    {#if type === 'edit'}
      <Button on:click={duplicateLink}>
        <Icon class="material-icons">content_copy</Icon>
        <Label>Duplizieren</Label>
      </Button>
    {/if}
    <Button on:click={closeOverlay}>
      <Icon class="material-icons">link_off</Icon>
      <Label>Abbruch</Label>
    </Button>
    <Button
      on:click={type === 'new' ? addLink : editLink}
      disabled={!submittable}
    >
      <Icon class="material-icons"
        >{type === 'new' ? 'bookmark_add' : 'save'}</Icon
      >
      <Label>Speichern</Label>
    </Button>
  </Actions>
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .subtitle {
    font-size: 1rem;
  }
</style>

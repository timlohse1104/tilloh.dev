<script>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import { HyperlinkClass } from '../util/classes.js';
  import { linkOverlayOptions, localPreset } from '../util/stores.js';

  export let newLinkName = '';
  export let newLinkUrl = '';

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

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
      );

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

  function duplicateLink() {
    if (submittable) {
      let currPreset = $localPreset;
      let currLinks =
        currPreset.Folders[$linkOverlayOptions.currentFolderId].links;

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
      );

      $localPreset = currPreset;
      closeOverlay();
    }
  }
</script>

<Dialog
  bind:open={$linkOverlayOptions.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if type === 'new'}
    <Title id="simple-title">
      Erstelle einen Link
      <p class="subtitle">
        Lege hier einen neuen Link im Ordner <b
          >{$linkOverlayOptions.currentFolder}</b
        > an. Füge hierzu den Namen und die URL des Links ein.
      </p>
    </Title>
  {:else}
    <Title id="simple-title">
      Bearbeite den Link: {newLinkName}
      <p class="subtitle">
        Bearbeite hier den Link <b>{newLinkName}</b> im Ordner
        <b>{$linkOverlayOptions.currentFolder}</b>.
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
        if (event.code === 'Enter') {
          type === 'new' ? addLink() : editLink();
        }
      }}
    >
      <Icon class="material-icons" slot="leadingIcon">tag</Icon>
      <HelperText slot="helper">Name des Links</HelperText>
    </Textfield>
    <Textfield
      variant="outlined"
      bind:value={newLinkUrl}
      label="URL"
      style="margin-top: 1rem; width: 100%"
      on:keyup={(event) => {
        if (event.code === 'Enter') {
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
      <Label>Abbruch</Label>
    </Button>
    <Button
      on:click={type === 'new' ? addLink : editLink}
      disabled={!submittable}
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

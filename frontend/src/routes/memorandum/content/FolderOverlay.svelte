<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import { folderOverlayOptions, localPreset } from '../util/stores.js';

  export let folderName = '';

  $: submittable = folderName;

  let nameInput;

  onMount(() => {
    nameInput.focus();
  });

  function closeOverlay() {
    $folderOverlayOptions.showOverlay = false;
    $folderOverlayOptions.currentFolderId = undefined;
  }

  function editFolder() {
    if (submittable) {
      let currentPreset = $localPreset;
      currentPreset.Folders[$folderOverlayOptions.currentFolderId].folderName =
        folderName;

      $localPreset = currentPreset;
      closeOverlay();
    }
  }

  function duplicateFolder() {
    if (submittable) {
      let currentPreset = $localPreset;
      let currentFolder = {
        ...currentPreset.Folders[$folderOverlayOptions.currentFolderId],
      };

      currentFolder.id = currentPreset.Folders.length;
      currentFolder.folderName = `(Kopie) ${folderName}`;

      currentPreset.Folders.push(currentFolder);

      $localPreset = currentPreset;
      closeOverlay();
    }
  }
</script>

<Dialog
  bind:open={$folderOverlayOptions.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">
    Bearbeite den Ordner: {folderName}
  </Title>

  <Content id="simple-content">
    <Textfield
      variant="outlined"
      bind:this={nameInput}
      bind:value={folderName}
      label="Name"
      style="margin-top: 1rem; width: 100%"
      on:keyup={(event) => {
        if (event.code === 'Enter') {
          editFolder();
        }
      }}
    >
      <Icon class="material-icons" slot="leadingIcon">tag</Icon>
      <HelperText slot="helper">Name des Ordners</HelperText>
    </Textfield>
  </Content>
  <Actions>
    <Button on:click={duplicateFolder}>
      <Icon class="material-icons">content_copy</Icon>
      <Label>Duplizieren</Label>
    </Button>
    <Button on:click={closeOverlay}>
      <Label>Abbruch</Label>
    </Button>
    <Button on:click={editFolder} disabled={!submittable}>
      <Label>Speichern</Label>
    </Button>
  </Actions>
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

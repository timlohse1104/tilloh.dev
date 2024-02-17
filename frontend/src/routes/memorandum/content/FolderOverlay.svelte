<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import FormField from '@smui/form-field';
  import IconButton from '@smui/icon-button';
  import Slider from '@smui/slider';
  import Snackbar from '@smui/snackbar';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import { RGBBackgroundClass } from '../util/classes.js';
  import { defaultColor } from '../util/constants.js';
  import {
    folderOverlayOptionsStore,
    localPresetStore,
  } from '../util/stores.js';

  export let folderName = '';

  let nameInput;
  let customColorActive = false;
  let customColor = defaultColor;
  let colorCopySnackbar: Snackbar;
  let customColorInput = '';

  $: submittable = folderName;
  $: if (!customColorActive) {
    customColor = defaultColor;
  }
  $: customColorString = customColor.getRGBAValues();

  onMount(() => {
    nameInput.focus();
    if ($folderOverlayOptionsStore.currentFolderBackgroundColor) {
      customColor = new RGBBackgroundClass(
        $folderOverlayOptionsStore.currentFolderBackgroundColor,
      );
      const persistedColor =
        $folderOverlayOptionsStore.currentFolderBackgroundColor;
      customColorActive =
        persistedColor.r !== defaultColor.r ||
        persistedColor.g !== defaultColor.g ||
        persistedColor.b !== defaultColor.b ||
        persistedColor.a !== defaultColor.a;
    }
  });

  function closeOverlay() {
    $folderOverlayOptionsStore.showOverlay = false;
    $folderOverlayOptionsStore.currentFolderId = undefined;
  }

  function editFolder() {
    if (submittable) {
      let currentPreset = $localPresetStore;
      currentPreset.Folders[
        $folderOverlayOptionsStore.currentFolderId
      ].folderName = folderName;
      currentPreset.Folders[
        $folderOverlayOptionsStore.currentFolderId
      ].customBackgroundColor = { ...customColor };

      $localPresetStore = currentPreset;
      closeOverlay();
    }
  }

  function duplicateFolder() {
    if (submittable) {
      let currentPreset = $localPresetStore;
      let currentFolder = {
        ...currentPreset.Folders[$folderOverlayOptionsStore.currentFolderId],
      };

      currentFolder.id = currentPreset.Folders.length;
      currentFolder.folderName = `(Kopie) ${folderName}`;

      currentPreset.Folders.push(currentFolder);

      $localPresetStore = currentPreset;
      closeOverlay();
    }
  }

  async function copyColorToClipboard() {
    try {
      await navigator.clipboard.writeText(customColor.getRGBAValues());
      colorCopySnackbar.open();
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  }

  function updateCustomColorFromInput() {
    const splitted = customColorInput.split(',');
    if (splitted.length === 4) {
      const r = parseInt(splitted[0]);
      const g = parseInt(splitted[1]);
      const b = parseInt(splitted[2]);
      const a = parseFloat(splitted[3]);
      customColor = new RGBBackgroundClass({ r, g, b, a });
    }
  }
</script>

<Dialog
  bind:open={$folderOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">
    Bearbeite den Ordner: {folderName}
  </Title>

  <Content id="simple-content" style="background-color:{customColor.getRGBA()}">
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

    <FormField>
      <Checkbox bind:checked={customColorActive} />
      <span slot="label">Hintergrundfarbe selbst bestimmen?</span>
    </FormField>

    {#if customColorActive}
      <FormField align="end" style="display: flex;">
        <Slider
          style="flex-grow: 1;"
          min="0"
          max="255"
          bind:value={customColor.r}
        />
        <span
          slot="label"
          style="padding-right: 12px; width: 1rem; display: block;"
        >
          Rot
        </span>
      </FormField>
      <FormField align="end" style="display: flex;">
        <Slider
          style="flex-grow: 1;"
          min="0"
          max="255"
          bind:value={customColor.g}
        />
        <span
          slot="label"
          style="padding-right: 12px; width: 1rem; display: block;"
        >
          Grün
        </span>
      </FormField>
      <FormField align="end" style="display: flex;">
        <Slider
          style="flex-grow: 1;"
          min="0"
          max="255"
          bind:value={customColor.b}
        />
        <span
          slot="label"
          style="padding-right: 12px; width: 1rem; display: block;"
        >
          Blau
        </span>
      </FormField>
      <FormField align="end" style="display: flex;">
        <Slider
          style="flex-grow: 1;"
          min="0"
          max="1"
          step={0.01}
          bind:value={customColor.a}
        />
        <span
          slot="label"
          style="padding-right: 12px; width: 1rem; display: block;"
        >
          Alpha
        </span>
      </FormField>

      <div style="display: flex;">
        <div style="margin-right: 1rem;">
          <Textfield bind:value={customColorString} label="Aktuelle Werte">
            <IconButton
              class="material-icons"
              slot="trailingIcon"
              on:click={copyColorToClipboard}
            >
              content_copy
            </IconButton>
            <HelperText slot="helper">Format: "rot,grün,blau,alpha"</HelperText>
          </Textfield>
        </div>
        <div>
          <Textfield bind:value={customColorInput} label="Neue Werte">
            <IconButton
              class="material-icons"
              slot="trailingIcon"
              on:click={updateCustomColorFromInput}
            >
              change_circle
            </IconButton>
            <HelperText slot="helper">Format: "rot,grün,blau,alpha"</HelperText>
          </Textfield>
        </div>
      </div>
    {/if}

    <Snackbar bind:this={colorCopySnackbar}>
      <Label>Farbwerte kopiert.</Label>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
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

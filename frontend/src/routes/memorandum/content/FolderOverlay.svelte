<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import Button, { Label } from '@smui/button';
  import Checkbox from '@smui/checkbox';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import FormField from '@smui/form-field';
  import Slider from '@smui/slider';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import { RGBBackgroundClass } from '../util/classes.js';
  import { folderOverlayOptions, localPreset } from '../util/stores.js';

  export let folderName = '';

  const defaultColor = new RGBBackgroundClass({ r: 34, g: 34, b: 34, a: 0.8 });

  let nameInput;
  let customColorActive = false;
  let customColor = defaultColor;

  $: submittable = folderName;
  $: if (!customColorActive) {
    customColor = defaultColor;
  }

  onMount(() => {
    nameInput.focus();
    if ($folderOverlayOptions.currentFolderBackgroundColor) {
      customColor = new RGBBackgroundClass(
        $folderOverlayOptions.currentFolderBackgroundColor,
      );
      const persistedColor = $folderOverlayOptions.currentFolderBackgroundColor;
      customColorActive =
        persistedColor.r !== defaultColor.r ||
        persistedColor.g !== defaultColor.g ||
        persistedColor.b !== defaultColor.b ||
        persistedColor.a !== defaultColor.a;
    }
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
      currentPreset.Folders[
        $folderOverlayOptions.currentFolderId
      ].customBackgroundColor = { ...customColor };

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
    {/if}
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

<script lang="ts">
  import { isEnter } from '$lib/util/helper.js';
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import { defaultColor } from '$lib/util/memorandum/constants.js';
  import {
    folderOverlayOptionsStore,
    localPresetStore,
  } from '$lib/util/memorandum/stores.js';
  import { initialized, t } from '$lib/util/translations';
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

  export let folderName = '';

  let nameInput;
  let customColorActive = false;
  let customColor = defaultColor;
  let colorCopySnackbar: Snackbar;
  let customColorInput = '';
  let saveButton;

  $: submittable = folderName;
  $: if (!customColorActive) {
    customColor = defaultColor;
  }
  $: customColorString = customColor.getRGBAValues();
  $: if (saveButton) {
    saveButton.$$set({
      disabled: !submittable,
    });
  }

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

  const closeOverlay = () => {
    $folderOverlayOptionsStore.showOverlay = false;
    $folderOverlayOptionsStore.currentFolderId = undefined;
  };

  const editFolder = () => {
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
  };

  const duplicateFolder = () => {
    if (submittable) {
      let currentPreset = $localPresetStore;
      let currentFolder = {
        ...currentPreset.Folders[$folderOverlayOptionsStore.currentFolderId],
      };

      const duplicatedFolder = JSON.parse(JSON.stringify(currentFolder));
      duplicatedFolder.id = currentPreset.Folders.length;
      duplicatedFolder.folderName = $t('page.memorandum.folder.copiedName', {
        folderName,
      });

      currentPreset.Folders.push(duplicatedFolder);

      $localPresetStore = currentPreset;
      closeOverlay();
    }
  };

  const copyColorToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customColor.getRGBAValues());
      colorCopySnackbar.open();
    } catch (err) {
      console.error('Could not copy text: ', err);
    }
  };

  const updateCustomColorFromInput = () => {
    const splitted = customColorInput.split(',');
    if (splitted.length === 4) {
      const r = parseInt(splitted[0]);
      const g = parseInt(splitted[1]);
      const b = parseInt(splitted[2]);
      const a = parseFloat(splitted[3]);
      customColor = new RGBBackgroundClass({ r, g, b, a });
    }
  };
</script>

<Dialog
  bind:open={$folderOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if $initialized}
    <Title id="simple-title">
      {$t('page.memorandum.folder.editTitle', { folderName })}
    </Title>

    <Content
      id="simple-content"
      style="background-color:{customColor.getRGBA()}"
    >
      <Textfield
        variant="outlined"
        bind:this={nameInput}
        bind:value={folderName}
        label="Name"
        style="margin-top: 1rem; width: 100%"
        on:keyup={(event) => {
          if (isEnter(event)) editFolder();
        }}
      >
        <Icon class="material-icons" slot="leadingIcon">text_format</Icon>
        <HelperText slot="helper">
          {$t('page.memorandum.folder.nameOfFolderHelptext')}
        </HelperText>
      </Textfield>

      <FormField>
        <Checkbox bind:checked={customColorActive} />
        <Icon class="material-icons">brush</Icon>
        <span slot="label">
          {$t('page.memorandum.folder.setBackgroundColorQuestion', {
            folderName,
          })}
        </span>
      </FormField>

      {#if customColorActive}
        <FormField align="end" style="display: flex;">
          <Slider
            style="flex-grow: 1;"
            min={0}
            max={255}
            bind:value={customColor.r}
          />
          <span
            slot="label"
            style="padding-right: 12px; width: 1rem; display: block;"
          >
            {$t('page.shared.red')}
          </span>
        </FormField>
        <FormField align="end" style="display: flex;">
          <Slider
            style="flex-grow: 1;"
            min={0}
            max={255}
            bind:value={customColor.g}
          />
          <span
            slot="label"
            style="padding-right: 12px; width: 1rem; display: block;"
          >
            {$t('page.shared.green')}
          </span>
        </FormField>
        <FormField align="end" style="display: flex;">
          <Slider
            style="flex-grow: 1;"
            min={0}
            max={255}
            bind:value={customColor.b}
          />
          <span
            slot="label"
            style="padding-right: 12px; width: 1rem; display: block;"
          >
            {$t('page.shared.blue')}
          </span>
        </FormField>
        <FormField align="end" style="display: flex;">
          <Slider
            style="flex-grow: 1;"
            min={0}
            max={1}
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
            <Textfield
              bind:value={customColorString}
              label={$t('page.memorandum.folder.currentValues')}
            >
              <IconButton
                class="material-icons"
                slot="trailingIcon"
                on:click={copyColorToClipboard}
              >
                content_copy
              </IconButton>
              <HelperText slot="helper">Format: "r,g,b,a"</HelperText>
            </Textfield>
          </div>
          <div>
            <Textfield
              bind:value={customColorInput}
              label={$t('page.memorandum.folder.newValues')}
            >
              <IconButton
                class="material-icons"
                slot="trailingIcon"
                on:click={updateCustomColorFromInput}
              >
                change_circle
              </IconButton>
              <HelperText slot="helper">Format: "r,g,b,a"</HelperText>
            </Textfield>
          </div>
        </div>
      {/if}

      <Snackbar bind:this={colorCopySnackbar}>
        <Label>
          {$t('page.memorandum.folder.copiedColorValues')}
        </Label>
        <Actions>
          <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
      </Snackbar>
    </Content>
    <Actions>
      <Button on:click={duplicateFolder}>
        <Icon class="material-icons">content_copy</Icon>
        <Label>
          {$t('page.shared.duplicate', {
            folderName,
          })}
        </Label>
      </Button>
      <Button on:click={closeOverlay}>
        <Icon class="material-icons">folder_off</Icon>
        <Label>
          {$t('page.shared.abort', {
            folderName,
          })}
        </Label>
      </Button>
      <Button bind:this={saveButton} on:click={editFolder}>
        <Icon class="material-icons">save</Icon>
        <Label>
          {$t('page.shared.save', {
            folderName,
          })}
        </Label>
      </Button>
    </Actions>
  {:else}
    <Title id="simple-title">Locale initializing...</Title>
  {/if}
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<script lang="ts">
  import { isEnter } from '$lib/util/helper.js';
  import { RGBBackgroundClass } from '$lib/util/memorandum/classes.js';
  import { defaultColor } from '$lib/util/memorandum/constants.js';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { folderOverlayOptionsStore } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import Slider from 'carbon-components-svelte/src/Slider/Slider.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { onMount } from 'svelte';

  let { folderName = $bindable('') } = $props();

  let customColorActive = $state(false);
  let r = $state(defaultColor.r);
  let g = $state(defaultColor.g);
  let b = $state(defaultColor.b);
  let a = $state(defaultColor.a);
  let customColorInput = $state('');

  const submittable = $derived(folderName);
  const customColor = $derived(new RGBBackgroundClass({ r, g, b, a }));
  const customColorString = $derived(customColor.getRGBAValues());

  $effect(() => {
    if (!customColorActive) {
      r = defaultColor.r;
      g = defaultColor.g;
      b = defaultColor.b;
      a = defaultColor.a;
    }
  });

  onMount(() => {
    if ($folderOverlayOptionsStore.currentFolderBackgroundColor) {
      const persisted = $folderOverlayOptionsStore.currentFolderBackgroundColor;
      r = persisted.r;
      g = persisted.g;
      b = persisted.b;
      a = persisted.a;
      customColorActive =
        persisted.r !== defaultColor.r ||
        persisted.g !== defaultColor.g ||
        persisted.b !== defaultColor.b ||
        persisted.a !== defaultColor.a;
    }
  });

  const closeOverlay = () => {
    $folderOverlayOptionsStore.showOverlay = false;
    $folderOverlayOptionsStore.currentFolderId = undefined;
  };
  const editFolder = () => {
    if (submittable) {
      const currentPreset = structuredClone($localPresetStore);

      currentPreset.Folders.find(
        (f) => f.id === $folderOverlayOptionsStore.currentFolderId,
      ).folderName = folderName;

      currentPreset.Folders.find(
        (f) => f.id === $folderOverlayOptionsStore.currentFolderId,
      ).customBackgroundColor = { r, g, b, a };

      $localPresetStore = currentPreset;
      closeOverlay();
    }
  };
  const updateCustomColorFromInput = () => {
    const splitted = customColorInput.split(',');
    if (splitted.length === 4) {
      r = parseInt(splitted[0]);
      g = parseInt(splitted[1]);
      b = parseInt(splitted[2]);
      a = parseFloat(splitted[3]);
    }
  };
</script>

<Modal
  bind:open={$folderOverlayOptionsStore.showOverlay}
  modalHeading={$t('page.memorandum.folder.editTitle', { folderName })}
  primaryButtonText={$t('page.shared.save')}
  primaryButtonIcon={Save}
  secondaryButtonText={$t('page.shared.abort')}
  on:click:button--primary={editFolder}
  on:click:button--secondary={closeOverlay}
  style="background-color:{customColor.getRGBA()}"
  hasScrollingContent
>
  {#if $initialized}
    <TextInput
      bind:value={folderName}
      labelText="Name"
      placeholder={$t('page.memorandum.folder.nameOfFolderHelptext')}
      autofocus
      class="mb1"
      on:keyup={(event) => {
        if (isEnter(event)) editFolder();
      }}
    />

    <Checkbox
      bind:checked={customColorActive}
      labelText={$t('page.memorandum.folder.setBackgroundColorQuestion', {
        folderName,
      })}
    />

    {#if customColorActive}
      <div class="color_settings">
        <div class="color_preview_row">
          <div
            class="color_preview_box"
            style="background-color: {customColor.getRGBA()}"
          ></div>
          <div class="color_preview_text">
            <p class="color_preview_label">{$t('page.memorandum.folder.colorPreviewLabel')}</p>
            <p class="color_preview_description">{$t('page.memorandum.folder.colorPreviewDescription')}</p>
          </div>
        </div>

        <Slider
          bind:value={r}
          labelText={$t('page.shared.red')}
          min={0}
          max={255}
          fullWidth
        />
        <Slider
          bind:value={g}
          labelText={$t('page.shared.green')}
          min={0}
          max={255}
          fullWidth
        />
        <Slider
          bind:value={b}
          labelText={$t('page.shared.blue')}
          min={0}
          max={255}
          fullWidth
        />
        <Slider
          bind:value={a}
          labelText="Alpha"
          min={0}
          max={1}
          step={0.01}
          fullWidth
        />

        <div class="mb1 folder_color_value_fields">
          <div class="folder_color_value_setting_fields">
            <TextInput
              value={customColorString}
              readonly
              labelText={$t('page.memorandum.folder.currentValues')}
              placeholder={$t('page.memorandum.folder.currentValues')}
              helperText="Format: 'r,g,b,a'"
            />
            <CopyButton
              text={customColorString}
              iconDescription={$t('page.memorandum.folder.copyColorValues')}
            />
          </div>
          <div class="folder_color_value_input_fields">
            <TextInput
              bind:value={customColorInput}
              labelText={$t('page.memorandum.folder.newValues')}
              placeholder={$t('page.memorandum.folder.newValues')}
              helperText="Format: 'r,g,b,a'"
              on:keyup={(event) => {
                if (isEnter(event)) {
                  updateCustomColorFromInput();
                }
              }}
            />
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

<svelte:window
  onkeyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  .color_settings {
    margin-top: 1rem;
  }

  .color_preview_row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .color_preview_box {
    width: 5rem;
    height: 5rem;
    flex-shrink: 0;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    transition: background-color 0.1s ease;
  }

  .color_preview_text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .color_preview_label {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .color_preview_description {
    margin: 0;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.4;
  }

  .folder_color_value_fields {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    @media #{$phone} {
      flex-wrap: wrap;
    }
  }

  .folder_color_value_setting_fields {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .folder_color_value_input_fields {
    flex: 1;
  }
</style>

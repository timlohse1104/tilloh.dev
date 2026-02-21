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
  import PaintBrush from 'carbon-icons-svelte/lib/PaintBrush.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { onMount } from 'svelte';

  let { folderName = $bindable('') } = $props();

  let customColorActive = $state(false);
  let customColor = $state(defaultColor);
  let customColorInput = $state('');

  const submittable = $derived(folderName);
  const customColorString = $derived(customColor.getRGBAValues());

  $effect(() => {
    if (!customColorActive) {
      customColor = defaultColor;
    }
  });

  onMount(() => {
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
      const currentPreset = structuredClone($localPresetStore);

      currentPreset.Folders.find(
        (f) => f.id === $folderOverlayOptionsStore.currentFolderId,
      ).folderName = folderName;

      currentPreset.Folders.find(
        (f) => f.id === $folderOverlayOptionsStore.currentFolderId,
      ).customBackgroundColor = { ...customColor };

      $localPresetStore = currentPreset;
      closeOverlay();
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

<Modal
  bind:open={$folderOverlayOptionsStore.showOverlay}
  modalHeading={$t('page.memorandum.folder.editTitle', { folderName })}
  primaryButtonText={$t('page.shared.save')}
  primaryButtonIcon={Save}
  secondaryButtonText={$t('page.shared.abort')}
  on:click:button--primary={editFolder}
  on:click:button--secondary={closeOverlay}
  style="background-color:{customColor.getRGBA()}"
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

    <Checkbox bind:checked={customColorActive}>
      <svelte:fragment slot="labelText">
        <PaintBrush />
        {$t('page.memorandum.folder.setBackgroundColorQuestion', {
          folderName,
        })}
      </svelte:fragment>
    </Checkbox>

    {#if customColorActive}
      <Slider
        bind:value={customColor.r}
        labelText={$t('page.shared.red')}
        min={0}
        max={255}
        fullWidth
      />
      <Slider
        bind:value={customColor.g}
        labelText={$t('page.shared.green')}
        min={0}
        max={255}
        fullWidth
      />
      <Slider
        bind:value={customColor.b}
        labelText={$t('page.shared.blue')}
        min={0}
        max={255}
        fullWidth
      />
      <Slider
        bind:value={customColor.a}
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
    {/if}
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

<svelte:window
  onkeyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .folder_color_value_fields {
    display: flex;
    justify-content: center;
    align-items: start;
    gap: 1rem;
  }

  .folder_color_value_setting_fields {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

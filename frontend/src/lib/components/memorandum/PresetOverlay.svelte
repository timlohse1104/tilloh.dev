<script lang="ts">
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { presetOverlayOptionsStore } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CodeSnippet from 'carbon-components-svelte/src/CodeSnippet/CodeSnippet.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import TextArea from 'carbon-components-svelte/src/TextArea/TextArea.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
  import Folder from 'carbon-icons-svelte/lib/Folder.svelte';
  import Link from 'carbon-icons-svelte/lib/Link.svelte';
  import Reset from 'carbon-icons-svelte/lib/Reset.svelte';
  import Upload from 'carbon-icons-svelte/lib/Upload.svelte';
  import WarningAlt from 'carbon-icons-svelte/lib/WarningAlt.svelte';
  import { fade } from 'svelte/transition';

  let files: FileList = $state();
  let configFileInput: HTMLInputElement = $state();
  let timeout = $state(undefined);
  let isEditMode = $state(false);
  let editedJson = $state('');
  let jsonError = $state('');
  let isValidJson = $state(true);
  let successTimeout = $state(undefined);

  const showNotification = $derived(timeout !== undefined);
  const showSuccessNotification = $derived(successTimeout !== undefined);
  const folderAmount = $derived($localPresetStore.Folders.length);
  const linkAmount = $derived([
    ...$localPresetStore.Folders.map((folder) => folder.links.length),
  ].reduce((a, b) => a + b, 0));

  $effect(() => {
    if (showNotification) celebrate();
  });

  $effect(() => {
    if (showSuccessNotification) celebrate();
  });

  $effect(() => {
    if (files) {
      const file = files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target.result.toString();
          const json = JSON.parse(result);
          $localPresetStore = json;
        };
        reader.readAsText(file);
        timeout = 3_000;
      }
    }
  });

  const closeOverlay = () => {
    $presetOverlayOptionsStore.showOverlay = false;
  };
  const triggerFileSelect = () => {
    configFileInput.click();
  };
  const triggerFileDownload = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify($localPresetStore, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    const date = new Date();
    downloadAnchorNode.setAttribute(
      'download',
      `memorandum-config-${date.toLocaleDateString()}.json`,
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const toggleEditMode = () => {
    if (!isEditMode) {
      // Entering edit mode - initialize with current preset
      editedJson = JSON.stringify($localPresetStore, null, 2);
      validateJson();
    }
    isEditMode = !isEditMode;
  };

  const validateJson = () => {
    try {
      JSON.parse(editedJson);
      jsonError = '';
      isValidJson = true;
    } catch (error) {
      jsonError = error.message;
      isValidJson = false;
    }
  };

  const handleJsonInput = () => {
    validateJson();
  };

  const applyChanges = () => {
    if (isValidJson) {
      try {
        const parsedPreset = JSON.parse(editedJson);
        $localPresetStore = parsedPreset;
        successTimeout = 3_000;
        isEditMode = false;
      } catch (error) {
        jsonError = error.message;
        isValidJson = false;
      }
    }
  };

  const resetChanges = () => {
    editedJson = JSON.stringify($localPresetStore, null, 2);
    validateJson();
  };
</script>

<section>
  <Modal
    bind:open={$presetOverlayOptionsStore.showOverlay}
    modalHeading={$t('page.memorandum.presetOverlay.title')}
    primaryButtonText="Import"
    primaryButtonIcon={Upload}
    secondaryButtonText="Export"
    hasScrollingContent
    class="preset_modal"
    on:click:button--primary={() => {
      triggerFileSelect();
      event.stopPropagation();
    }}
    on:click:button--secondary={triggerFileDownload}
  >
    {#if $initialized}
      <p class="mb1">{$t('page.memorandum.presetOverlay.description')}</p>
      <h5>{$t('page.memorandum.presetOverlay.currentConfigTitle')}</h5>

      <div class="preset_info_area">
        <Tag icon={Folder} type="teal">
          {$t('page.memorandum.presetOverlay.folderAmount', {
            amount: folderAmount,
          })}
        </Tag>
        <Tag icon={Link} type="green">
          {$t('page.memorandum.presetOverlay.linkAmount', {
            amount: linkAmount,
          })}
        </Tag>
      </div>

      <div class="edit_toggle_container">
        <Toggle
          labelA={$t('page.memorandum.presetOverlay.viewMode')}
          labelB={$t('page.memorandum.presetOverlay.editMode')}
          toggled={isEditMode}
          on:toggle={toggleEditMode}
        />
      </div>

      <Accordion class="mt2">
        <AccordionItem
          title={$t('page.memorandum.presetOverlay.technicalInfoTitle')}
          class="custom_accordion_content"
          open
        >
          {#if !isEditMode}
            <CodeSnippet
              type="multi"
              code={JSON.stringify($localPresetStore, null, 2)}
              copyLabel={$t(
                'page.memorandum.presetOverlay.copyButtonDescription',
              )}
            />
          {:else}
            <div class="edit_container">
              <TextArea
                bind:value={editedJson}
                placeholder={$t('page.memorandum.presetOverlay.editPlaceholder')}
                rows={20}
                on:input={handleJsonInput}
                class="json_editor"
              />
              <div class="validation_indicator">
                {#if isValidJson}
                  <Tag type="green" icon={Checkmark}>
                    {$t('page.memorandum.presetOverlay.validJson')}
                  </Tag>
                {:else}
                  <Tag type="red" icon={WarningAlt}>
                    {$t('page.memorandum.presetOverlay.invalidJson')}
                  </Tag>
                  {#if jsonError}
                    <p class="error_message">{jsonError}</p>
                  {/if}
                {/if}
              </div>
              <div class="edit_actions">
                <Button
                  kind="primary"
                  icon={Checkmark}
                  disabled={!isValidJson}
                  on:click={applyChanges}
                >
                  {$t('page.memorandum.presetOverlay.applyChanges')}
                </Button>
                <Button kind="secondary" icon={Reset} on:click={resetChanges}>
                  {$t('page.memorandum.presetOverlay.resetChanges')}
                </Button>
              </div>
            </div>
          {/if}
        </AccordionItem>
      </Accordion>
    {:else}
      <p>Locale initializing...</p>
    {/if}
  </Modal>
</section>

{#if showNotification}
  <div transition:fade>
    <InlineNotification
      {timeout}
      kind="info-square"
      lowContrast
      subtitle={$t('page.memorandum.presetOverlay.configImportedLabel')}
      class="inline_notification"
      on:close={(e) => {
        timeout = undefined;
      }}
    />
  </div>
{/if}

{#if showSuccessNotification}
  <div transition:fade>
    <InlineNotification
      timeout={successTimeout}
      kind="success"
      lowContrast
      subtitle={$t('page.memorandum.presetOverlay.changesApplied')}
      class="inline_notification"
      on:close={(e) => {
        successTimeout = undefined;
      }}
    />
  </div>
{/if}

<input
  bind:this={configFileInput}
  type="file"
  bind:files
  style="display: none"
/>

<svelte:window
  onkeyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .preset_info_area {
    display: flex;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  .edit_toggle_container {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .edit_container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .validation_indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .error_message {
    color: var(--cds-text-error);
    font-size: 0.875rem;
    margin: 0;
    font-family: monospace;
  }

  .edit_actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  :global(.preset_modal .bx--modal-content) {
    margin: 0;
  }

  :global(.json_editor textarea) {
    font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>

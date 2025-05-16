<script lang="ts">
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { presetOverlayOptionsStore } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import CodeSnippet from 'carbon-components-svelte/src/CodeSnippet/CodeSnippet.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import Folder from 'carbon-icons-svelte/lib/Folder.svelte';
  import Link from 'carbon-icons-svelte/lib/Link.svelte';
  import Upload from 'carbon-icons-svelte/lib/Upload.svelte';
  import { fade } from 'svelte/transition';

  let codeElement;
  let files: FileList;
  let configFileInput: HTMLInputElement;
  let timeout = undefined;

  $: showNotification = timeout !== undefined;
  $: if (files) {
    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result.toString();
        const json = JSON.parse(result);
        localPresetStore.set(json);
        codeElement.innerHTML = JSON.stringify(json, null, 2);
      };
      reader.readAsText(file);
      timeout = 3_000;
    }
  }
  $: folderAmount = $localPresetStore.Folders.length;
  $: linkAmount = [
    ...$localPresetStore.Folders.map((folder) => folder.links.length),
  ].reduce((a, b) => a + b, 0);

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
</script>

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

    <Accordion class="mt2">
      <AccordionItem
        title={$t('page.memorandum.presetOverlay.technicalInfoTitle')}
        class="preset_code_accordion_content"
      >
        <CodeSnippet
          type="multi"
          code={JSON.stringify($localPresetStore, null, 2)}
          copyLabel={$t('page.memorandum.presetOverlay.copyButtonDescription')}
        />
      </AccordionItem>
    </Accordion>
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

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

<input
  bind:this={configFileInput}
  type="file"
  bind:files
  style="display: none"
/>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .preset_info_area {
    display: flex;
    margin-top: 1rem;
  }

  :global(.preset_code_accordion_content .bx--accordion__content) {
    padding: 0;
  }

  :global(.preset_modal .bx--modal-content) {
    margin: 0;
  }
</style>

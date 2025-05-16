<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { HyperlinkClass } from '$lib/util/memorandum/classes.js';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { linkOverlayOptionsStore } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';

  export let newLinkName = '';
  export let newLinkUrl = '';

  let addLinkButton;
  let type = $linkOverlayOptionsStore.currLinkName ? 'edit' : 'new';

  $: submittable = newLinkName && newLinkUrl;
  $: if (addLinkButton) {
    addLinkButton.$$set({
      disabled: !submittable,
    });
  }

  const closeOverlay = () => {
    $linkOverlayOptionsStore.showOverlay = false;
    $linkOverlayOptionsStore.currentFolderId = undefined;
    $linkOverlayOptionsStore.currentFolder = undefined;
    $linkOverlayOptionsStore.currLinkId = undefined;
    $linkOverlayOptionsStore.currLinkName = undefined;
    $linkOverlayOptionsStore.currLinkUrl = undefined;
  };
  const addLink = () => {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks = currPreset.Folders.find(
        (folder) => folder.id === $linkOverlayOptionsStore.currentFolderId,
      ).links;

      currLinks.push(
        new HyperlinkClass(crypto.randomUUID(), newLinkName, newLinkUrl),
      );

      $localPresetStore = currPreset;
      closeOverlay();
    }
  };
  const editLink = () => {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks = currPreset.Folders.find(
        (folder) => folder.id === $linkOverlayOptionsStore.currentFolderId,
      ).links;
      let currLink = currLinks.find(
        (link) => link.id === $linkOverlayOptionsStore.currLinkId,
      );

      currLink.linkName = newLinkName;
      currLink.linkUrl = newLinkUrl;

      $localPresetStore = currPreset;
      closeOverlay();
    }
  };
  const duplicateLink = () => {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks = currPreset.Folders.find(
        (folder) => folder.id === $linkOverlayOptionsStore.currentFolderId,
      ).links;

      currLinks.push(
        new HyperlinkClass(crypto.randomUUID(), newLinkName, newLinkUrl),
      );

      $localPresetStore = currPreset;
      closeOverlay();
    }
  };
</script>

<Modal
  bind:open={$linkOverlayOptionsStore.showOverlay}
  modalHeading={type === 'new'
    ? $t('page.memorandum.link.createTitle')
    : $t('page.memorandum.link.editTitle', { linkName: newLinkName })}
  primaryButtonText={$t('page.shared.save')}
  primaryButtonIcon={Save}
  secondaryButtons={[
    { text: $t('page.shared.abort') },
    { text: $t('page.shared.duplicate') },
  ]}
  class={type === 'edit' ? 'edit_link' : 'new_link'}
  on:click:button--primary={type === 'new' ? addLink : editLink}
  on:click:button--secondary={({ detail }) => {
    if (detail.text === $t('page.shared.abort')) closeOverlay();
    if (detail.text === $t('page.shared.duplicate')) duplicateLink();
  }}
>
  {#if $initialized}
    {#if type === 'new'}
      <p class="mb1">
        {$t('page.memorandum.link.createInfo', {
          folderName: $linkOverlayOptionsStore.currentFolder,
        })}
      </p>
    {:else}
      <p class="mb1">
        {@html $t('page.memorandum.link.editInfo', {
          linkName: newLinkName,
          folderName: $linkOverlayOptionsStore.currentFolder,
        })}
      </p>
    {/if}

    <TextInput
      bind:value={newLinkName}
      labelText="Name"
      placeholder={$t('page.memorandum.link.nameOfLink')}
      autofocus
      class="mb1"
      on:keyup={(event) => {
        if (isEnter(event)) {
          type === 'new' ? addLink() : editLink();
        }
      }}
    />
    <TextInput
      bind:value={newLinkUrl}
      labelText="URL"
      placeholder={$t('page.memorandum.link.urlOfLink')}
      on:keyup={(event) => {
        if (isEnter(event)) {
          type === 'new' ? addLink() : editLink();
        }
      }}
    />
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  :global(
    .new_link
      > .bx--modal-container
      > .bx--modal-footer
      > .bx--btn--secondary:nth-child(2)
  ) {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

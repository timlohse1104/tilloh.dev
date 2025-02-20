<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { HyperlinkClass } from '$lib/util/memorandum/classes.js';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { linkOverlayOptionsStore } from '$lib/util/stores/stores-memorandum';
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';

  export let newLinkName = '';
  export let newLinkUrl = '';

  let addLinkButton;
  let type = $linkOverlayOptionsStore.currLinkName ? 'edit' : 'new';
  let nameInput;

  $: submittable = newLinkName && newLinkUrl;
  $: if (addLinkButton) {
    addLinkButton.$$set({
      disabled: !submittable,
    });
  }

  onMount(() => {
    nameInput.focus();
  });

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

<Dialog
  bind:open={$linkOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if $initialized}
    {#if type === 'new'}
      <Title id="simple-title">
        {$t('page.memorandum.link.createTitle')}
        <p class="subtitle">
          {$t('page.memorandum.link.createInfo', {
            folderName: $linkOverlayOptionsStore.currentFolder,
          })}
        </p>
      </Title>
    {:else}
      <Title id="simple-title">
        {$t('page.memorandum.link.editTitle', { linkName: newLinkName })}

        <p class="subtitle">
          {$t('page.memorandum.link.editInfo', {
            linkName: newLinkName,
            folderName: $linkOverlayOptionsStore.currentFolder,
          })}
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
          if (isEnter(event)) {
            type === 'new' ? addLink() : editLink();
          }
        }}
      >
        <Icon class="material-icons" slot="leadingIcon">text_format</Icon>
        <HelperText slot="helper">
          {$t('page.memorandum.link.nameOfLink')}
        </HelperText>
      </Textfield>
      <Textfield
        variant="outlined"
        bind:value={newLinkUrl}
        label="URL"
        style="margin-top: 1rem; width: 100%"
        on:keyup={(event) => {
          if (isEnter(event)) {
            type === 'new' ? addLink() : editLink();
          }
        }}
      >
        <Icon class="material-icons" slot="leadingIcon">link</Icon>
        <HelperText slot="helper">
          {$t('page.memorandum.link.urlOfLink')}
        </HelperText>
      </Textfield>
    </Content>
    <Actions>
      {#if type === 'edit'}
        <Button on:click={duplicateLink}>
          <Icon class="material-icons">content_copy</Icon>
          <Label>
            {$t('page.shared.duplicate')}
          </Label>
        </Button>
      {/if}
      <Button on:click={closeOverlay}>
        <Icon class="material-icons">link_off</Icon>
        <Label>
          {$t('page.shared.abort')}
        </Label>
      </Button>
      <Button
        bind:this={addLinkButton}
        on:click={type === 'new' ? addLink : editLink}
      >
        <Icon class="material-icons"
          >{type === 'new' ? 'bookmark_add' : 'save'}</Icon
        >
        <Label>
          {$t('page.shared.save')}
        </Label>
      </Button>
    </Actions>
  {:else}
    <Title id="simple-title">>Locale initializing...</Title>
  {/if}
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .subtitle {
    font-size: 1rem;
  }
</style>

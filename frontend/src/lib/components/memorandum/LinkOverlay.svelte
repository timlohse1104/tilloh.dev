<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { HyperlinkClass } from '$lib/util/memorandum/classes.js';
  import {
    linkOverlayOptionsStore,
    localPresetStore,
  } from '$lib/util/memorandum/stores.js';
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
      let currLinks =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links;

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
      );

      $localPresetStore = currPreset;
      closeOverlay();
    }
  };

  const editLink = () => {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLink =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links[
          $linkOverlayOptionsStore.currLinkId
        ];

      currLink.linkName = newLinkName;
      currLink.linkUrl = newLinkUrl;

      $localPresetStore = currPreset;
      closeOverlay();
    }
  };

  const duplicateLink = () => {
    if (submittable) {
      let currPreset = $localPresetStore;
      let currLinks =
        currPreset.Folders[$linkOverlayOptionsStore.currentFolderId].links;

      currLinks.push(
        new HyperlinkClass(currLinks.length, newLinkName, newLinkUrl),
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
  {#if type === 'new'}
    <Title id="simple-title">
      {#if $initialized}
        {$t('page.memorandum.link.createTitle')}
      {:else}
        Locale initializing...
      {/if}
      <p class="subtitle">
        {#if $initialized}
          {$t('page.memorandum.link.createInfo', {
            folderName: $linkOverlayOptionsStore.currentFolder,
          })}
        {:else}
          Locale initializing...
        {/if}
      </p>
    </Title>
  {:else}
    <Title id="simple-title">
      {#if $initialized}
        {$t('page.memorandum.link.editTitle', { linkName: newLinkName })}
      {:else}
        Locale initializing...
      {/if}
      <p class="subtitle">
        {#if $initialized}
          {$t('page.memorandum.link.editInfo', {
            linkName: newLinkName,
            folderName: $linkOverlayOptionsStore.currentFolder,
          })}
        {:else}
          Locale initializing...
        {/if}
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
      <HelperText slot="helper"
        >{#if $initialized}
          {$t('page.memorandum.link.nameOfLink')}
        {:else}
          Locale initializing...
        {/if}</HelperText
      >
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
      <HelperText slot="helper"
        >{#if $initialized}
          {$t('page.memorandum.link.urlOfLink')}
        {:else}
          Locale initializing...
        {/if}</HelperText
      >
    </Textfield>
  </Content>
  <Actions>
    {#if type === 'edit'}
      <Button on:click={duplicateLink}>
        <Icon class="material-icons">content_copy</Icon>
        <Label
          >{#if $initialized}
            {$t('page.shared.duplicate')}
          {:else}
            Locale initializing...
          {/if}</Label
        >
      </Button>
    {/if}
    <Button on:click={closeOverlay}>
      <Icon class="material-icons">link_off</Icon>
      <Label
        >{#if $initialized}
          {$t('page.shared.cancel')}
        {:else}
          Locale initializing...
        {/if}</Label
      >
    </Button>
    <Button
      bind:this={addLinkButton}
      on:click={type === 'new' ? addLink : editLink}
    >
      <Icon class="material-icons"
        >{type === 'new' ? 'bookmark_add' : 'save'}</Icon
      >
      <Label
        >{#if $initialized}
          {$t('page.shared.save')}
        {:else}
          Locale initializing...
        {/if}</Label
      >
    </Button>
  </Actions>
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .subtitle {
    font-size: 1rem;
  }
</style>

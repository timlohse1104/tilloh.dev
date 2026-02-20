<script lang="ts">
  import { HyperlinkClass } from '$lib/util/memorandum/classes.js';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { initialized, t } from '$lib/util/translations';
  import ContextMenu from 'carbon-components-svelte/src/ContextMenu/ContextMenu.svelte';
  import ContextMenuDivider from 'carbon-components-svelte/src/ContextMenu/ContextMenuDivider.svelte';
  import ContextMenuOption from 'carbon-components-svelte/src/ContextMenu/ContextMenuOption.svelte';
  import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
  import ArrowUp from 'carbon-icons-svelte/lib/ArrowUp.svelte';
  import ArrowDown from 'carbon-icons-svelte/lib/ArrowDown.svelte';
  import CopyFile from 'carbon-icons-svelte/lib/CopyFile.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import Launch from 'carbon-icons-svelte/lib/Launch.svelte';
  import Link from 'carbon-icons-svelte/lib/Link.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { createEventDispatcher } from 'svelte';
  import { bounceInOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  export let linkId;
  export let folderId;
  export let linkName;
  export let linkUrl;
  export let faviconLink;

  let linkObject;

  $: currentFolder = $localPresetStore?.Folders.find(
    (folder) => folder.id === folderId,
  );
  $: currentLinkIndex = currentFolder?.links.findIndex(
    (link) => link.id === linkId,
  ) ?? -1;

  const duplicateLink = () => {
    let currPreset = $localPresetStore;
    let currLinks = currPreset.Folders.find(
      (folder) => folder.id === folderId,
    ).links;

    currLinks.push(new HyperlinkClass(crypto.randomUUID(), linkName, linkUrl));

    $localPresetStore = currPreset;
  };

  const copyLinkUrl = async () => {
    try {
      await navigator.clipboard.writeText(linkUrl);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const moveLinkUp = () => {
    if (currentLinkIndex > 0) {
      let currPreset = $localPresetStore;
      let folder = currPreset.Folders.find((f) => f.id === folderId);
      const link = folder.links[currentLinkIndex];
      folder.links.splice(currentLinkIndex, 1);
      folder.links.splice(currentLinkIndex - 1, 0, link);
      $localPresetStore = currPreset;
    }
  };

  const moveLinkDown = () => {
    if (currentLinkIndex < currentFolder.links.length - 1) {
      let currPreset = $localPresetStore;
      let folder = currPreset.Folders.find((f) => f.id === folderId);
      const link = folder.links[currentLinkIndex];
      folder.links.splice(currentLinkIndex, 1);
      folder.links.splice(currentLinkIndex + 1, 0, link);
      $localPresetStore = currPreset;
    }
  };

  const moveLinkToTop = () => {
    if (currentLinkIndex > 0) {
      let currPreset = $localPresetStore;
      let folder = currPreset.Folders.find((f) => f.id === folderId);
      const link = folder.links[currentLinkIndex];
      folder.links.splice(currentLinkIndex, 1);
      folder.links.unshift(link);
      $localPresetStore = currPreset;
    }
  };

  const moveLinkToBottom = () => {
    if (currentLinkIndex < currentFolder.links.length - 1) {
      let currPreset = $localPresetStore;
      let folder = currPreset.Folders.find((f) => f.id === folderId);
      const link = folder.links[currentLinkIndex];
      folder.links.splice(currentLinkIndex, 1);
      folder.links.push(link);
      $localPresetStore = currPreset;
    }
  };
</script>

{#if $initialized}
  <section
    bind:this={linkObject}
    role="presentation"
    transition:blur={{ duration: 1000, easing: bounceInOut }}
  >
    <img alt="Website logo of {linkName}" src={faviconLink} />

    <a href={linkUrl}>
      {linkName}
    </a>

    <div class="link_controls">
      <button
        class="arrow_button"
        on:click={moveLinkUp}
        disabled={currentLinkIndex === 0}
        title={$t('page.memorandum.link.moveUp')}
      >
        <ChevronUp size={16} />
      </button>
      <button
        class="arrow_button"
        on:click={moveLinkDown}
        disabled={currentLinkIndex === currentFolder?.links.length - 1}
        title={$t('page.memorandum.link.moveDown')}
      >
        <ChevronDown size={16} />
      </button>
    </div>

    <ContextMenu target={linkObject}>
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.link.openInTab')}
        icon={Launch}
        on:click={() => window.open(linkUrl, '_blank')}
      />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.link.copyUrl')}
        icon={Link}
        on:click={copyLinkUrl}
      />
      {#if currentFolder && currentFolder.links.length > 1}
        <ContextMenuDivider />
        {#if currentLinkIndex > 0}
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.link.moveUp')}
            icon={ChevronUp}
            on:click={moveLinkUp}
          />
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.link.moveToTop')}
            icon={ArrowUp}
            on:click={moveLinkToTop}
          />
        {/if}
        {#if currentLinkIndex < currentFolder.links.length - 1}
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.link.moveDown')}
            icon={ChevronDown}
            on:click={moveLinkDown}
          />
          <ContextMenuOption
            indented
            labelText={$t('page.memorandum.link.moveToBottom')}
            icon={ArrowDown}
            on:click={moveLinkToBottom}
          />
        {/if}
      {/if}
      <ContextMenuDivider />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.link.editTitle')}
        icon={Edit}
        on:click={() =>
          dispatch('editLink', {
            linkId: linkId,
            linkName: linkName,
            linkUrl: linkUrl,
          })}
      />
      <ContextMenuOption
        indented
        labelText={$t('page.memorandum.link.duplicate')}
        icon={CopyFile}
        on:click={duplicateLink}
      />
      <ContextMenuDivider />
      <ContextMenuOption
        indented
        kind="danger"
        labelText={$t('page.memorandum.link.deleteTitle')}
        icon={TrashCan}
        on:click={() => dispatch('delLink', linkId)}
      />
    </ContextMenu>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    display: grid;
    grid-template-columns: 20px 1fr auto;
    grid-template-areas: 'icon link controls';
    padding-left: 0.75rem;
    padding-right: 0.5rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;
    box-sizing: border-box;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background-color: var(--black30);
    }
  }

  img {
    grid-area: icon;
    margin: 0;
    padding: 0;
    width: 25px;
    height: 25px;
    padding: calc(var(--default_padding) / 4);
  }

  a {
    grid-area: link;
    display: block;
    padding-left: var(--default_padding);
    font-size: 1rem;

    &:hover {
      color: white;
    }
  }

  .link_controls {
    grid-area: controls;
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;

    @media #{$phone}, #{$tablet} {
      display: none;
    }
  }

  section:hover .link_controls {
    opacity: 1;
  }

  .arrow_button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: var(--white30);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
</style>

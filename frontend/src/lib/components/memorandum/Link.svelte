<script lang="ts">
  import { draggable } from '$lib/util/drag-and-drop';
  import { HyperlinkClass } from '$lib/util/memorandum/classes.js';
  import { localPresetStore } from '$lib/util/stores/store-memorandum-preset';
  import { initialized, t } from '$lib/util/translations';
  import ContextMenu from 'carbon-components-svelte/src/ContextMenu/ContextMenu.svelte';
  import ContextMenuDivider from 'carbon-components-svelte/src/ContextMenu/ContextMenuDivider.svelte';
  import ContextMenuOption from 'carbon-components-svelte/src/ContextMenu/ContextMenuOption.svelte';
  import CopyFile from 'carbon-icons-svelte/lib/CopyFile.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
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

  const duplicateLink = () => {
    let currPreset = $localPresetStore;
    let currLinks = currPreset.Folders.find(
      (folder) => folder.id === folderId,
    ).links;

    currLinks.push(new HyperlinkClass(crypto.randomUUID(), linkName, linkUrl));

    $localPresetStore = currPreset;
  };
</script>

{#if $initialized}
  <section
    bind:this={linkObject}
    use:draggable={`{ "type": "link", "linkId": "${linkId}", "originFolderId": "${folderId}" }`}
    role="presentation"
    transition:blur={{ duration: 1000, easing: bounceInOut }}
  >
    <img alt="Website logo of {linkName}" src={faviconLink} />

    <a href={linkUrl}>
      {linkName}
    </a>

    <ContextMenu target={linkObject}>
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
    grid-template-columns: 20px calc(100% - 70px) 50px;
    height: auto;
    grid-template-areas: 'icon link delBtn';
    padding-left: var(--default_padding);
    box-sizing: border-box;
    align-items: center;

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
    font-size: 14px;
  }
</style>

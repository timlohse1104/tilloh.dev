<script lang="ts">
  import { draggable } from '$lib/util/drag-and-drop';
  import { createEventDispatcher } from 'svelte';
  import { bounceInOut } from 'svelte/easing';
  import { blur } from 'svelte/transition';

  const dispatch = createEventDispatcher();
  export let linkId;
  export let folderId;
  export let linkName;
  export let linkUrl;
  export let faviconLink;
</script>

<div
  id="link"
  use:draggable={`{ "type": "link", "linkId": "${linkId}", "originFolderId": "${folderId}" }`}
  on:dblclick={() =>
    dispatch('editLink', {
      linkId: linkId,
      linkName: linkName,
      linkUrl: linkUrl,
    })}
  role="presentation"
  transition:blur={{ duration: 1000, easing: bounceInOut }}
>
  <img alt="Website logo of {linkName}" src={faviconLink} />

  <a href={linkUrl}>
    {linkName}
  </a>

  <button on:click={() => dispatch('delLink', linkId)}> - </button>
</div>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  div {
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
    padding: calc(var(--default_padding) / 4) 0 calc(var(--default_padding) / 4)
      0;
  }

  a {
    grid-area: link;
    display: block;
    padding-left: var(--default_padding);
    font-size: 14px;
  }

  button {
    grid-area: delBtn;
    @include mem_button;
    background-color: var(--trans);

    &:hover {
      background-color: var(--black30);
      color: red;
      text-shadow: none;
    }
  }
</style>

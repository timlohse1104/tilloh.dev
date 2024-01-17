<script>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let linkId;
  export let linkName;
  export let linkUrl;
</script>

<div
  id="link"
  draggable={true}
  on:dragstart
  on:dblclick={() =>
    dispatch('editLink', {
      linkId: linkId,
      linkName: linkName,
      linkUrl: linkUrl,
    })}
  role="presentation"
>
  <img
    alt="Website logo of {linkName}"
    src="https://www.google.com/s2/favicons?domain={linkUrl}"
  />

  <a href={linkUrl}>
    {linkName}
  </a>

  <button on:click={() => dispatch('delLink', linkId)}> - </button>
</div>

<style lang="scss">
  @import '$lib/styles/_variables.scss';
  @import '$lib/styles/_mixins.scss';

  div {
    display: grid;
    grid-template-columns: 20px calc(100% - 70px) 50px;
    height: auto;
    grid-template-areas: 'icon link delBtn';
    padding-left: $defPadding;
    box-sizing: border-box;
    align-items: center;
    background-color: $lightgrey80;
    border-bottom: 1px solid $darkgrey80;

    &:hover {
      background-color: $light80;
    }
  }

  #link {
    border-bottom: 1px solid $white30;

    button {
      border-left: 1px solid $white30;
    }
  }

  img {
    grid-area: icon;
    margin: 0;
    padding: 0;
    width: 25px;
    height: 25px;
    padding: calc($defPadding / 4) 0 calc($defPadding / 4) 0;
  }

  a {
    grid-area: link;
    display: block;
    padding-left: $defPadding;
    color: $light80;
    text-shadow: $sharpen;
    font-size: 14px;
  }

  button {
    grid-area: delBtn;
    @include mem-button;
    background-color: $trans;
    border-left: 1px solid $darkgrey80;
    text-shadow: $sharpen;

    &:hover {
      background-color: $light80;
      color: $red;
      text-shadow: none;
    }
  }
</style>

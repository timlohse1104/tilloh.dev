<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let linkId;
  export let linkName;
  export let linkUrl;

  const url = new URL(linkUrl);
  const baseUrl = url.hostname;
  let domain = baseUrl.split('.').slice(-2).join('.');
  let mainUrl = `https://${domain}`;
  let faviconLink = `https://www.google.com/s2/favicons?domain=${mainUrl}`;
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
  <img alt="Website logo of {linkName}" src={faviconLink} />

  <a href={linkUrl}>
    {linkName}
  </a>

  <button on:click={() => dispatch('delLink', linkId)}> - </button>
</div>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  div {
    display: grid;
    grid-template-columns: 20px calc(100% - 70px) 50px;
    height: auto;
    grid-template-areas: 'icon link delBtn';
    padding-left: var(--default-padding);
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid var(--darkgrey80);

    &:hover {
      background-color: var(--white30);
    }
  }

  #link {
    border-bottom: 1px solid var(--white30);

    button {
      border-left: 1px solid var(--white30);
    }
  }

  img {
    grid-area: icon;
    margin: 0;
    padding: 0;
    width: 25px;
    height: 25px;
    padding: calc(var(--default-padding) / 4) 0 calc(var(--default-padding) / 4)
      0;
  }

  a {
    grid-area: link;
    display: block;
    padding-left: var(--default-padding);
    color: var(--light80);
    text-shadow: var(--sharpen);
    font-size: 14px;
  }

  button {
    grid-area: delBtn;
    @include mem-button;
    background-color: var(--trans);
    border-left: 1px solid var(--darkgrey80);
    text-shadow: var(--sharpen);

    &:hover {
      background-color: var(--light80);
      color: var(--red);
      text-shadow: none;
    }
  }
</style>

<script>
  import Menu from "./content/Menu.svelte";
  import BoxArea from "./content/BoxArea.svelte";
  import Footer from "./content/Footer.svelte";
  import { linkOverlayOptions, lightTheme } from "./util/stores.js";
  import LinkOverlay from "./content/LinkOverlay.svelte";
  import { onMount } from "svelte";

  let menuActive = false;

  onMount(() => {
    if ($lightTheme === "true") {
      window.document.body.classList.toggle("light-theme");
    }
  });
</script>

  <div class="memorandum_content">
    <button
      class={menuActive ? "active" : "inactive"}
      on:click={() => {
        menuActive = !menuActive;
      }}
    />
    <Menu isActive={menuActive} />
    <BoxArea />
    <Footer />
  </div>
  {#if $linkOverlayOptions.showOverlay}
    <LinkOverlay
      newLinkName={$linkOverlayOptions.currLinkName}
      newLinkUrl={$linkOverlayOptions.currLinkUrl}
    />
  {/if}

<style type="scss">
  @import "./content/_variables";

  div {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    background-color: white;
    scroll-behavior: unset;
  }

  .memorandum_content {
    grid-template-rows: 95% 5%;
  }

  button {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0;
    right: 0;
    float: right;
    background-image: url("../images/menu.png");
    background-repeat: no-repeat;
    background-size: 30px;
    background-position: center;
    padding: 0;
    margin: 0;
    color: white;
    border: none;
    box-shadow: $sharpen;

    &:hover {
      background-color: $red;
    }
  }

  .active {
    background-color: $red;

    &:hover {
      background-color: $red70;
    }
  }

  .inactive {
    background-color: $red70;
  }
</style>

<script>
  import Header from "./content/Header.svelte";
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

  <main class={menuActive ? "menuActive" : "menuInactive"}>
    <Header on:menuActive={(event) => (menuActive = event.detail)} />
    <Menu isActive={menuActive} />
    <BoxArea />
    <Footer />
  </main>
  {#if $linkOverlayOptions.showOverlay}
    <LinkOverlay
      newLinkName={$linkOverlayOptions.currLinkName}
      newLinkUrl={$linkOverlayOptions.currLinkUrl}
    />
  {/if}

<style type="scss">
  @import "./content/_fonts";
  @import "./content/_variables";

  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    // font-family: "Audiowide";
    overflow: hidden;
  }
  main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("../images/modernwork.jpg");
    scroll-behavior: unset;
  }

  .menuActive {
    grid-template-rows: 10% 5% 80% 5%;

    @media #{$phone} {
      grid-template-rows: 10% 10% 7% 5%;
    }

    @media #{$tablet} {
      grid-template-rows: 10% 6% 79% 5%;
    }
  }

  .menuInactive {
    grid-template-rows: 10% 85% 5%;
  }
</style>

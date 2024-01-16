<script>
  import ThemeChooser from "./ThemeChooser.svelte";
  import RL_Player_Stats_Plugin from "./RL_Player_Stats_Plugin.svelte";
  import { slide } from "svelte/transition";

  export let isActive = false;
</script>

{#if isActive}
  <nav
    class={isActive ? "active" : "inactive"}
    in:slide={{ y: -10, duration: 1000 }}
  >
    <ThemeChooser />
    <RL_Player_Stats_Plugin />
  </nav>
{/if}

<style type="text/scss">
  @import "./_fonts";
  @import "./_variables";

  nav {
    background-color: $darkgrey80;
    border-bottom: solid 1px black;
    box-shadow: 0 2px 10px $black80;
    display: flex;
  }

  :global(body.light-theme) nav {
    background-color: $light50;
    border-bottom: solid 1px $light80;
    box-shadow: 0 2px 10px $light80;
  }

  .active {
    display: flex;
  }

  .inactive {
    display: none;
  }
</style>

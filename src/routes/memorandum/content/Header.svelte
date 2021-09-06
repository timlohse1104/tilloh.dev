<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let menuActive = false;
</script>

<header>
  <h1>Memorandum</h1>

  <button
    class={menuActive ? "active" : "inactive"}
    on:click={() => {
      menuActive = !menuActive;
      dispatch("menuActive", menuActive);
    }}
  />
</header>

<style type="scss">
  @import "./_fonts";
  @import "./_variables";

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $black80;
  }

  :global(body.light-theme) header {
    background-color: $light80;
  }

  h1 {
    flex-grow: 1;
    margin: 0;
    padding: 0;
    font-size: 40px;
    text-align: center;
    color: white;
    text-shadow: $sharpen;

    @media #{$phone} {
      text-align: left;
      padding-left: 40px;
      font-size: 30px;
    }
  }

  :global(body.light-theme) header h1 {
    color: $lightgrey80;
  }

  button {
    position: absolute;
    width: 50px;
    height: 50px;
    right: $defPadding * 2;
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

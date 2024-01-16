<script>
  import { lightTheme } from "../util/stores.js";

  function toggleTheme() {
    if ($lightTheme === "false") {
      $lightTheme = "true";
    } else {
      $lightTheme = "false";
    }
    window.document.body.classList.toggle("light-theme");
  }
</script>

<div id="themeChooserBox">
  <img
    id="themeImg"
    alt="Click to toggle dark and light theme"
    src="../images/white_bulb_off.png"
    on:click={toggleTheme}
  />
</div>

<style type="text/scss">
  @import "./variables.scss";
  @import "./mixins.scss";

  #themeChooserBox {
    @include menu-item-box;
    flex-grow: 0;
  }

  :global(body.light-theme) #themeChooserBox {
    &:hover {
      background-color: $light50;
    }
  }

  img {
    border: none;
    width: 100%;

    &:hover {
      content: url("../images/white_bulb_on.png");
    }
  }

  :global(body.light-theme) #themeImg {
    content: url("../images/black_bulb_on.png");

    &:hover {
      content: url("../images/black_bulb_off.png");
    }
  }
</style>

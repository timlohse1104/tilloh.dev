<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<style type="text/scss">
  @import "./_variables";

  section {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }

  #firstFolder {
    flex-grow: 1;
    margin: 0;
    padding: $defPadding;
    background-color: $darkgrey80;
    color: white;
    border: none;
    border-right: $black80 solid 1px;
    font-size: 30px;

    &:active {
      background-color: $green70;
    }
  }

  #defaultPreset {
    flex-grow: 1;
    margin: 0;
    padding: $defPadding;
    background-color: $darkgrey80;
    color: white;
    border: none;
    font-size: 30px;

    &:active {
      background-color: $green70;
    }
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      width: 350px;
    }

    @media #{$tablet} {
      p {
        font-size: 22px;
      }

      img {
        width: 200px;
      }
    }

    @media #{$phone} {
      p {
        display: none;
      }

      img {
        width: 100px;
      }
    }
  }

  :global(body.light-theme) #firstFolderImg {
    content: url(../images/black_new_folder.png);
  }

  :global(body.light-theme) #firstFolder {
    background-color: $light50;
    color: black;
    border-right: $light80 solid 1px;
    &:active {
      background-color: $green70;
    }
  }

  :global(body.light-theme) #loadPresetImg {
    content: url(../images/black_download_folder.png);
  }

  :global(body.light-theme) #defaultPreset {
    background-color: $light50;
    color: black;
    &:active {
      background-color: $green70;
    }
  }
</style>

<section>
  <button id="firstFolder" on:click={() => dispatch('new')}>

    <img
      id="firstFolderImg"
      alt="Click to open an empty folder"
      src="../images/white_new_folder.png" />
    <p>Create your first folder</p>

  </button>

  <button id="defaultPreset" on:click={() => dispatch('default')}>

    <img
      id="loadPresetImg"
      alt="Click to load a default preset of folders and links"
      src="../images/white_download_folder.png" />
    <p>Load default preset</p>

  </button>
</section>

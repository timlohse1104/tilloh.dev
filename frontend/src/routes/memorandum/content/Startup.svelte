<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<section>
  <button on:click={() => dispatch('new')}>
    <img
      id="firstFolderImg"
      alt="Klicke um einen leeren Ordner zu erstellen"
      src="/images/memorandum/white_new_folder.png"
    />
    <p>Erstelle einen leeren Ordner</p>
  </button>

  <button on:click={() => dispatch('default')}>
    <img
      id="loadPresetImg"
      alt="Klicke um einen Ordner mit vorgefertigten Links zu erstellen"
      src="/images/memorandum/white_download_folder.png"
    />
    <p>Lade ein Beispiel</p>
  </button>
</section>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  section {
    display: flex;

    @media #{$phone} {
      flex-direction: column;
    }
  }

  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0;
    flex-grow: 2;
    padding: var(--default-padding);
    border: none;
    background-color: var(--trans);
    color: white;
    font-size: 30px;
    display: inline-block;
    transition: all 0.3s ease 0s;

    &:hover {
      background-color: var(--darkgrey80);
    }

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
      img {
        width: 100px;
      }
    }
  }
</style>

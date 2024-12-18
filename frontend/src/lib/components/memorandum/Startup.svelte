<script>
  import { initialized, t } from '$lib/util/translations';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

{#if $initialized}
  <section>
    <button on:click={() => dispatch('new')}>
      <img
        id="firstFolderImg"
        alt={$t('page.memorandum.startup.createEmptyFolderAlt')}
        src="/images/memorandum/white_new_folder.png"
      />
      <p>
        {$t('page.memorandum.startup.createEmptyFolder')}
      </p>
    </button>

    <button on:click={() => dispatch('default')}>
      <img
        id="loadPresetImg"
        alt={$t('page.memorandum.startup.loadPresetAlt')}
        src="/images/memorandum/white_download_folder.png"
      />
      <p>
        {$t('page.memorandum.startup.loadPreset')}
      </p>
    </button>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @import '../../styles/variables.scss';

  section {
    display: flex;
    align-items: center;

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
    padding: var(--default_padding);
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

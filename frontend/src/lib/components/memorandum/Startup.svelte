<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import Download from 'carbon-icons-svelte/lib/Download.svelte';

  // 2. PROPS
  const { onNew, onDefault } = $props();
</script>

{#if $initialized}
  <section>
    <Tile class="startup_card">
      <img
        alt={$t('page.memorandum.startup.createEmptyFolderAlt')}
        src="/images/memorandum/white_new_folder.png"
      />
      <p>{$t('page.memorandum.startup.createEmptyFolderDescription')}</p>
      <Button kind="primary" icon={Add} on:click={onNew}>
        {$t('page.memorandum.startup.createEmptyFolderCta')}
      </Button>
    </Tile>

    <Tile class="startup_card">
      <img
        alt={$t('page.memorandum.startup.loadPresetAlt')}
        src="/images/memorandum/white_download_folder.png"
      />
      <p>{$t('page.memorandum.startup.loadPresetDescription')}</p>
      <Button kind="tertiary" icon={Download} on:click={onDefault}>
        {$t('page.memorandum.startup.loadPresetCta')}
      </Button>
    </Tile>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    display: flex;
    gap: 1.5rem;
    padding: 2rem;
    justify-content: center;
    align-items: stretch;

    @media #{$tablet} {
      gap: 1rem;
      padding: 1.5rem;
    }

    @media #{$phone} {
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
  }

  :global(.startup_card) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 300px;
    text-align: center;
    padding: 2rem !important;

    @media #{$tablet} {
      width: 240px;
    }

    @media #{$phone} {
      width: 100%;
      max-width: 400px;
    }
  }

  img {
    width: 80px;
    opacity: 0.85;

    @media #{$tablet} {
      width: 60px;
    }
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.75;
    line-height: 1.5;
    flex: 1;
  }
</style>

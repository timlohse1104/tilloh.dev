<script lang="ts">
  // 1. IMPORTS
  import { getRandomJoke } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { formatDate } from '$lib/util/format';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import CloudDownload from 'carbon-icons-svelte/lib/CloudDownload.svelte';
  import { onMount } from 'svelte';
  import CreateJokeOverlay from './CreateJokeOverlay.svelte';

  // 4. STATE
  let randomJoke = $state<JokeDto | null>(null);
  let createJokeModalOpen = $state(false);

  // 7. LIFECYCLE
  onMount(() => {
    setRandomJoke();
  });

  // 8. FUNCTIONS
  const setRandomJoke = async () => {
    randomJoke = await getRandomJoke();
  };
</script>

{#if $initialized}
  <section>
    <h1>{$t('page.jokes.titleRandomJoke')}</h1>
    <p>{$t('page.jokes.descriptionRandomJoke')}</p>

    {#if randomJoke?.created}
      <Tile class="random_joke mt2">
        <i>{randomJoke.text}</i>
        <p>📅{formatDate(randomJoke.created)}</p>
      </Tile>
    {/if}

    <Button
      iconDescription={$t('page.jokes.loadRandomJoke')}
      icon={CloudDownload}
      on:click={setRandomJoke}
      class="mt2"
    >
      {$t('page.jokes.newRandomJoke')}
    </Button>
  </section>

  <Button
    kind="primary"
    iconDescription={$t('page.jokes.addJoke')}
    icon={Add}
    id="add_joke_button"
    tooltipPosition="left"
    on:click={() => (createJokeModalOpen = true)}
  />

  <CreateJokeOverlay bind:open={createJokeModalOpen} />
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 90vw;
    overflow-y: auto;
    overflow-x: hidden;

    @media #{$tablet} {
      max-width: 60vw;
    }

    @media #{$phone} {
      max-width: 90vw;
    }
  }

  :global(.random_joke) {
    padding: 2rem;
  }

  :global(#add_joke_button) {
    position: fixed;
    bottom: calc(var(--default_padding) + env(safe-area-inset-bottom, 0px));
    right: var(--default_padding);
    z-index: 100;
  }
</style>

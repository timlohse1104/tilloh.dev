<script lang="ts">
  // 1. IMPORTS
  import { getJokeOfTheDay } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { initialized, t } from '$lib/util/translations';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import { onMount } from 'svelte';

  // 2. PROPS
  let { customClass = '' } = $props();

  // 4. STATE
  let joke = $state<JokeDto | null>(null);

  // 7. LIFECYCLE
  onMount(async () => {
    joke = await getJokeOfTheDay();
  });
</script>

{#if $initialized}
  <section class={customClass}>
    {#if joke}
      <Tile style="padding:2rem;" class="joke_tile">
        <h3>{$t('page.home.jokeTitle')}</h3>
        <i>{joke.text}</i>
        <p>📅{new Date(joke.created).toLocaleString('DE-de')}</p>
      </Tile>
    {:else}
      <p>{$t('page.home.jokeLoading')}</p>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: min(600px, 90vw);
    margin-top: var(--default_padding);

    @media #{$phone} {
      width: 95vw;
    }
  }

  :global(.joke_tile) {
    border-left: 4px solid green !important;
    width: 100%;
  }

  h3 {
    margin-top: 0;
    font-size: 1.1rem;
  }

  i {
    font-size: 1rem;
    line-height: 1.6;
  }

  p {
    font-size: 0.75rem;
    margin-bottom: 0;
    margin-top: 0.75rem;
    opacity: 0.7;
  }
</style>

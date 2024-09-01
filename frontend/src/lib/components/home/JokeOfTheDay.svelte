<script lang="ts">
  import { getJokeOfTheDay } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { initialized, t } from '$lib/util/translations';
  import Card from '@smui/card';
  import { onMount } from 'svelte';

  let joke: JokeDto | null = null;

  onMount(async () => {
    joke = await getJokeOfTheDay();
  });
</script>

{#if $initialized}
  <section>
    {#if joke}
      <Card style="padding:2rem;">
        <h3>{$t('page.home.jokeTitle')}</h3>
        <i>{joke.text}</i>
        <p>📅{new Date(joke.created).toLocaleString('DE-de')}</p>
      </Card>
    {:else}
      <p>{$t('page.home.jokeLoading')}</p>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4rem;
  }

  h3 {
    margin-top: 0;
  }

  p {
    font-size: 0.6rem;
    margin-bottom: 0;
  }
</style>

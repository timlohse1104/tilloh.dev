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

<section>
  {#if joke}
    <Card style="padding:1.5rem;">
      {#if $initialized}
        <h3>{$t('page.home.jokeTitle')}</h3>
      {:else}
        <h3>Locale initializing...</h3>
      {/if}
      <i>
        "{joke.text}"
      </i>
    </Card>
  {:else if $initialized}
    <p>{$t('page.home.jokeLoading')}</p>
  {:else}
    <p>Locale initializing...</p>
  {/if}
</section>

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
</style>

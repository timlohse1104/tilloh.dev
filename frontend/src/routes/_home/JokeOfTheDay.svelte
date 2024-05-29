<script lang="ts">
  import { getJokeOfTheDay } from '$lib/api/jokes';
  import type { Joke } from '$lib/types/jokes';
  import { onMount } from 'svelte';

  let joke: Joke | null = null;

  onMount(async () => {
    joke = await getJokeOfTheDay();
  });
</script>

<section>
  {#if joke}
    <p>{joke.joke}</p>
  {:else}
    <p>Loading...</p>
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>

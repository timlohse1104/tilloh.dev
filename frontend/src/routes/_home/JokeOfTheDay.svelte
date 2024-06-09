<script lang="ts">
  import { getJokeOfTheDay } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
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
      <i>
        "{joke.text}"
      </i>
    </Card>
  {:else}
    <p>Lädt Witz des Tages...</p>
  {/if}
</section>

<style lang="scss">
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4rem;
  }
</style>

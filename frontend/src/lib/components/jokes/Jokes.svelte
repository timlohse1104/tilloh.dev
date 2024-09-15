<script lang="ts">
  import { getRandomJoke } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { initialized, t } from '$lib/util/translations';
  import Card from '@smui/card';
  import Fab, { Icon, Label } from '@smui/fab';

  let randomJoke: JokeDto | null = null;

  const setRandomJoke = async () => {
    randomJoke = await getRandomJoke();
  };
</script>

{#if $initialized}
  <section>
    <h1>{$t('page.jokes.title')}</h1>
    <p>{$t('page.jokes.description')}</p>

    <Fab class="randomJokeButton" on:click={setRandomJoke} extended>
      <Icon class="material-icons">refresh</Icon>
      <Label>{$t('page.jokes.newRandomJoke')}</Label>
    </Fab>

    {#if randomJoke}
      <Card class="randomJoke">
        <i>{randomJoke.text}</i>
        <p>📅{new Date(randomJoke.created).toLocaleString('DE-de')}</p>
      </Card>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
  d
{/if}

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80vw;
    margin: 0 auto;
    color: var(--light80);
    height: 88vh;
  }

  h1 {
    color: var(--light80);
  }

  :global(.randomJokeButton) {
    margin-top: 2rem;
  }

  :global(.randomJoke) {
    padding: 2rem;
    margin-top: 3rem;
  }
</style>

<script lang="ts">
  import { createJoke, getRandomJoke } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Select from 'carbon-components-svelte/src/Select/Select.svelte';
  import SelectItem from 'carbon-components-svelte/src/Select/SelectItem.svelte';
  import TextArea from 'carbon-components-svelte/src/TextArea/TextArea.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import CloudDownload from 'carbon-icons-svelte/lib/CloudDownload.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  const languages = ['de', 'en'];

  let randomJoke: JokeDto | null = null;
  let newJokeText: string = '';
  let newJokeLanguage: string = 'de';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;
  $: submittable = newJokeText && newJokeLanguage;

  const setRandomJoke = async () => {
    randomJoke = await getRandomJoke();
  };

  const createNewJoke = async () => {
    // TODO: Add categories
    const createResponse = await createJoke({
      text: newJokeText,
      language: newJokeLanguage,
      categories: [],
    });

    if (createResponse?._id) {
      timeout = 3_000;
      celebrate();
    }

    newJokeText = '';
    newJokeLanguage = 'de';
  };

  onMount(() => {
    setRandomJoke();
  });
</script>

{#if $initialized}
  <section>
    <h1>{$t('page.jokes.titleRandomJoke')}</h1>
    <p>{$t('page.jokes.descriptionRandomJoke')}</p>

    <Button
      iconDescription={$t('page.jokes.loadRandomJoke')}
      icon={CloudDownload}
      on:click={setRandomJoke}
      class="mt2"
    >
      {$t('page.jokes.newRandomJoke')}
    </Button>

    {#if randomJoke}
      <Tile class="random_joke mt2">
        <i>{randomJoke.text}</i>
        <p>📅{new Date(randomJoke.created).toLocaleString('DE-de')}</p>
      </Tile>
    {/if}

    <h2 class="mt2">{$t('page.jokes.titleNewJoke')}</h2>
    <p>{$t('page.jokes.descriptionNewJoke')}</p>

    <div class="mt1">
      <TextArea
        helperText={$t('page.jokes.newJokeHelperText')}
        placeholder={$t('page.jokes.newJokeTextInput')}
        rows={5}
        cols={60}
        bind:value={newJokeText}
      />
    </div>

    <div class="mt2">
      <Select
        labelText={$t('page.jokes.newJokeLanguage')}
        bind:selected={newJokeLanguage}
      >
        {#each languages as language}
          <SelectItem value={language} />
        {/each}
      </Select>
    </div>

    <Button
      kind="ghost"
      iconDescription={$t('page.jokes.saveJoke')}
      icon={Save}
      on:click={createNewJoke}
      disabled={!submittable}
      class="save_button mt2"
    >
      {$t('page.jokes.createJokeButtonText')}
    </Button>

    {#if showNotification}
      <div transition:fade>
        <InlineNotification
          {timeout}
          kind="success"
          lowContrast
          subtitle={$t('page.jokes.jokeCreatedSnackbar')}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
  d
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 90vw;
    margin: 0 auto 3rem auto;
    height: 85vh;
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
</style>

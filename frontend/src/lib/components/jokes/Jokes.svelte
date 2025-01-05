<script lang="ts">
  import { createJoke, getRandomJoke } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { initialized, t } from '$lib/util/translations';
  import Button from '@smui/button';
  import Card from '@smui/card';
  import Fab, { Icon, Label } from '@smui/fab';
  import IconButton from '@smui/icon-button';
  import Select, { Option } from '@smui/select';
  import Snackbar, { Actions } from '@smui/snackbar';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import { onMount } from 'svelte';

  const languages = ['de', 'en'];

  let randomJoke: JokeDto | null = null;
  let newJokeText: string = '';
  let newJokeLanguage: string = 'de';
  let saveButton;
  let createJokeSnackbar: Snackbar;

  $: submittable = newJokeText && newJokeLanguage;
  $: if (saveButton) {
    saveButton.$$set({
      disabled: !submittable,
    });
  }

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
      createJokeSnackbar.open();
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

    <Fab class="random_joke_button" on:click={setRandomJoke} extended>
      <Icon class="material-icons">refresh</Icon>
      <Label>{$t('page.jokes.newRandomJoke')}</Label>
    </Fab>

    {#if randomJoke}
      <Card class="random_joke">
        <i>{randomJoke.text}</i>
        <p>📅{new Date(randomJoke.created).toLocaleString('DE-de')}</p>
      </Card>
    {/if}

    <h2>{$t('page.jokes.titleNewJoke')}</h2>
    <p>{$t('page.jokes.descriptionNewJoke')}</p>

    <Textfield
      textarea
      bind:value={newJokeText}
      label={$t('page.jokes.newJokeTextInput')}
      input$rows={4}
      input$cols={50}
      input$resizable={false}
    >
      <HelperText slot="helper">{$t('page.jokes.newJokeHelperText')}</HelperText
      >
    </Textfield>

    <Select
      bind:value={newJokeLanguage}
      label={$t('page.jokes.newJokeLanguage')}
    >
      {#each languages as language}
        <Option value={language}>{language}</Option>
      {/each}
    </Select>

    <Button
      class="create_joke_button"
      bind:this={saveButton}
      on:click={createNewJoke}
    >
      <Icon class="material-icons">save</Icon>
      <Label>
        {$t('page.jokes.createJokeButtonText')}
      </Label>
    </Button>

    <Snackbar bind:this={createJokeSnackbar}>
      <Label>
        {$t('page.jokes.jokeCreatedSnackbar')}
      </Label>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
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
    color: var(--light80);
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

  :global(.random_joke_button) {
    margin-top: 2rem;
  }

  :global(.random_joke) {
    padding: 2rem;
    margin-top: 3rem;
  }

  :global(.create_joke_button) {
    margin-top: 2rem;
  }
</style>

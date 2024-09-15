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

    <hr />

    <h2>{$t('page.jokes.titleNewJoke')}</h2>
    <p>{$t('page.jokes.descriptionNewJoke')}</p>

    <Textfield
      textarea
      bind:value={newJokeText}
      label={$t('page.jokes.newJokeTextInput')}
      input$rows={6}
      input$cols={40}
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
      class="createJokeButton"
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
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 80vw;
    margin: 0 auto;
    color: var(--light80);
    height: 88vh;
  }

  :global(.randomJokeButton) {
    margin-top: 2rem;
  }

  :global(.randomJoke) {
    padding: 2rem;
    margin-top: 3rem;
  }

  :global(.createJokeButton) {
    margin-top: 3rem;
  }

  hr {
    border: 1px solid var(--color-text);
    width: 100%;
    margin: 3rem 0;
  }
</style>

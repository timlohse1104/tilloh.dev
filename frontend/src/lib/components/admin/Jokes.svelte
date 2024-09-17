<script lang="ts">
  import { updateJoke } from '$lib/api/jokes.api';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let jokes: JokeDto[] = [];
  export let adminToken: string;

  const verifyJoke = async (jokeId: string) => {
    console.log({ jokeId }, 'Verifying joke...');
    const updateJokeResponse = await updateJoke(adminToken, jokeId, {
      verified: true,
    });

    if (updateJokeResponse.verified) {
      console.log({ updateJokeResponse }, 'Joke verified.');
    } else {
      console.error('Joke verification failed.');
    }

    dispatch('updateDashboard');
  };
</script>

{#if $initialized}
  <section class="admin-sections">
    <div class="admin-sections-headline">
      <h2>{$t('page.admin.jokes.title')} <span>({jokes.length})</span></h2>
    </div>
    <List threeLine avatarList singleSelection class="admin-sections-list">
      {#each jokes as joke}
        <Item class="admin-list-items">
          <Graphic class="material-icons admin-list-items-icon">😂</Graphic>
          <Text class="admin-list-items-text">
            <PrimaryText>{joke.text}</PrimaryText>
            <SecondaryText
              >{joke.verified === undefined || joke.verified
                ? '✅'
                : '⌛️'}🆔{joke._id}</SecondaryText
            >
            <SecondaryText
              >✨{new Date(joke.created).toLocaleString('de-DE')} 🔧{new Date(
                joke.updated,
              ).toLocaleString('de-DE')}</SecondaryText
            >
          </Text>

          {#if !joke.verified && joke.verified !== undefined}
            <IconButton
              class="material-icons admin-list-items-button"
              on:click={() => verifyJoke(joke._id)}>thumb_up</IconButton
            >
          {/if}
          <IconButton
            class="material-icons admin-list-items-button"
            on:click={() => dispatch('removeJoke', { jokeId: joke._id })}
            >delete</IconButton
          >
        </Item>
      {/each}
    </List>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

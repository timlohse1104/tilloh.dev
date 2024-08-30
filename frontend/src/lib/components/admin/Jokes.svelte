<script lang="ts">
  import type { JokeDto } from '$lib/types/jokes.dto';
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
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Jokes</h2>
  </div>
  <List threeLine avatarList singleSelection>
    {#each jokes as joke, i}
      <Item class="admin-list-items">
        <Graphic class="material-icons admin-list-items-icon"
          >settings_accessibility</Graphic
        >
        <Text class="admin-list-items-text">
          <PrimaryText>{joke.text}</PrimaryText>
          <SecondaryText>{joke._id}</SecondaryText>
          <SecondaryText
            >✨{new Date(joke.created).toLocaleString('de-DE')} 🔧{new Date(
              joke.updated,
            ).toLocaleString('de-DE')}</SecondaryText
          >
        </Text>
        <IconButton
          class="material-icons admin-list-items-button"
          on:click={() => dispatch('removeJoke', { jokeId: joke._id })}
          >delete</IconButton
        >
      </Item>
    {/each}
  </List>
</section>

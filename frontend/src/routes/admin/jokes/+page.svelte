<script lang="ts">
  import { deleteJoke } from '$lib/api/jokes.api';
  import Jokes from '$lib/components/admin/Jokes.svelte';
  import {
    adminJokesStore,
    adminTokenStore,
    confirmDeleteJokeActionStore,
    confirmDeleteJokeOpenOverlayStore,
    updateJokes,
  } from '$lib/util/stores/stores-admin';
  import { getContext } from 'svelte';

  const updateDashboard = getContext<() => void>('updateDashboard');

  const removeJoke = async (event) => {
    $confirmDeleteJokeActionStore = async () => {
      const { jokeId } = event.detail;
      console.log('removing joke', { jokeId }, '...');
      try {
        await deleteJoke($adminTokenStore, jokeId);
      } catch (error) {
        console.error('Error deleting identifier', error);
        return;
      }

      const deletedJoke = $adminJokesStore.find((joke) => joke._id === jokeId);
      console.log({ deletedIdentifier: deletedJoke }, 'Joke deleted.');
      await updateJokes($adminTokenStore);
    };

    $confirmDeleteJokeOpenOverlayStore = true;
  };
</script>

<Jokes on:removeJoke={removeJoke} on:updateDashboard={updateDashboard} />

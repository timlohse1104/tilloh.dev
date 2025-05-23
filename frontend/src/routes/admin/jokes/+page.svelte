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
  import { t } from '$lib/util/translations';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  const updateDashboard = getContext<() => void>('updateDashboard');

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

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
      triggerNotification(jokeId);
    };

    $confirmDeleteJokeOpenOverlayStore = true;
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.jokes.jokeDeleted', {
      id,
    });
    timeout = 3_000;
  };
</script>

<Jokes on:removeJoke={removeJoke} on:updateDashboard={updateDashboard} />

{#if showNotification}
  <div transition:fade>
    <InlineNotification
      {timeout}
      kind="info-square"
      subtitle={notificationInfoText}
      class="inline_notification"
      on:close={(e) => {
        timeout = undefined;
        notificationInfoText = undefined;
      }}
    />
  </div>
{/if}

<script lang="ts">
  // 1. IMPORTS
  import { updateJoke } from '$lib/api/jokes.api';
  import {
    adminJokesStore,
    adminTokenStore,
  } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import CopyButton from 'carbon-components-svelte/src/CopyButton/CopyButton.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import FaceActivated from 'carbon-icons-svelte/lib/FaceActivated.svelte';
  import TaskApproved from 'carbon-icons-svelte/lib/TaskApproved.svelte';
  import ThumbsUp from 'carbon-icons-svelte/lib/ThumbsUp.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { fade } from 'svelte/transition';

  // 2. PROPS
  let {
    onUpdateDashboard = () => {},
    onRemoveJoke = (jokeId: string) => {}
  } = $props();

  // 4. STATE
  let notificationInfoText = $state('');
  let timeout = $state(undefined);

  // 5. DERIVED
  const showNotification = $derived(timeout !== undefined);

  // 8. FUNCTIONS
  const verifyJoke = async (jokeId: string) => {
    console.log({ jokeId }, 'Verifying joke...');
    const updateJokeResponse = await updateJoke($adminTokenStore, jokeId, {
      verified: true,
    });

    if (updateJokeResponse.verified) {
      console.log({ updateJokeResponse }, 'Joke verified.');
    } else {
      console.error('Joke verification failed.');
    }

    onUpdateDashboard();
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.copiedToClipboard', {
      id,
    });
    timeout = 3_000;
  };
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.jokes.title')} <span>({$adminJokesStore.length})</span>
      </h2>
    </div>
    <Accordion class="mt1">
      {#each $adminJokesStore as joke}
        <AccordionItem>
          <svelte:fragment slot="title">
            <div class="admin_list_item_headline">
              <FaceActivated />
              {#if !joke.verified && joke.verified !== undefined}
                <TaskApproved />
              {/if}
              {joke.text}
            </div>
          </svelte:fragment>
          <div class="admin_list_item_content">
            <div>
              <p>
                ✨{new Date(joke.created).toLocaleString('de-DE')}
                📅{new Date(joke.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{joke._id}
              </p>
            </div>
            <div class="admin_list_button_group">
              {#if !joke.verified && joke.verified !== undefined}
                <Button
                  kind="tertiary"
                  size="field"
                  iconDescription={$t('page.admin.jokes.approval')}
                  icon={ThumbsUp}
                  on:click={() => verifyJoke(joke._id)}
                />
              {/if}
              <CopyButton
                text={joke._id}
                feedback="✅"
                feedbackTimeout={0}
                iconDescription={$t('page.admin.jokes.idCopy')}
                on:click={() => triggerNotification(joke._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription={$t('page.admin.jokes.deleteTitle')}
                tooltipAlignment="end"
                icon={TrashCan}
                onclick={() => {
                  onRemoveJoke(joke._id);
                }}
              />
            </div>
          </div>
        </AccordionItem>
      {/each}
    </Accordion>

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
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<script lang="ts">
  import { updateJoke } from '$lib/api/jokes.api';
  import {
    adminJokesStore,
    adminTokenStore,
  } from '$lib/util/stores/stores-admin';
  import { initialized, t } from '$lib/util/translations';
  import {
    Accordion,
    AccordionItem,
    Button,
    CopyButton,
    InlineNotification,
  } from 'carbon-components-svelte';
  import {
    FaceActivated,
    TaskApproved,
    ThumbsUp,
    TrashCan,
  } from 'carbon-icons-svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  const dispatch = createEventDispatcher();

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

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

    dispatch('updateDashboard');
  };

  const triggerNotification = (type: string, id: string) => {
    if (type === 'copy') {
      notificationInfoText = $t('page.admin.copiedToClipboard', {
        id,
      });
    } else if (type === 'delete') {
      notificationInfoText = $t('page.admin.jokes.jokeDeleted', {
        id,
      });
    }
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
              <svelte:component this={FaceActivated} />
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
                  iconDescription="TODO"
                  icon={ThumbsUp}
                  on:click={() => verifyJoke(joke._id)}
                />
              {/if}
              <CopyButton
                text={joke._id}
                feedback="👍"
                iconDescription="TODO"
                on:click={() => triggerNotification('copy', joke._id)}
              />
              <Button
                kind="danger"
                size="field"
                iconDescription="TODO"
                icon={TrashCan}
                on:click={() => {
                  dispatch('removeIdentifier', {
                    identifierId: joke._id,
                  });
                  triggerNotification('delete', joke._id);
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
          lowContrast
          subtitle={notificationInfoText}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
            notificationInfoText = undefined;
            console.log(e.detail.timeout);
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

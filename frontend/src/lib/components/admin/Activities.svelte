<script lang="ts">
  import { ActivityTypeDto, type ActivityDto } from '$lib/types/admin.dto';
  import { initialized, t } from '$lib/util/translations';
  import {
    Accordion,
    AccordionItem,
    CopyButton,
    InlineNotification,
  } from 'carbon-components-svelte';
  import FaceActivated from 'carbon-icons-svelte/lib/FaceActivated.svelte';
  import Information from 'carbon-icons-svelte/lib/Information.svelte';
  import Link from 'carbon-icons-svelte/lib/Link.svelte';
  import User from 'carbon-icons-svelte/lib/User.svelte';
  import { fade } from 'svelte/transition';

  export let activities: ActivityDto[] = [];

  let copiedId = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case ActivityTypeDto.PRESET:
        return Link;
      case ActivityTypeDto.IDENTIFIER:
        return User;
      case ActivityTypeDto.JOKE:
        return FaceActivated;
      default:
        return Information;
    }
  };

  const triggerNotification = (activityId) => {
    copiedId = activityId;
    timeout = 3_000;
  };
</script>

{#if $initialized}
  <section class="admin_sections">
    <div class="admin_sections_headline">
      <h2>
        {$t('page.admin.activities.title')} <span>({activities.length})</span>
      </h2>
    </div>
    <Accordion class="mt1">
      {#each activities as activity}
        <AccordionItem>
          <svelte:fragment slot="title">
            <div class="list_item_headline">
              <svelte:component this={getActivityTypeIcon(activity.type)} />
              {activity.description}
            </div>
          </svelte:fragment>
          <div class="list_item_content">
            <div>
              <p>
                📅{new Date(activity.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{activity.id}
              </p>
            </div>
            <CopyButton
              text={activity.id}
              feedback="👍"
              iconDescription="TODO"
              on:click={() => triggerNotification(activity.id)}
            />
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
          subtitle={$t('page.admin.copiedToClipboard', {
            id: copiedId,
          })}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
            copiedId = undefined;
            console.log(e.detail.timeout);
          }}
        />
      </div>
    {/if}
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  p {
    text-align: left;
  }

  .list_item_headline {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-left: calc(var(--default_padding) / 2);
  }

  .list_item_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: calc(var(--default_padding) / 2);
    padding-right: calc(var(--default_padding) / 2);
    width: calc(100vw - var(--default_padding) * 2);
  }
</style>

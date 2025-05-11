<script lang="ts">
  import { ActivityTypeDto, type ActivityDto } from '$lib/types/admin.dto';
  import { initialized, t } from '$lib/util/translations';
  import Snackbar, { Label } from '@smui/snackbar';
  import {
    Accordion,
    AccordionItem,
    CopyButton,
  } from 'carbon-components-svelte';

  export let activities: ActivityDto[] = [];

  console.log(activities);

  let copyToClipboardSnackbar;
  let copiedId = '';

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case ActivityTypeDto.PRESET:
        return 'link';
      case ActivityTypeDto.IDENTIFIER:
        return 'person';
      case ActivityTypeDto.JOKE:
        return '😂';
      default:
        return 'info';
    }
  };

  const copyIdToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    copiedId = id;
    copyToClipboardSnackbar.open();
    // copiedId = '';
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
        <AccordionItem title={activity.description}>
          <div class="activity_list_item_content">
            <div>
              <p>
                📅{new Date(activity.updated).toLocaleString('de-DE')}
              </p>
              <p>
                🆔{activity.id}
              </p>
            </div>
            <CopyButton text={activity.id} />
          </div>
        </AccordionItem>
      {/each}
    </Accordion>
  </section>

  <Snackbar bind:this={copyToClipboardSnackbar}>
    <Label
      >{$t('page.admin.activities.copiedToClipboard', {
        id: copiedId,
      })}</Label
    >
  </Snackbar>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  p {
    text-align: left;
  }

  .activity_list_item_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: calc(var(--default_padding) / 2);
    padding-right: calc(var(--default_padding) / 2);
    width: calc(100vw - var(--default_padding) * 2);
  }
</style>

<script lang="ts">
  import { ActivityTypeDto } from '$lib/types/admin.dto';
  import {
    adminIdentifiersStore,
    adminJokesStore,
    adminLinkPresetStore,
  } from '$lib/util/stores/stores-admin';
  import { t } from '$lib/util/translations';
  import Activities from '../../lib/components/admin/Activities.svelte';

  $: getLatestActivities = () => {
    const activities = [
      ...$adminLinkPresetStore.map((preset) => ({
        type: ActivityTypeDto.PRESET,
        id: preset.identifier,
        description: `${$t('page.admin.activities.keyActivity')} ${preset.created === preset.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: preset.updated,
        created: preset.created,
      })),
      ...$adminIdentifiersStore.map((identifier) => ({
        type: ActivityTypeDto.IDENTIFIER,
        id: identifier._id,
        description: `${$t('page.admin.activities.identifierActivity')} ${identifier.created === identifier.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: identifier.updated,
        created: identifier.created,
      })),
      ...$adminJokesStore.map((joke) => ({
        type: ActivityTypeDto.JOKE,
        id: joke._id,
        description: `${$t('page.admin.activities.jokeActivity')} ${joke.created === joke.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: joke.updated,
        created: joke.created,
      })),
    ].slice(0, 10);
    console.log({ activities }, 'Activities reloaded.');
    return activities.sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    );
  };
</script>

<section>
  <Activities activities={getLatestActivities()} />
</section>

<style lang="scss">
  @use '../../lib/styles/variables.scss' as *;

  :root {
    --min-content-width: 550px;
  }

  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 90dvh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .admin_overview {
    display: grid;
    width: 100%;
    margin-top: 1rem;
  }

  :global(.admin_sections) {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  :global(.admin_sections_headline) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1rem;
  }

  :global(.admin_sections_headline h2 span) {
    font-size: 0.65rem;
    color: var(--color_text-secondary);
  }

  :global(.admin_sections_list) {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 60vh;
  }

  :global(.admin_list_items) {
    display: flex;
  }
  :global(.admin_list_items_icon) {
    flex-grow: 1;
  }
  :global(.admin_list_items_text) {
    flex-grow: 100;
    margin-right: 1rem;
    text-align: start;
  }
  :global(.admin_list_items_button) {
    flex-grow: 1;
  }
</style>

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

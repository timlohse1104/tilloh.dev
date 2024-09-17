<script lang="ts">
  import { ActivityTypeDto, type ActivityDto } from '$lib/types/admin.dto';
  import { initialized, t } from '$lib/util/translations';
  import List, {
    Graphic,
    Item,
    PrimaryText,
    SecondaryText,
    Text,
  } from '@smui/list';

  export let activities: ActivityDto[] = [];

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
</script>

{#if $initialized}
  <section class="admin-sections">
    <div class="admin-sections-headline">
      <h2>{$t('page.admin.activities.title')}</h2>
    </div>
    <List threeLine avatarList singleSelection>
      {#each activities as activity}
        <Item class="admin-list-items">
          <Graphic class="material-icons admin-list-items-icon"
            >{getActivityTypeIcon(activity.type)}</Graphic
          >
          <Text class="admin-list-items-text">
            <PrimaryText>{activity.description}</PrimaryText>
            <SecondaryText>🆔{activity.id}</SecondaryText>
            <SecondaryText
              >🔧{new Date(activity.updated).toLocaleString(
                'de-DE',
              )}</SecondaryText
            >
          </Text>
        </Item>
      {/each}
    </List>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

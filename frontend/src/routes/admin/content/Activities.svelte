<script lang="ts">
  import { ActivityTypeDto, type ActivityDto } from '$lib/types/admin.dto';
  import { PrimaryText, SecondaryText, Text } from '@smui/list';
  import Graphic from '@smui/list/src/Graphic.svelte';
  import Item from '@smui/list/src/Item.svelte';
  import List from '@smui/list/src/List.svelte';

  export let activities: ActivityDto[] = [];

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case ActivityTypeDto.PRESET:
        return 'link';
      case ActivityTypeDto.IDENTIFIER:
        return 'person';
      default:
        return 'info';
    }
  };
</script>

<section class="admin-sections">
  <div class="admin-sections-headline">
    <h2>Activities</h2>
  </div>
  <List twoLine avatarList singleSelection>
    {#each activities as activity}
      <Item class="admin-list-items">
        <Graphic class="material-icons admin-list-items-icon"
          >{getActivityTypeIcon(activity.type)}</Graphic
        >
        <Text class="admin-list-items-text">
          <PrimaryText>{activity.description}</PrimaryText>
          <SecondaryText
            >🆔{activity.id} 🔧{new Date(activity.updated).toLocaleString(
              'de-DE',
            )}</SecondaryText
          >
        </Text>
      </Item>
    {/each}
  </List>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 90vw;
    flex-wrap: wrap;
    justify-content: center;

    h2 {
      margin: 3rem 0 0 0;
    }
  }
</style>

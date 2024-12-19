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
  import Snackbar, { Label } from '@smui/snackbar';

  export let activities: ActivityDto[] = [];

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
    <List threeLine avatarList singleSelection class="admin_sections_list">
      {#each activities as activity}
        <Item
          class="admin_list_items"
          on:SMUI:action={() => copyIdToClipboard(activity.id)}
        >
          <Graphic class="material-icons admin_list_items_icon"
            >{getActivityTypeIcon(activity.type)}</Graphic
          >
          <Text class="admin_list_items_text">
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

<script lang="ts">
  import {
    currentListIndexStore,
    listStore,
    newListIndexStore,
  } from '$lib/util/stores/store-list';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { t } from '$lib/util/translations';
  import Button, { Icon, Label } from '@smui/button';

  const showListOverlay = (type: 'new' | 'edit', index?: number) => {
    if (type === 'new') {
      $newListIndexStore = $listStore.length;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    } else {
      $currentListIndexStore = index;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    }
  };
</script>

<div style="display:flex;justify-content:center;">
  <Button
    color={$listStore.length === 0 ? 'primary' : 'secondary'}
    variant="outlined"
    on:click={() => showListOverlay('new')}
    style="margin: var(--default_padding);"
  >
    <Icon class="material-icons">playlist_add</Icon>
    <Label>{$t('page.lists.sideMenu.createNewList')}</Label>
  </Button>
</div>

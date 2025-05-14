<script lang="ts">
  import { deleteKey } from '$lib/api/keystore.api';
  import Toggles from '$lib/components/admin/Toggles.svelte';
  import { TOGGLE_KEY_IDENTIFIER } from '$lib/types/keystore.dto';
  import {
    adminTogglesStore,
    adminTokenStore,
    confirmDeleteToggleActionStore,
    confirmDeleteToggleOpenOverlayStore,
  } from '$lib/util/stores/stores-admin';
  import { t } from '$lib/util/translations';
  import { InlineNotification } from 'carbon-components-svelte';
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const updateDashboard = getContext<() => void>('updateDashboard');

  const removeToggle = async (event) => {
    $confirmDeleteToggleActionStore = async () => {
      const { id } = event.detail;
      const toggle = $adminTogglesStore.find((t) => t._id === id);
      console.log({ toggle }, 'Removing toggle...');

      try {
        await deleteKey($adminTokenStore, {
          identifier: TOGGLE_KEY_IDENTIFIER,
          key: toggle.key,
        });
      } catch (error) {
        console.error('Error deleting toggle', error);
        return;
      }
      console.log({ toggle }, 'Toggle deleted.');
      await updateDashboard();
      triggerNotification(id);
    };

    $confirmDeleteToggleOpenOverlayStore = true;
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.linkPresets.linkPresetDeleted', {
      id,
    });
    timeout = 3_000;
  };
</script>

<Toggles on:updateDashboard={updateDashboard} on:removeToggle={removeToggle} />

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

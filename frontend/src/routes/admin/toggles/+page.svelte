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
  import { getContext } from 'svelte';

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
    };

    $confirmDeleteToggleOpenOverlayStore = true;
  };
</script>

<Toggles on:updateDashboard={updateDashboard} on:removeToggle={removeToggle} />

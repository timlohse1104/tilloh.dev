<script lang="ts">
  import { deleteKey } from '$lib/api/keystore.api';
  import LinkPresets from '$lib/components/admin/LinkPresets.svelte';
  import {
    adminLinkPresetStore,
    adminTokenStore,
    confirmDeletePresetActionStore,
    confirmDeletePresetOpenOverlayStore,
    updateLinkPresets,
  } from '$lib/util/stores/stores-admin';

  const removeLinkPreset = async (event) => {
    $confirmDeletePresetActionStore = async () => {
      const { identifier, key } = event.detail;
      console.log('removing link preset', { identifier, key }, '...');
      try {
        await deleteKey($adminTokenStore, { identifier, key });
      } catch (error) {
        console.error('Error deleting identifier', error);
        return;
      }

      const deletedLinkPreset = $adminLinkPresetStore.find(
        (preset) => preset.identifier === identifier && preset.key === key,
      );
      console.log({ deletedLinkPreset }, 'Link preset deleted.');
      await updateLinkPresets($adminTokenStore);
    };

    $confirmDeletePresetOpenOverlayStore = true;
  };
</script>

<LinkPresets on:removeLinkPresets={removeLinkPreset} />

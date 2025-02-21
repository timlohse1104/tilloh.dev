<script lang="ts">
  import { deleteIdentifier } from '$lib/api/identifiers.api';
  import Identifiers from '$lib/components/admin/Identifiers.svelte';
  import {
    adminIdentifiersStore,
    adminTokenStore,
    confirmDeleteIdentifierActionStore,
    confirmDeleteIdentifierOpenOverlayStore,
    updateIdentifiers,
  } from '$lib/util/stores/stores-admin';

  const removeIdentifier = async (event) => {
    $confirmDeleteIdentifierActionStore = async () => {
      const { identifierId } = event.detail;
      console.log('removing identifier', { identifierId }, '...');
      try {
        await deleteIdentifier($adminTokenStore, identifierId);
      } catch (error) {
        console.error('Error deleting identifier', error);
        return;
      }

      const deletedIdentifier = $adminIdentifiersStore.find(
        (identifier) => identifier._id === identifierId,
      );
      console.log({ deletedIdentifier }, 'Identifier deleted.');
      await updateIdentifiers($adminTokenStore);
    };

    $confirmDeleteIdentifierOpenOverlayStore = true;
  };
</script>

<Identifiers on:removeIdentifier={removeIdentifier} />

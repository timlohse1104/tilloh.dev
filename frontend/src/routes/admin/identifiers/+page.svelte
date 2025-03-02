<script lang="ts">
  import { deleteIdentifier } from '$lib/api/identifiers.api';
  import Identifiers from '$lib/components/admin/Identifiers.svelte';
  import { utilityRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import {
    adminIdentifiersStore,
    adminTokenStore,
    confirmDeleteIdentifierActionStore,
    confirmDeleteIdentifierOpenOverlayStore,
    updateIdentifiers,
  } from '$lib/util/stores/stores-admin';
  import { getContext } from 'svelte';

  const { admin: adminRoute } = utilityRoutes;
  const updateDashboard = getContext<() => void>('updateDashboard');

  $: locale = $languageStore;

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

<svelte:head>
  <title>{adminRoute.name[locale]}</title>
  <meta name={adminRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<Identifiers
  on:removeIdentifier={removeIdentifier}
  on:updateDashboard={updateDashboard}
/>

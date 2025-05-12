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
  import { t } from '$lib/util/translations';
  import { InlineNotification } from 'carbon-components-svelte';
  import { getContext } from 'svelte';
  import { fade } from 'svelte/transition';

  const { admin: adminRoute } = utilityRoutes;
  const updateDashboard = getContext<() => void>('updateDashboard');

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;
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
      triggerNotification(identifierId);
    };

    $confirmDeleteIdentifierOpenOverlayStore = true;
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.identifiers.identifierDeleted', {
      id,
    });
    timeout = 3_000;
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
        console.log(e.detail.timeout);
      }}
    />
  </div>
{/if}

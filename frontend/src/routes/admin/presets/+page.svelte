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
  import { t } from '$lib/util/translations';
  import { InlineNotification } from 'carbon-components-svelte';
  import { fade } from 'svelte/transition';

  let notificationInfoText = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;

  const removeLinkPreset = async (event) => {
    $confirmDeletePresetActionStore = async () => {
      const { identifier, key, keyId } = event.detail;
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
      triggerNotification(keyId);
    };

    $confirmDeletePresetOpenOverlayStore = true;
  };

  const triggerNotification = (id: string) => {
    notificationInfoText = $t('page.admin.linkPresets.linkPresetDeleted', {
      id,
    });
    timeout = 3_000;
  };
</script>

<LinkPresets on:removeLinkPresets={removeLinkPreset} />

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

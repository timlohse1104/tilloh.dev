<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import { deleteKey, getKeystore } from '$lib/api/keystore.api';
  import { utilityRoutes } from '$lib/config/applications';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import type { KeystoreKeyDto } from '$lib/types/keystore.dto';
  import type { FolderDto } from '$lib/types/memorandum.dto';
  import { isEnter } from '$lib/util/helper.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import Dashboard from './content/Dashboard.svelte';
  import Identifiers from './content/Identifiers.svelte';
  import Memorandum from './content/Memorandum.svelte';

  const { admin: adminRoute } = utilityRoutes;
  let adminToken = '';
  let isVerified = false;
  let verificationError = '';
  let identifiers: IdentifierDto[] = [];
  let linkPresets: KeystoreKeyDto[] = [];
  let allPresetFolders: FolderDto[] = [];

  $: getFolderAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    return allPresetFolders.length;
  };
  $: getLinksAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    const allLinks = allPresetFolders.map((folder) => folder.links).flat();
    return allLinks.length;
  };

  async function verifyId() {
    const verifyResponse = await verifyAdminId(adminToken);

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      console.error('Error verifying admin ID');
      isVerified = false;
      return;
    }

    const { isAdmin } = verifyResponse;
    if (!isAdmin) {
      verificationError = 'Admin ID konnte nicht verifiziert werden.';
      isVerified = false;
      return;
    }
    isVerified = verifyResponse.isAdmin;
    loadIdentifiers();
    loadLinkPresets();
  }

  const loadLinkPresets = async () => {
    const keystoreResponse = await getKeystore(adminToken);
    const linkPresetKey = 'memorandum.link-preset';
    linkPresets = keystoreResponse.filter(
      (preset) => preset.key === linkPresetKey,
    );
    console.log({ linkPresets }, 'Link presets reloaded.');
    loadPresetFolders();
  };

  const loadPresetFolders = () => {
    if (linkPresets.length === 0) return;
    allPresetFolders = linkPresets
      .map((preset) => JSON.parse(preset.value).Folders)
      .flat();
    console.log(
      { presetFolders: allPresetFolders },
      'Preset folders initialized.',
    );
  };

  const removeLinkPreset = async (event) => {
    const { identifier, key } = event.detail;
    console.log('removing link preset', { identifier, key }, '...');
    try {
      await deleteKey(adminToken, { identifier, key });
    } catch (error) {
      console.error('Error deleting identifier', error);
      return;
    }

    const deletedLinkPreset = linkPresets.find(
      (preset) => preset.identifier === identifier && preset.key === key,
    );
    console.log({ deletedLinkPreset }, 'Link preset deleted.');
    linkPresets = linkPresets.filter(
      (preset) => preset.identifier !== identifier || preset.key !== key,
    );
  };

  const loadIdentifiers = async () => {
    identifiers = await getIdentifiers(adminToken);
    console.log({ identifiers }, 'Identifiers reloaded.');
  };

  const removeIdentifier = async (event) => {
    const { identifierId } = event.detail;
    console.log('removing link preset', { identifierId }, '...');
    try {
      await deleteIdentifier(adminToken, identifierId);
    } catch (error) {
      console.error('Error deleting identifier', error);
      return;
    }

    const deletedIdentifier = identifiers.find(
      (identifier) => identifier._id === identifierId,
    );
    console.log({ deletedIdentifier }, 'Identifier deleted.');
    identifiers = identifiers.filter(
      (identifier) => identifier._id !== identifierId,
    );
  };
</script>

<svelte:head>
  <title>{adminRoute.name}</title>
  <meta name={adminRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  <div class="main-content">
    {#if !isVerified}
      <Textfield
        variant="outlined"
        bind:value={adminToken}
        label="Admin ID"
        style="margin-top: 1rem; width: 100%; max-width: 300px;"
        on:keyup={(event) => {
          if (isEnter(event)) verifyId();
        }}
      >
        <Icon class="material-icons" slot="leadingIcon">fingerprint</Icon>
        <Icon class="material-icons" slot="trailingIcon"
          >arrow_circle_right</Icon
        >
        <HelperText
          persistent
          slot="helper"
          style="color: red; font-size: 0.8rem;">{verificationError}</HelperText
        >
      </Textfield>
    {:else}
      <div class="admin-overview">
        <h1>Admin Panel</h1>

        <Dashboard
          identifierAmount={identifiers.length}
          presetAmounts={linkPresets.length}
          presetFolderAmount={getFolderAmount()}
          presetLinksAmount={getLinksAmount()}
        />
      </div>

      <div class="admin-content">
        <Identifiers
          {identifiers}
          on:reloadIdentifiers={loadIdentifiers}
          on:removeIdentifier={removeIdentifier}
        />
        <Memorandum
          {linkPresets}
          on:reloadLinkPresets={loadLinkPresets}
          on:removeLinkPresets={removeLinkPreset}
        />
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.8;
    width: 100%;
    height: 100%;

    .main-content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;
      width: 100%;
      height: 90dvh;
      overflow-x: hidden;
      overflow-y: scroll;
    }
  }

  .admin-overview {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    h1 {
      margin: 0;
      padding-top: 2rem;
      display: fixed;
    }
  }

  .admin-content {
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: center;
    gap: 1rem;
    width: 90vw;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  :global(.admin-sections) {
    display: flex;
    flex-direction: column;
    width: 600px;
  }

  :global(.admin-sections-headline) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1rem;
  }

  :global(.admin-list-items) {
    display: flex;
  }
  :global(.admin-list-items-icon) {
    flex-grow: 1;
  }
  :global(.admin-list-items-text) {
    flex-grow: 100;
    margin-right: 1rem;
    text-align: start;
  }
  :global(.admin-list-items-button) {
    flex-grow: 1;
  }
</style>

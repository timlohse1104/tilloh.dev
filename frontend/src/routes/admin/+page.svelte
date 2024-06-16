<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import { deleteKey, getKeystore } from '$lib/api/keystore.api';
  import { utilityRoutes } from '$lib/config/applications';
  import { ActivityTypeDto } from '$lib/types/admin.dto';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import type { KeystoreKeyDto } from '$lib/types/keystore.dto';
  import type { FolderDto } from '$lib/types/memorandum.dto';
  import { isEnter } from '$lib/util/helper.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import Activities from './content/Activities.svelte';
  import Dashboard from './content/Dashboard.svelte';
  import Identifiers from './content/Identifiers.svelte';
  import LinkPresets from './content/LinkPresets.svelte';

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

  $: getLatestActivities = () => {
    const activities = [
      ...linkPresets.map((preset) => ({
        type: ActivityTypeDto.PRESET,
        id: preset.identifier,
        description: `Key ${preset.key} got ${preset.created === preset.updated ? 'created' : 'updated'}.`,
        updated: preset.updated,
        created: preset.created,
      })),
      ...identifiers.map((identifier) => ({
        type: ActivityTypeDto.IDENTIFIER,
        id: identifier._id,
        description: `Identifier ${identifier.name} got ${identifier.created === identifier.updated ? 'created' : 'updated'}.`,
        updated: identifier.updated,
        created: identifier.created,
      })),
    ].slice(0, 10);
    console.log({ activities }, 'Activities reloaded.');
    return activities.sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    );
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
    await loadLinkPresets();
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
    await loadIdentifiers();
  };

  const updateDashboard = async () => {
    await loadLinkPresets();
    await loadIdentifiers();
    console.log('Dashboard updated.');
  };
</script>

<svelte:head>
  <title>{adminRoute.name}</title>
  <meta name={adminRoute.name} content="tilloh.dev" />
</svelte:head>

<section>
  {#if !isVerified}
    <div class="verify-content">
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
    </div>
  {:else}
    <div class="admin-overview">
      <h1>Admin Panel</h1>

      <Dashboard
        identifierAmount={identifiers.length}
        presetAmounts={linkPresets.length}
        presetFolderAmount={getFolderAmount()}
        presetLinksAmount={getLinksAmount()}
        on:updateDashboard={updateDashboard}
      />

      <Activities activities={getLatestActivities()} />
    </div>

    <div class="admin-content">
      <Identifiers {identifiers} on:removeIdentifier={removeIdentifier} />
      <LinkPresets {linkPresets} on:removeLinkPresets={removeLinkPreset} />
    </div>
  {/if}
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    width: 100%;
    height: 90dvh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .verify-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
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

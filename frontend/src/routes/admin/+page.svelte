<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { getChats } from '$lib/api/chats.api';
  import { livez, readyz } from '$lib/api/health.api';
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import { getJokes } from '$lib/api/jokes.api';
  import { deleteKey, getKeystore } from '$lib/api/keystore.api';
  import { utilityRoutes } from '$lib/config/applications';
  import { ActivityTypeDto } from '$lib/types/admin.dto';
  import type { ChatDto } from '$lib/types/chats.dto';
  import type { IdentifierDto } from '$lib/types/identifiers.dto';
  import type { JokeDto } from '$lib/types/jokes.dto';
  import {
    TOGGLE_KEY_IDENTIFIER,
    type KeystoreKeyDto,
  } from '$lib/types/keystore.dto';
  import type { FolderDto } from '$lib/types/memorandum.dto';
  import { TogglesEnum } from '$lib/types/toggle.dto';
  import { isEnter } from '$lib/util/helper.js';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import Activities from '../../lib/components/admin/Activities.svelte';
  import Dashboard from '../../lib/components/admin/Dashboard.svelte';
  import Identifiers from '../../lib/components/admin/Identifiers.svelte';
  import LinkPresets from '../../lib/components/admin/LinkPresets.svelte';
  import Toggles from '../../lib/components/admin/Toggles.svelte';

  const { admin: adminRoute } = utilityRoutes;
  let adminToken = '';
  let isVerified = false;
  let verificationError = '';
  let identifiers: IdentifierDto[] = [];
  let linkPresets: KeystoreKeyDto[] = [];
  let allPresetFolders: FolderDto[] = [];
  let allChats: ChatDto[] = [];
  let allJokes: JokeDto[] = [];
  let allToggles: KeystoreKeyDto[] = [];
  let apiIsHealthy = false;
  let jokesIsHealthy = false;
  let mongoIsHealthy = false;

  $: getFolderAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    return allPresetFolders.length;
  };

  $: getLinksAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    const allLinks = allPresetFolders.map((folder) => folder.links).flat();
    return allLinks.length;
  };

  $: getJokesAmount = (): number => {
    if (allJokes.length === 0) return 0;
    return allJokes.length;
  };

  $: getChatsAmount = (): number => {
    if (allChats.length === 0) return 0;
    return allChats.length;
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
    await updateDashboard();
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

  const loadJokes = async () => {
    allJokes = await getJokes(adminToken);
    console.log({ allJokes }, 'Jokes reloaded.');
  };

  const loadChats = async () => {
    allChats = await getChats(adminToken);
    console.log({ allChats }, 'Chats reloaded.');
  };

  const loadToggles = async () => {
    const keystoreResponse = await getKeystore(adminToken);
    console.log({ keystoreResponse }, 'Keystore response.');
    allToggles = keystoreResponse.filter(
      (toggle) => toggle.identifier === TOGGLE_KEY_IDENTIFIER,
    );
    console.log({ allToggles }, 'Toggles reloaded.');
  };

  const removeToggle = async (event) => {
    const { id } = event.detail;
    const toggle = allToggles.find((t) => t._id === id);
    console.log({ toggle }, 'Removing toggle...');

    try {
      await deleteKey(adminToken, {
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

  const loadHealthChecks = async () => {
    const readyzRes = await readyz(adminToken);
    apiIsHealthy = readyzRes === 'ok';

    const livezRes = await livez(adminToken);
    const mongoMatch = livezRes.match(/^mongodb (\d+)/m);
    const jokesMatch = livezRes.match(/^witzapi (\d+)/m);
    const mongoStatusCode = mongoMatch ? parseInt(mongoMatch[1], 10) : 0;
    const jokesStatusCode = jokesMatch ? parseInt(jokesMatch[1], 10) : 0;

    mongoIsHealthy = !!mongoStatusCode;
    jokesIsHealthy = !!jokesStatusCode;

    console.log({ readyzRes, livezRes }, 'Health checks reloaded.');
  };

  const updateDashboard = async () => {
    await loadLinkPresets();
    await loadIdentifiers();
    await loadJokes();
    await loadChats();
    await loadToggles();
    await loadHealthChecks();
    console.log('Dashboard updated.');
  };

  $: getToggleState = (key: string) => {
    const toggle = allToggles.find(
      (t) => t.identifier === TOGGLE_KEY_IDENTIFIER && t.key === key,
    );
    if (!toggle) return true;
    return toggle?.value === 'true';
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
      {#if getToggleState(TogglesEnum.adminDashboard)}
        <Dashboard
          metrics={{
            identifierAmount: identifiers.length,
            presetAmounts: linkPresets.length,
            presetFolderAmount: getFolderAmount(),
            presetLinksAmount: getLinksAmount(),
            jokesAmount: getJokesAmount(),
            chatsAmount: getChatsAmount(),
            apiIsHealthy,
            jokesIsHealthy,
            mongoIsHealthy,
          }}
          on:updateDashboard={updateDashboard}
        />
      {/if}
    </div>

    <div class="admin-content">
      <Toggles
        toggles={allToggles}
        on:updateDashboard={updateDashboard}
        on:removeToggle={removeToggle}
      />
      {#if getToggleState(TogglesEnum.adminActivities)}
        <Activities activities={getLatestActivities()} />
      {/if}
      {#if getToggleState(TogglesEnum.adminIdentifiers)}
        <Identifiers {identifiers} on:removeIdentifier={removeIdentifier} />
      {/if}
      {#if getToggleState(TogglesEnum.adminLinkPreset)}
        <LinkPresets {linkPresets} on:removeLinkPresets={removeLinkPreset} />
      {/if}
    </div>
  {/if}
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  :root {
    --min-content-width: 550px;
  }

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
    align-items: start;
    width: 90vw;
    margin-top: 3rem;

    @media #{$tablet} {
      margin-top: 2rem;
    }

    @media #{$phone} {
      margin-top: 1rem;
    }
  }

  .admin-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(550px, 25%));
    width: 90vw;
    margin-top: 3rem;

    @media #{$tablet} {
      margin-top: 2rem;
    }

    @media #{$phone} {
      margin-top: 1rem;
    }
  }

  :global(.admin-sections) {
    display: flex;
    flex-direction: column;
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

<script lang="ts">
  import { verifyAdminId } from '$lib/api/admin.api';
  import { getChats } from '$lib/api/chats.api';
  import { livez, readyz } from '$lib/api/health.api';
  import { deleteIdentifier, getIdentifiers } from '$lib/api/identifiers.api';
  import { deleteJoke, getJokes } from '$lib/api/jokes.api';
  import { deleteKey, getKeystore } from '$lib/api/keystore.api';
  import Jokes from '$lib/components/admin/Jokes.svelte';
  import ConfirmOverlay from '$lib/components/shared/ConfirmOverlay.svelte';
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
  import { languageStore } from '$lib/util/languageStore';
  import { setLocale, t } from '$lib/util/translations';
  import Fab from '@smui/fab';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
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
  let chats: ChatDto[] = [];
  let jokes: JokeDto[] = [];
  let toggles: KeystoreKeyDto[] = [];
  let apiIsHealthy = false;
  let jokesIsHealthy = false;
  let mongoIsHealthy = false;
  let confirmDeleteToggleOpenOverlay = false;
  let confirmDeleteToggleAction;
  let confirmDeleteIdentifierOpenOverlay = false;
  let confirmDeleteIdentifierAction;
  let confirmDeleteJokeOpenOverlay = false;
  let confirmDeleteJokeAction;
  let confirmDeletePresetOpenOverlay = false;
  let confirmDeletePresetAction;

  $: locale = $languageStore;
  $: getFolderAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    return allPresetFolders.length;
  };

  $: getDuplicateFoldersAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    const folderNames = allPresetFolders.map((folder) => folder.folderName);
    const uniqueFolders = new Set(folderNames);
    return folderNames.length - uniqueFolders.size;
  };

  $: getLinksAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    const allLinks = allPresetFolders.map((folder) => folder.links).flat();
    return allLinks.length;
  };

  $: getDuplicateLinksAmount = (): number => {
    if (allPresetFolders.length === 0) return 0;
    const allLinks = allPresetFolders.map((folder) => folder.links).flat();
    const linkUrls = allLinks.map((link) => link.linkUrl);
    const uniqueLinks = new Set(linkUrls);
    return linkUrls.length - uniqueLinks.size;
  };

  $: getJokesAmount = (): number => {
    if (jokes.length === 0) return 0;
    return jokes.length;
  };

  $: getDuplicateJokesAmount = (): number => {
    if (jokes.length === 0) return 0;
    const jokeTexts = jokes.map((joke) => joke.text);
    const uniqueJokes = new Set(jokeTexts);
    return jokeTexts.length - uniqueJokes.size;
  };

  $: getChatsAmount = (): number => {
    if (chats.length === 0) return 0;
    return chats.length;
  };

  $: getLatestActivities = () => {
    const activities = [
      ...linkPresets.map((preset) => ({
        type: ActivityTypeDto.PRESET,
        id: preset.identifier,
        description: `${$t('page.admin.activities.keyActivity')} ${preset.created === preset.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: preset.updated,
        created: preset.created,
      })),
      ...identifiers.map((identifier) => ({
        type: ActivityTypeDto.IDENTIFIER,
        id: identifier._id,
        description: `${$t('page.admin.activities.identifierActivity')} ${identifier.created === identifier.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: identifier.updated,
        created: identifier.created,
      })),
      ...jokes.map((joke) => ({
        type: ActivityTypeDto.JOKE,
        id: joke._id,
        description: `${$t('page.admin.activities.jokeActivity')} ${joke.created === joke.updated ? $t('page.admin.activities.created') : $t('page.admin.activities.updated')}.`,
        updated: joke.updated,
        created: joke.created,
      })),
    ].slice(0, 10);
    console.log({ activities }, 'Activities reloaded.');
    return activities.sort(
      (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime(),
    );
  };

  const verifyId = async () => {
    const verifyResponse = await verifyAdminId(adminToken);

    if (!verifyResponse && verifyResponse?.statusCode !== 200) {
      console.error('Error verifying admin ID');
      isVerified = false;
      return;
    }

    const { isAdmin } = verifyResponse;
    if (!isAdmin) {
      verificationError = $t('page.admin.verificationError');
      isVerified = false;
      return;
    }
    isVerified = verifyResponse.isAdmin;
    await updateDashboard();
  };

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
    confirmDeletePresetAction = async () => {
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

    confirmDeletePresetOpenOverlay = true;
  };

  const loadIdentifiers = async () => {
    identifiers = await getIdentifiers(adminToken);
    console.log({ identifiers }, 'Identifiers reloaded.');
  };

  const removeIdentifier = async (event) => {
    confirmDeleteIdentifierAction = async () => {
      const { identifierId } = event.detail;
      console.log('removing identifier', { identifierId }, '...');
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

    confirmDeleteIdentifierOpenOverlay = true;
  };

  const loadJokes = async () => {
    jokes = await getJokes(adminToken);
    console.log({ allJokes: jokes }, 'Jokes reloaded.');
  };

  const removeJoke = async (event) => {
    confirmDeleteJokeAction = async () => {
      const { jokeId } = event.detail;
      console.log('removing joke', { jokeId }, '...');
      try {
        await deleteJoke(adminToken, jokeId);
      } catch (error) {
        console.error('Error deleting identifier', error);
        return;
      }

      const deletedJoke = jokes.find((joke) => joke._id === jokeId);
      console.log({ deletedIdentifier: deletedJoke }, 'Joke deleted.');
      await loadJokes();
    };

    confirmDeleteJokeOpenOverlay = true;
  };

  const loadChats = async () => {
    chats = await getChats(adminToken);
    console.log({ allChats: chats }, 'Chats reloaded.');
  };

  const loadToggles = async () => {
    const keystoreResponse = await getKeystore(adminToken);
    console.log({ keystoreResponse }, 'Keystore response.');
    toggles = keystoreResponse.filter(
      (toggle) => toggle.identifier === TOGGLE_KEY_IDENTIFIER,
    );
    console.log({ allToggles: toggles }, 'Toggles reloaded.');
  };

  const removeToggle = async (event) => {
    confirmDeleteToggleAction = async () => {
      const { id } = event.detail;
      const toggle = toggles.find((t) => t._id === id);
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

    confirmDeleteToggleOpenOverlay = true;
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
    const toggle = toggles.find(
      (t) => t.identifier === TOGGLE_KEY_IDENTIFIER && t.key === key,
    );
    if (!toggle) return true;
    return toggle?.value === 'true';
  };

  onMount(async () => {
    await setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{adminRoute.name[locale]}</title>
  <meta name={adminRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

<section>
  {#if !isVerified}
    <div class="verify_content">
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
        <HelperText slot="helper" style="color: red; font-size: 0.8rem;"
          >{verificationError}</HelperText
        >
      </Textfield>
    </div>
  {:else}
    <div class="admin_overview">
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
            duplicateJokesAmount: getDuplicateJokesAmount(),
            duplicateLinksAmount: getDuplicateLinksAmount(),
            duplicateFoldersAmount: getDuplicateFoldersAmount(),
          }}
          on:updateDashboard={updateDashboard}
        />
      {/if}
    </div>

    <div class="admin_content">
      <Toggles
        {toggles}
        on:updateDashboard={updateDashboard}
        on:removeToggle={removeToggle}
      />
      {#if getToggleState(TogglesEnum.adminActivities)}
        <Activities activities={getLatestActivities()} />
      {/if}
      {#if getToggleState(TogglesEnum.adminJokes)}
        <Jokes
          {jokes}
          on:removeJoke={removeJoke}
          on:updateDashboard={updateDashboard}
          {adminToken}
        />
      {/if}
      {#if getToggleState(TogglesEnum.adminLinkPreset)}
        <LinkPresets {linkPresets} on:removeLinkPresets={removeLinkPreset} />
      {/if}
      {#if getToggleState(TogglesEnum.adminIdentifiers)}
        <Identifiers {identifiers} on:removeIdentifier={removeIdentifier} />
      {/if}
    </div>

    <Fab
      style="position:fixed;bottom: var(--default_padding);right: var(--default_padding);z-index: 100;"
      color="secondary"
      on:click={updateDashboard}
    >
      <Icon style="font-size:2rem;" class="material-icons">refresh</Icon>
    </Fab>
  {/if}
</section>

<ConfirmOverlay
  open={confirmDeleteToggleOpenOverlay}
  questionHeader={$t('page.admin.toggles.deleteTitle')}
  questionContent={$t('page.admin.toggles.deleteQuestion')}
  noActionText={$t('page.shared.no')}
  noAction={() => (confirmDeleteToggleOpenOverlay = false)}
  yesActionText={$t('page.shared.yes')}
  yesAction={confirmDeleteToggleAction}
  on:close={() => (confirmDeleteToggleOpenOverlay = false)}
/>
<ConfirmOverlay
  open={confirmDeleteIdentifierOpenOverlay}
  questionHeader={$t('page.admin.identifiers.deleteTitle')}
  questionContent={$t('page.admin.identifiers.deleteQuestion')}
  noActionText={$t('page.shared.no')}
  noAction={() => (confirmDeleteIdentifierOpenOverlay = false)}
  yesActionText={$t('page.shared.yes')}
  yesAction={confirmDeleteIdentifierAction}
  on:close={() => (confirmDeleteIdentifierOpenOverlay = false)}
/>
<ConfirmOverlay
  open={confirmDeletePresetOpenOverlay}
  questionHeader={$t('page.admin.linkPreset.deleteTitle')}
  questionContent={$t('page.admin.linkPreset.deleteQuestion')}
  noActionText={$t('page.shared.no')}
  noAction={() => (confirmDeletePresetOpenOverlay = false)}
  yesActionText={$t('page.shared.yes')}
  yesAction={confirmDeletePresetAction}
  on:close={() => (confirmDeletePresetOpenOverlay = false)}
/>
<ConfirmOverlay
  open={confirmDeleteJokeOpenOverlay}
  questionHeader={$t('page.admin.jokes.deleteTitle')}
  questionContent={$t('page.admin.jokes.deleteQuestion')}
  noActionText={$t('page.shared.no')}
  noAction={() => (confirmDeleteJokeOpenOverlay = false)}
  yesActionText={$t('page.shared.yes')}
  yesAction={confirmDeleteJokeAction}
  on:close={() => (confirmDeleteJokeOpenOverlay = false)}
/>

<style lang="scss">
  @use '../../lib/styles/variables.scss' as *;

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

  .verify_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .admin_overview {
    display: grid;
    width: 100%;
    margin-top: 1rem;
  }

  .admin_content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(800px, 33%));
    width: 100%;
    margin-top: 2rem;

    @media #{$tablet} {
      grid-template-columns: 100%;
    }

    @media #{$phone} {
      margin-top: 1rem;
      grid-template-columns: 100%;
    }
  }

  :global(.admin_sections) {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  :global(.admin_sections_headline) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1rem;
  }

  :global(.admin_sections_headline h2 span) {
    font-size: 0.65rem;
    color: var(--color_text-secondary);
  }

  :global(.admin_sections_list) {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 60vh;
  }

  :global(.admin_list_items) {
    display: flex;
  }
  :global(.admin_list_items_icon) {
    flex-grow: 1;
  }
  :global(.admin_list_items_text) {
    flex-grow: 100;
    margin-right: 1rem;
    text-align: start;
  }
  :global(.admin_list_items_button) {
    flex-grow: 1;
  }
</style>

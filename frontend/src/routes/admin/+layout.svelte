<script lang="ts">
  // 1. IMPORTS
  import type { Snippet } from 'svelte';
  import { getChats } from '$lib/api/chats.api';
  import { livez, readyz } from '$lib/api/health.api';
  import { getKeystore } from '$lib/api/keystore.api';
  import Dashboard from '$lib/components/admin/Dashboard.svelte';
  import ConfirmOverlay from '$lib/components/shared/ConfirmOverlay.svelte';
  import GlobalLogin from '$lib/components/shared/GlobalLogin.svelte';
  import Navigation from '$lib/components/shared/Navigation.svelte';
  import { adminSubRoutes, utilityRoutes } from '$lib/config/applications';
  import type { ChatDto } from '$lib/types/chats.dto';
  import { TOGGLE_KEY_IDENTIFIER } from '$lib/types/keystore.dto';
  import { languageStore } from '$lib/util/stores/store-language';
  import {
    adminIdentifiersStore,
    adminJokesStore,
    adminLinkPresetStore,
    adminTogglesStore,
    adminTokenStore,
    allPresetFoldersStore,
    confirmDeleteIdentifierActionStore,
    confirmDeleteIdentifierOpenOverlayStore,
    confirmDeleteJokeActionStore,
    confirmDeleteJokeOpenOverlayStore,
    confirmDeletePresetActionStore,
    confirmDeletePresetOpenOverlayStore,
    confirmDeleteToggleActionStore,
    confirmDeleteToggleOpenOverlayStore,
    updateIdentifiers,
    updateJokes,
    updateLinkPresets,
  } from '$lib/util/stores/stores-admin';
  import { setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Renew from 'carbon-icons-svelte/lib/Renew.svelte';

  // 2. PROPS
  let { children }: { children: Snippet } = $props();

  // 3. CONST
  const { admin: adminRoute } = utilityRoutes;

  // 4. STATE
  let chats = $state<ChatDto[]>([]);
  let apiIsHealthy = $state(false);
  let jokesIsHealthy = $state(false);
  let mongoIsHealthy = $state(false);
  let isVerified = $state(false);

  // 5. DERIVED
  const locale = $derived($languageStore);
  const adminRoutesArray = $derived(Object.values(adminSubRoutes));

  const getFolderAmount = $derived(() => {
    if ($allPresetFoldersStore.length === 0) return 0;
    return $allPresetFoldersStore.length;
  });

  const getLinksAmount = $derived(() => {
    if ($allPresetFoldersStore.length === 0) return 0;
    const allLinks = $allPresetFoldersStore
      .map((folder) => folder.links)
      .flat();
    return allLinks.length;
  });

  const getJokesAmount = $derived(() => {
    if ($adminJokesStore.length === 0) return 0;
    return $adminJokesStore.length;
  });

  const getChatsAmount = $derived(() => {
    if (chats.length === 0) return 0;
    return chats.length;
  });

  const getDuplicateFoldersAmount = $derived(() => {
    if ($allPresetFoldersStore.length === 0) return 0;
    const folderNames = $allPresetFoldersStore.map(
      (folder) => folder.folderName,
    );
    const uniqueFolders = new Set(folderNames);
    return folderNames.length - uniqueFolders.size;
  });

  const getDuplicateLinksAmount = $derived(() => {
    if ($allPresetFoldersStore.length === 0) return 0;
    const allLinks = $allPresetFoldersStore
      .map((folder) => folder.links)
      .flat();
    const linkUrls = allLinks.map((link) => link.linkUrl);
    const uniqueLinks = new Set(linkUrls);
    return linkUrls.length - uniqueLinks.size;
  });

  const getDuplicateJokesAmount = $derived(() => {
    if ($adminJokesStore.length === 0) return 0;
    const jokeTexts = $adminJokesStore.map((joke) => joke.text);
    const uniqueJokes = new Set(jokeTexts);
    return jokeTexts.length - uniqueJokes.size;
  });

  // 6. FUNCTIONS
  const loadChats = async () => {
    chats = await getChats($adminTokenStore);
    console.log({ allChats: chats }, 'Chats reloaded.');
  };

  const loadToggles = async () => {
    const keystoreResponse = await getKeystore($adminTokenStore);
    console.log({ keystoreResponse }, 'Keystore response.');
    $adminTogglesStore = keystoreResponse.filter(
      (toggle) => toggle.identifier === TOGGLE_KEY_IDENTIFIER,
    );
    console.log({ allToggles: $adminTogglesStore }, 'Toggles reloaded.');
  };

  const loadHealthChecks = async () => {
    const readyzRes = await readyz($adminTokenStore);
    apiIsHealthy = readyzRes === 'ok';

    const livezRes = await livez($adminTokenStore);
    const mongoMatch = livezRes.match(/^mongodb (\d+)/m);
    const jokesMatch = livezRes.match(/^witzapi (\d+)/m);
    const mongoStatusCode = mongoMatch ? parseInt(mongoMatch[1], 10) : 0;
    const jokesStatusCode = jokesMatch ? parseInt(jokesMatch[1], 10) : 0;

    mongoIsHealthy = !!mongoStatusCode;
    jokesIsHealthy = !!jokesStatusCode;

    console.log({ readyzRes, livezRes }, 'Health checks reloaded.');
  };

  const updateDashboard = async () => {
    console.log('Updating dashboard.');
    await updateLinkPresets($adminTokenStore);
    await updateIdentifiers($adminTokenStore);
    await updateJokes($adminTokenStore);
    await loadChats();
    await loadToggles();
    await loadHealthChecks();
    console.log('Dashboard updated.');
  };

  // 7. LIFECYCLE
  import { setContext } from 'svelte';

  setContext('updateDashboard', updateDashboard);

  $effect.root(() => {
    setLocale($languageStore);
  });
</script>

<svelte:head>
  <title>{adminRoute.name[locale]}</title>
  <meta name={adminRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if !isVerified}
  <GlobalLogin
    bind:isVerified
    bind:token={$adminTokenStore}
    isAdminLogin={true}
    callback={updateDashboard}
  />
{:else}
  <div class="admin_overview">
    <Navigation routes={adminRoutesArray} />

    <Dashboard
      metrics={{
        identifierAmount: $adminIdentifiersStore.length,
        presetAmounts: $adminLinkPresetStore.length,
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
      onUpdateDashboard={updateDashboard}
    />
  </div>

  <main>
    <section>
      {@render children()}
    </section>
  </main>

  <Button
    kind="primary"
    iconDescription={$t('page.admin.updateInfo')}
    tooltipPosition="left"
    icon={Renew}
    id="update_admin_info_button"
    onclick={updateDashboard}
  />

  <ConfirmOverlay
    bind:open={$confirmDeleteToggleOpenOverlayStore}
    questionHeader={$t('page.admin.toggles.deleteTitle')}
    questionContent={$t('page.admin.toggles.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => ($confirmDeleteToggleOpenOverlayStore = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={$confirmDeleteToggleActionStore}
    onClose={() => ($confirmDeleteToggleOpenOverlayStore = false)}
  />
  <ConfirmOverlay
    bind:open={$confirmDeleteIdentifierOpenOverlayStore}
    questionHeader={$t('page.admin.identifiers.deleteTitle')}
    questionContent={$t('page.admin.identifiers.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => ($confirmDeleteIdentifierOpenOverlayStore = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={$confirmDeleteIdentifierActionStore}
    onClose={() => ($confirmDeleteIdentifierOpenOverlayStore = false)}
  />
  <ConfirmOverlay
    bind:open={$confirmDeletePresetOpenOverlayStore}
    questionHeader={$t('page.admin.linkPresets.deleteTitle')}
    questionContent={$t('page.admin.linkPresets.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => ($confirmDeletePresetOpenOverlayStore = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={$confirmDeletePresetActionStore}
    onClose={() => ($confirmDeletePresetOpenOverlayStore = false)}
  />
  <ConfirmOverlay
    bind:open={$confirmDeleteJokeOpenOverlayStore}
    questionHeader={$t('page.admin.jokes.deleteTitle')}
    questionContent={$t('page.admin.jokes.deleteQuestion')}
    noActionText={$t('page.shared.no')}
    noAction={() => ($confirmDeleteJokeOpenOverlayStore = false)}
    yesActionText={$t('page.shared.yes')}
    yesAction={$confirmDeleteJokeActionStore}
    onClose={() => ($confirmDeleteJokeOpenOverlayStore = false)}
  />
{/if}

<style lang="scss">
  section {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .admin_overview {
    display: grid;
    width: 100%;
    margin-top: 1rem;
    gap: 2rem;
  }

  :global(.admin_sections) {
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    width: 100vw;
  }

  :global(.admin_sections_headline) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 1rem;
  }

  :global(.admin_sections_headline h2 span) {
    font-size: 0.8rem;
  }

  :global(.admin_sections_list) {
    overflow-x: hidden;
    overflow-y: auto;
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

  :global(#update_admin_info_button) {
    position: fixed;
    bottom: var(--default_padding);
    right: var(--default_padding);
    z-index: 100;
  }
</style>

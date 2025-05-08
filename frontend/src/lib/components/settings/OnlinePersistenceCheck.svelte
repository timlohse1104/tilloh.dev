<script lang="ts">
  import { dev } from '$app/environment';
  import { environment } from '$lib/util/environment';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores/store-other';
  import { initialized, t } from '$lib/util/translations';
  import type { Identifier } from '$lib/util/types';
  import { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions } from '@smui/snackbar';
  import {
    Button,
    Modal,
    TextInput,
    Tile,
    Toggle,
  } from 'carbon-components-svelte';
  import { Information, Save } from 'carbon-icons-svelte';
  import { onMount } from 'svelte';
  import IdentifierInformation from './IdentifierInformation.svelte';

  const apiURL = dev
    ? environment.localApiBaseUrl
    : environment.productionApiBaseUrl;
  let shareDataOnline;
  let name = '';
  let openIdentifierInfo = false;
  let snackbar: Snackbar;
  let snackbarMessage = '';

  $: sameName = $sharedIdentifierStore.name === name;
  $: saveSubmittable = name && !sameName;

  onMount(() => {
    if ($sharedIdentifierStore.id && $sharedIdentifierStore.name) {
      name = $sharedIdentifierStore.name || '';
      shareDataOnline = true;
    } else {
      shareDataOnline = false;
    }
  });

  const triggerCloudPersistence = async () => {
    if (shareDataOnline) {
      resetSharedIdentifier();
      name = '';
    } else {
      connectOnlineIdentifier();
    }
  };

  const triggerSnackbar = (message: string) => {
    snackbarMessage = message;
    snackbar.open();
  };

  const saveOnlineIdentifier = async () => {
    if ($sharedIdentifierStore.id) {
      await fetch(`${apiURL}/identifiers/${$sharedIdentifierStore.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then((response) => response.json())
        .then((data) => {
          const identifier: Identifier = {
            id: data._id,
            name: data.name,
          };

          $sharedIdentifierStore = identifier;
          name = data.name;
        });
    } else {
      await fetch(`${apiURL}/identifiers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
        .then((response) => response.json())
        .then((data) => {
          const identifier: Identifier = {
            id: data._id,
            name: data.name,
          };

          $sharedIdentifierStore = identifier;
          name = data.name;
          triggerSnackbar(
            $t('page.settings.onlinePersistence.snackbarIdentifierCreated', {
              identifierName: name,
            }),
          );
        })
        .catch((error) => {
          triggerSnackbar(error);
        });
    }
  };

  const connectOnlineIdentifier = async () => {
    const loginId = $identifierStore;
    if (!loginId) {
      triggerSnackbar($t('page.settings.onlinePersistence.snackbarNoLoginId'));
      return;
    }

    await fetch(`${apiURL}/identifiers/${loginId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 404) {
          triggerSnackbar(
            $t('page.settings.onlinePersistence.snackbarNoIdentifierFound', {
              identifier: loginId,
            }),
          );
          return;
        }

        const identifier: Identifier = {
          id: data._id,
          name: data.name,
        };

        $sharedIdentifierStore = identifier;
        name = data.name;
        triggerSnackbar(
          $t('page.settings.onlinePersistence.snackbarLoadedIdentifier', {
            identifier: $sharedIdentifierStore.id,
          }),
        );
      })
      .catch((error) => {
        triggerSnackbar(error);
      });
  };
</script>

{#if $initialized}
  <section>
    <h2>
      {$t('page.settings.onlinePersistence.title')}
    </h2>
    <p class="online_persistence_info_text">
      {@html $t('page.settings.onlinePersistence.description1')}
    </p>

    <Toggle
      bind:toggled={shareDataOnline}
      on:click={triggerCloudPersistence}
      labelA={$t('page.shared.no')}
      labelB={$t('page.shared.yes')}
      labelText={$t(
        'page.settings.onlinePersistence.activateOnlinePersistenceQuestion',
      )}
      class="mt2"
    />

    {#if $sharedIdentifierStore.id}
      <Button
        kind="ghost"
        icon={Information}
        class="save-button mt2"
        on:click={() => (openIdentifierInfo = true)}
      >
        {$t('page.settings.onlinePersistence.connectionData')}
      </Button>

      <Modal
        passiveModal
        bind:open={openIdentifierInfo}
        modalHeading={$t('page.settings.identifiers.title')}
      >
        <IdentifierInformation />
      </Modal>
    {/if}

    {#if shareDataOnline && $sharedIdentifierStore.id}
      <div class="input_area">
        <Tile class="connection_card">
          <h3>{$t('page.settings.onlinePersistence.editConnection')}</h3>

          <p>
            {$t('page.settings.onlinePersistence.editConnectionDescription')}
          </p>

          <div class="button_group">
            <TextInput
              labelText={!$sharedIdentifierStore.id
                ? $t('page.settings.onlinePersistence.yourName')
                : $t('page.settings.onlinePersistence.yourCurrentName')}
              helperText={$t(
                'page.settings.onlinePersistence.yourNameQuestion',
              )}
              bind:value={name}
            />

            <Button
              kind="ghost"
              icon={Save}
              class="save-button"
              disabled={!saveSubmittable}
              on:click={saveOnlineIdentifier}
            >
              {#if !$sharedIdentifierStore.id}
                <Label>{$t('page.shared.establish')}</Label>
              {:else}
                <Label>{$t('page.shared.save')}</Label>
              {/if}
            </Button>
          </div>
        </Tile>
      </div>
    {/if}

    <Snackbar bind:this={snackbar}>
      <Label>{snackbarMessage}</Label>
      <Actions>
        <IconButton class="material-icons" title="Dismiss">close</IconButton>
      </Actions>
    </Snackbar>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }

  .input_area {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    width: 85vw;
    margin-top: 1rem;
  }

  :global(.connection_card) {
    width: 500px;
  }

  .online_persistence_info_text {
    width: 90%;
    text-align: center;
  }

  .button_group {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }
</style>

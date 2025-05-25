<script lang="ts">
  import { environment } from '$lib/util/environment';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores/store-other';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import type { Identifier } from '$lib/util/types';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import Information from 'carbon-icons-svelte/lib/Information.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import IdentifierInformation from './IdentifierInformation.svelte';

  const apiURL = environment.apiBaseUrl;
  let shareDataOnline;
  let name = '';
  let openIdentifierInfo = false;
  let snackbarMessage = '';
  let timeout = undefined;

  $: showNotification = timeout !== undefined;
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
  const triggerNotification = (message: string) => {
    snackbarMessage = message;
    timeout = 3_000;
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
          triggerNotification(
            $t('page.settings.onlinePersistence.snackbarIdentifierCreated', {
              identifierName: name,
            }),
          );
        })
        .catch((error) => {
          triggerNotification(error);
        });
    }
  };
  const connectOnlineIdentifier = async () => {
    const loginId = $identifierStore;
    if (!loginId) {
      triggerNotification(
        $t('page.settings.onlinePersistence.snackbarNoLoginId'),
      );
      return;
    }

    await fetch(`${apiURL}/identifiers/${loginId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 404) {
          triggerNotification(
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
        triggerNotification(
          $t('page.settings.onlinePersistence.snackbarLoadedIdentifier', {
            identifier: $sharedIdentifierStore.id,
          }),
        );
        celebrate();
      })
      .catch((error) => {
        triggerNotification(error);
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
        iconDescription={$t(
          'page.settings.onlinePersistence.showConnectionData',
        )}
        icon={Information}
        class="save_button mt2"
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
              iconDescription={$t(
                'page.settings.onlinePersistence.editConnectionData',
              )}
              icon={Save}
              class="save_button"
              disabled={!saveSubmittable}
              on:click={saveOnlineIdentifier}
            >
              {#if !$sharedIdentifierStore.id}
                {$t('page.shared.establish')}
              {:else}
                {$t('page.shared.save')}
              {/if}
            </Button>
          </div>
        </Tile>
      </div>
    {/if}

    {#if showNotification}
      <div transition:fade>
        <InlineNotification
          {timeout}
          kind="info-square"
          lowContrast
          subtitle={snackbarMessage}
          class="inline_notification"
          on:close={(e) => {
            timeout = undefined;
          }}
        />
      </div>
    {/if}
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

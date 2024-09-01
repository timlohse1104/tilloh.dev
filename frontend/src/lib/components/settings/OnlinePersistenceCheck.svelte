<script lang="ts">
  import { dev } from '$app/environment';
  import { environment } from '$lib/util/environment';
  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores';
  import { initialized, t } from '$lib/util/translations';
  import type { Identifier } from '$lib/util/types';
  import Button, { Label } from '@smui/button';
  import Card from '@smui/card';
  import Dialog, { Content } from '@smui/dialog';
  import FormField from '@smui/form-field';
  import IconButton from '@smui/icon-button';
  import Snackbar, { Actions } from '@smui/snackbar';
  import Switch from '@smui/switch';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import IdentifierInformation from './IdentifierInformation.svelte';

  const apiURL = dev
    ? environment.localApiBaseUrl
    : environment.productionApiBaseUrl;
  let shareDataOnline;
  let name = '';
  let saveButton;
  let connectButton;
  let openIdentifierInfo = false;
  let idInput = '';
  let snackbar: Snackbar;
  let snackbarMessage = '';

  $: sameName = $sharedIdentifierStore.name === name;
  $: saveSubmittable = name && !sameName;
  $: connectSubmittable = !!idInput;
  $: if (saveButton) {
    saveButton.$$set({
      disabled: !saveSubmittable,
    });
  }
  $: if (connectButton) {
    connectButton.$$set({
      disabled: !connectSubmittable,
    });
  }

  onMount(() => {
    if ($sharedIdentifierStore.id && $sharedIdentifierStore.name) {
      name = $sharedIdentifierStore.name || '';
      shareDataOnline = true;
    } else {
      shareDataOnline = false;
    }
  });

  const checkIdentifierReset = async () => {
    if (shareDataOnline) {
      resetSharedIdentifier();
      name = '';
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
    await fetch(`${apiURL}/identifiers/${idInput}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 404) {
          triggerSnackbar(
            $t('page.settings.onlinePersistence.snackbarNoIdentifierFound', {
              identifier: idInput,
            }),
          );
          idInput = '';
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
        idInput = '';
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
    <p class="onlinePersistenceInfoText">
      {$t('page.settings.onlinePersistence.description1')}
    </p>
    <p class="onlinePersistenceInfoText">
      {$t('page.settings.onlinePersistence.description2')}
      <b>
        {$t('page.settings.onlinePersistence.connectionData')}
      </b>

      {$t('page.settings.onlinePersistence.description3')}
      <b>
        {$t('page.settings.onlinePersistence.loadConnection')}
      </b>
      {$t('page.settings.onlinePersistence.description4')}
    </p>

    <FormField>
      <Switch
        bind:checked={shareDataOnline}
        on:click={checkIdentifierReset}
        icons={false}
        color="secondary"
      />
      <span slot="label"
        >{$t(
          'page.settings.onlinePersistence.activateOnlinePersistenceQuestion',
        )}</span
      >
    </FormField>

    {#if $sharedIdentifierStore.id}
      <Button
        on:click={() => (openIdentifierInfo = true)}
        style="margin-top: 2rem;color: var(--color-theme-1);"
      >
        <Icon class="material-icons">info</Icon>
        <Label>{$t('page.settings.onlinePersistence.connectionData')}</Label>
      </Button>

      <Dialog
        bind:open={openIdentifierInfo}
        sheet
        aria-describedby="sheet-content"
      >
        <Content id="sheet-content">
          <IconButton action="close" class="material-icons">close</IconButton>
          <IdentifierInformation />
        </Content>
      </Dialog>
    {/if}

    {#if shareDataOnline}
      <div class="inputArea">
        <Card padded class="connection-card">
          {#if !$sharedIdentifierStore.id}
            <h3>
              {$t('page.settings.onlinePersistence.establishNewConection')}
            </h3>
          {:else}
            <h3>{$t('page.settings.onlinePersistence.editConnection')}</h3>
          {/if}

          <p>
            {$t('page.settings.onlinePersistence.editConnectionDescription')}
          </p>

          <div class="buttonGroup">
            <div>
              <Textfield
                bind:value={name}
                label={!$sharedIdentifierStore.id
                  ? $t('page.settings.onlinePersistence.yourName')
                  : $t('page.settings.onlinePersistence.yourCurrentName')}
              >
                <Icon class="material-icons" slot="leadingIcon">badge</Icon>
                <HelperText slot="helper"
                  >{!$sharedIdentifierStore.id
                    ? $t('page.settings.onlinePersistence.yourNameQuestion')
                    : $t(
                        'page.settings.onlinePersistence.yourNewNameQuestion',
                      )}</HelperText
                >
              </Textfield>
            </div>

            <Button
              on:click={saveOnlineIdentifier}
              style={saveSubmittable ? 'color:var(--green);' : ''}
              bind:this={saveButton}
              color="secondary"
            >
              <Icon class="material-icons">save</Icon>
              {#if !$sharedIdentifierStore.id}
                <Label>{$t('page.shared.establish')}</Label>
              {:else}
                <Label>{$t('page.shared.save')}</Label>
              {/if}
            </Button>
          </div>
        </Card>

        <Card padded class="connection-card">
          <h3>{$t('page.settings.onlinePersistence.loadConnection')}</h3>
          <p>
            {$t('page.settings.onlinePersistence.loadConnectionDescription')}
          </p>

          <div class="buttonGroup">
            <div>
              <Textfield
                bind:value={idInput}
                label={$t('page.settings.onlinePersistence.yourId')}
              >
                <Icon class="material-icons" slot="leadingIcon">badge</Icon>
                <HelperText slot="helper"
                  >{$t(
                    'page.settings.onlinePersistence.personalIdQuestion',
                  )}</HelperText
                >
              </Textfield>
            </div>

            <Button
              on:click={connectOnlineIdentifier}
              bind:this={connectButton}
            >
              <Icon class="material-icons">cloud_download</Icon>
              <Label>{$t('page.shared.connect')}</Label>
            </Button>
          </div>
        </Card>
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
    color: var(--color-text);

    span {
      color: var(--color-text);
    }
  }

  .inputArea {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
    width: 85vw;
    margin-top: 1rem;
  }

  :global(.connection-card) {
    width: 500px;
  }

  .onlinePersistenceInfoText {
    width: 90%;
    text-align: center;
  }

  .buttonGroup {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    gap: 1rem;
  }
</style>

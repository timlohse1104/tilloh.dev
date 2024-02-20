<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { dev } from '$app/environment';
  import { environment } from '$lib/util/environment';
  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores';
  import type { Identifier } from '$lib/util/types';
  import Button, { Label } from '@smui/button';
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
  let openIdentifierInfo = false;
  let idInput = '';

  let snackbar: Snackbar;
  let snackbarMessage = '';

  $: sameName = $sharedIdentifierStore.name === name;

  async function checkIdentifierReset() {
    if (
      shareDataOnline &&
      $sharedIdentifierStore.id &&
      $sharedIdentifierStore.name
    ) {
      await fetch(`${apiURL}/identifiers/${$sharedIdentifierStore.id}`, {
        method: 'DELETE',
      });
      resetSharedIdentifier();
      name = '';
    }
  }

  function triggerSnackbar(message: string) {
    snackbarMessage = message;
    snackbar.open();
  }

  async function saveOnlineIdentifier() {
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
          triggerSnackbar(`Neue Verbindung für den Namen '${name}' erzeugt.`);
        })
        .catch((error) => {
          triggerSnackbar(error);
        });
    }
  }

  async function connectOnlineIdentifier() {
    await fetch(`${apiURL}/identifiers/${idInput}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 404) {
          triggerSnackbar(`Keine Verbindung mit der ID '${idInput}' gefunden.`);
          return;
        }

        const identifier: Identifier = {
          id: data._id,
          name: data.name,
        };

        $sharedIdentifierStore = identifier;
        name = data.name;
        triggerSnackbar(
          `Verbindung mit der ID: <b>${sharedIdentifierStore.id}</b> geladen.`,
        );
        idInput = '';
      })
      .catch((error) => {
        triggerSnackbar(error);
      });
  }

  onMount(() => {
    console.log($sharedIdentifierStore);
    if ($sharedIdentifierStore.id && $sharedIdentifierStore.name) {
      name = $sharedIdentifierStore.name || '';
      shareDataOnline = true;
    } else {
      shareDataOnline = false;
    }
  });
</script>

<section>
  <h2>Offline / Online Sicherung</h2>
  <p class="onlinePersistenceInfoText">
    Diese Website enthält einige Seiten, die es dir erlauben, Zwischenstände zu
    speichern. Im Memorandum gibt es deine benutzerdefinierten Ordner und Links
    und in Catch-Em-All gibt es deinen Highscore. Sollen diese Informationen
    online gespeichert werden, sodass du von jedem anderen Gerät darauf
    zugreifen kannst?
  </p>

  <FormField>
    <Switch
      bind:checked={shareDataOnline}
      on:click={checkIdentifierReset}
      icons={false}
      color="secondary"
    />
    <span slot="label">Daten zwischen Geräten teilen?</span>
  </FormField>

  {#if $sharedIdentifierStore.id}
    <Button
      on:click={() => (openIdentifierInfo = true)}
      style="margin-top: 2rem;color: var(--color-theme-1);"
    >
      <Icon class="material-icons">info</Icon>
      <Label>Deine Verbindungsdaten</Label>
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
    <hr />
    {#if !$sharedIdentifierStore.id}
      <h3>Neue Verbindung einrichten</h3>
    {:else}
      <h3>Verbindung bearbeiten</h3>
    {/if}
    <Textfield
      bind:value={name}
      label={!$sharedIdentifierStore.id ? 'Dein Name' : 'Dein aktueller Name'}
    >
      <Icon class="material-icons" slot="leadingIcon">badge</Icon>
      <HelperText slot="helper"
        >{!$sharedIdentifierStore.id
          ? 'Wie lautet dein Name?'
          : 'Wie lautet dein neuer Name?'}</HelperText
      >
    </Textfield>

    <Button
      on:click={saveOnlineIdentifier}
      style={'margin-top: 3rem;' +
        (name && !sameName ? 'color:var(--green);' : '')}
      bind:this={saveButton}
      disabled={!name || sameName}
      color="secondary"
    >
      <Icon class="material-icons">save</Icon>
      {#if !$sharedIdentifierStore.id}
        <Label>Einrichten</Label>
      {:else}
        <Label>Aktualisieren</Label>
      {/if}
    </Button>

    <hr />
    <h3>Schnelle Einrichtung mit ID</h3>

    <Textfield bind:value={idInput} label="Deine ID">
      <Icon class="material-icons" slot="leadingIcon">badge</Icon>
      <HelperText slot="helper">Wie lautet deine persönliche ID?</HelperText>
    </Textfield>

    <Button
      on:click={connectOnlineIdentifier}
      style="margin-top: 3rem;"
      bind:this={saveButton}
      disabled={!idInput}
    >
      <Icon class="material-icons">cloud_download</Icon>
      <Label>Verbinden</Label>
    </Button>
  {/if}

  <Snackbar bind:this={snackbar}>
    <Label>{snackbarMessage}</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</section>

<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3rem;
    color: var(--color-text);

    span {
      color: var(--color-text);
    }
  }

  .onlinePersistenceInfoText {
    width: 50%;
    text-align: center;
  }

  hr {
    width: 75%;
    margin: 4rem 0;
  }
</style>

<script lang="ts">
  import { dev } from '$app/environment';
  import { environment } from '$lib/util/environment';
  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores';
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
  $: saveSubmittable = !name || sameName;
  $: connectSubmittable = !idInput;
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
          `Verbindung mit der ID: <b>${$sharedIdentifierStore.id}</b> geladen.`,
        );
        idInput = '';
      })
      .catch((error) => {
        triggerSnackbar(error);
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
</script>

<section>
  <h2>Offline / Online Sicherung</h2>
  <p class="onlinePersistenceInfoText">
    Diese Website enthält einige Funktionen, die es dir erlauben, Zwischenstände
    zu speichern. Im Memorandum kannst du deine angelegten Ordner und Links und
    in Catch-Em-All deinen Highscore sichern. Aktivierst du die
    Online-Speicherung, kannst du von jedem anderen Gerät darauf zugreifen.
  </p>
  <p class="onlinePersistenceInfoText">
    Kopiere hierzu einfach deine persönliche ID aus dem Bereich <b
      >Deine Verbindungsdaten</b
    >
    und füge sie im Bereich <b>Schnelle Einrichtung mit ID</b> auf einem anderen
    Gerät ein. Deine Daten werden dann synchronisiert.
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
    <div class="inputArea">
      <Card padded>
        {#if !$sharedIdentifierStore.id}
          <h3>Neue Verbindung einrichten</h3>
        {:else}
          <h3>Verbindung bearbeiten</h3>
        {/if}

        <p>
          Hier kannst du deinen Namen für die Online-Speicherung festlegen oder
          ändern.
        </p>

        <div class="buttonGroup">
          <div>
            <Textfield
              bind:value={name}
              label={!$sharedIdentifierStore.id
                ? 'Dein Name'
                : 'Dein aktueller Name'}
            >
              <Icon class="material-icons" slot="leadingIcon">badge</Icon>
              <HelperText slot="helper"
                >{!$sharedIdentifierStore.id
                  ? 'Wie lautet dein Name?'
                  : 'Wie lautet dein neuer Name?'}</HelperText
              >
            </Textfield>
          </div>

          <Button
            on:click={saveOnlineIdentifier}
            style={name && !sameName ? 'color:var(--green);' : ''}
            bind:this={saveButton}
            color="secondary"
          >
            <Icon class="material-icons">save</Icon>
            {#if !$sharedIdentifierStore.id}
              <Label>Einrichten</Label>
            {:else}
              <Label>Aktualisieren</Label>
            {/if}
          </Button>
        </div>
      </Card>

      <Card padded>
        <h3>Schnelle Einrichtung mit ID</h3>
        <p>
          Kopiere deine ID und füge sie auf einem anderen Gerät ein, um deine
          Daten zu synchronisieren.
        </p>

        <div class="buttonGroup">
          <div>
            <Textfield bind:value={idInput} label="Deine ID">
              <Icon class="material-icons" slot="leadingIcon">badge</Icon>
              <HelperText slot="helper"
                >Wie lautet deine persönliche ID?</HelperText
              >
            </Textfield>
          </div>

          <Button on:click={connectOnlineIdentifier} bind:this={connectButton}>
            <Icon class="material-icons">cloud_download</Icon>
            <Label>Verbinden</Label>
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
    justify-content: space-between;
    gap: 1rem;
    width: 80vw;
    margin-top: 1rem;
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

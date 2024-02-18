<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import {
    resetSharedIdentifier,
    sharedIdentifierStore,
  } from '$lib/util/stores';
  import type { Identifier } from '$lib/util/types';
  import Button, { Label } from '@smui/button';
  import Dialog, { Content } from '@smui/dialog';
  import FormField from '@smui/form-field';
  import IconButton from '@smui/icon-button';
  import Switch from '@smui/switch';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import IdentifierInformation from './IdentifierInformation.svelte';

  let editOnlinePersistence;
  let name = '';
  let saveButton;
  let openIdentifierInfo = false;

  async function checkIdentifierReset() {
    console.log('change detected!');

    console.log('editOnlinePersistence', editOnlinePersistence);
    console.log('sharedIdentifierStore', $sharedIdentifierStore);
    console.log(
      'check',
      !editOnlinePersistence &&
        $sharedIdentifierStore.id &&
        $sharedIdentifierStore.name,
    );
    if (
      editOnlinePersistence &&
      $sharedIdentifierStore.id &&
      $sharedIdentifierStore.name
    ) {
      await fetch(
        `http://localhost:61154/v1/identifiers/${$sharedIdentifierStore.id}`,
        {
          method: 'DELETE',
        },
      );
      resetSharedIdentifier();
    }
  }

  async function saveOnlineIdentifier() {
    if ($sharedIdentifierStore.id) {
      await fetch(
        `http://localhost:61154/v1/identifiers/${$sharedIdentifierStore.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        },
      )
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
      await fetch('http://localhost:61154/v1/identifiers', {
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
        });
    }
  }

  onMount(() => {
    if ($sharedIdentifierStore.id && $sharedIdentifierStore.name) {
      name = $sharedIdentifierStore.name || '';
      editOnlinePersistence = true;
    } else {
      editOnlinePersistence = false;
    }
  });

  // TODO: Einen Weg finden wie Nutzer die ID eingeben und damit ihre Daten auf einem anderen Gerät wiederherstellen können
</script>

<section>
  <h2>Offline / Online Speicherung</h2>
  <p>
    Diese Website enthält einige Seiten, die es dir erlauben, Zwischenstände zu
    speichern. Im Memorandum gibt es deine benutzerdefinierten Ordner und Links
    und in Catch-Em-All gibt es deinen Highscore. Sollen diese Informationen
    online gespeichert werden, sodass du von jedem anderen Gerät darauf
    zugreifen kannst?
  </p>

  <FormField>
    <Switch
      bind:checked={editOnlinePersistence}
      on:click={checkIdentifierReset}
      icons={false}
    />
    <span slot="label">Daten zwischen Geräten teilen?</span>
  </FormField>

  {#if editOnlinePersistence}
    <Textfield bind:value={name} label="Wie lautet dein Name?">
      <Icon class="material-icons" slot="leadingIcon">badge</Icon>
    </Textfield>

    <Button
      on:click={saveOnlineIdentifier}
      style="margin-top: 3rem;"
      bind:this={saveButton}
      disabled={!name}
    >
      <Icon class="material-icons">save</Icon>
      <Label>Speichern</Label>
    </Button>
    {#if $sharedIdentifierStore.id}
      <Button
        on:click={() => (openIdentifierInfo = true)}
        style="margin-top: 2rem;"
      >
        <Icon class="material-icons">info</Icon>
        <Label>Deine Informationen</Label>
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
  {/if}
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
</style>

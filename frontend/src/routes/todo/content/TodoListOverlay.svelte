<script lang="ts">
  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import { onMount } from 'svelte';
  import type { TodoList } from '../types/list.ts';
  import { isEmoji } from '../util/helpers.ts';
  import { listOverlayOptionsStore, todoStore } from '../util/stores.ts';

  let newListName = '';
  let newListEmojiInput: Textfield;
  let newListEmoji = '';
  let saveButton: Button;

  $: if (saveButton) {
    saveButton.$$set({
      disabled: !newListName && !(isEmoji(newListEmoji) || newListEmoji === ''),
    });
  }
  $: if (newListEmojiInput) {
    if (!isEmoji(newListEmojiInput)) {
      newListEmojiInput.$$set({ invalid: true });
    } else {
      newListEmojiInput.$$set({ invalid: false });
    }
  }

  onMount(() => {
    console.log('todoStore', $todoStore);
    console.log('listOverlayOptionsStore', $listOverlayOptionsStore);

    newListName = $todoStore[$listOverlayOptionsStore.currentListIndex]?.name;
    newListEmoji = $todoStore[$listOverlayOptionsStore.currentListIndex]?.emoji;
  });

  function updateList() {
    const list: TodoList = {
      name: newListName,
      emoji: newListEmoji || '📝',
      history: [],
      todos: [],
    };
    todoStore.update((n) => {
      return [...n, list];
    });

    closeOverlay();
  }

  function deleteList() {
    todoStore.update((n) => {
      n.splice($listOverlayOptionsStore.currentListIndex, 1);
      return n;
    });
    closeOverlay();
  }

  function updateOnEnter(event) {
    if (event['code'] === 'Enter') {
      if (newListName && (isEmoji(newListEmoji) || newListEmoji === '')) {
        updateList();
      }
    }
  }

  function closeOverlay() {
    $listOverlayOptionsStore.showOverlay = false;
    $listOverlayOptionsStore.currentListIndex = undefined;
    $listOverlayOptionsStore.type = undefined;
    newListName = '';
    newListEmoji = '';
  }
</script>

<Dialog
  bind:open={$listOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if $listOverlayOptionsStore.type === 'new'}
    <Title id="simple-title">
      Erstelle eine Liste
      <p class="subtitle">Lege hier eine neue Aufgabenliste an.</p>
    </Title>
  {:else}
    <Title id="simple-title">
      Bearbeite die Liste: {newListName}
      <p class="subtitle">
        Bearbeite hier die Liste <b>{newListName}</b>.
      </p>
    </Title>
  {/if}
  <Content id="simple-content">
    <div class="createListSection">
      <Textfield
        variant="outlined"
        bind:value={newListName}
        label="Name der Liste"
        required
        style="width: 25vw;"
        on:keyup={(event) => updateOnEnter(event)}
      />
      <div>
        <Textfield
          variant="outlined"
          bind:this={newListEmojiInput}
          bind:value={newListEmoji}
          label="Emoji der Liste"
          style="width: 25vw;"
          on:keyup={(event) => updateOnEnter(event)}
          ><HelperText persistent slot="helper"
            >Vergibst du kein Emoji erhältst du 📝</HelperText
          ></Textfield
        >
      </div>
    </div>
  </Content>

  <Actions>
    <Button on:click={deleteList}>
      <Icon class="material-icons">delete</Icon>
      <Label>Löschen</Label>
    </Button>
    <Button on:click={closeOverlay}>
      <Icon class="material-icons">playlist_remove</Icon>
      <Label>Abbruch</Label>
    </Button>
    <Button on:click={updateList} bind:this={saveButton}>
      <Icon class="material-icons"
        >{$listOverlayOptionsStore.type === 'new'
          ? 'playlist_add'
          : 'save'}</Icon
      >
      <Label
        >{$listOverlayOptionsStore.type === 'new'
          ? 'Hinzufügen'
          : 'Speichern'}</Label
      >
    </Button>
  </Actions>
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .subtitle {
    font-size: 1rem;
  }
  .createListSection {
    display: flex;
    flex-direction: row;
    gap: var(--default-padding);
    margin-top: var(--default-padding);
  }
</style>

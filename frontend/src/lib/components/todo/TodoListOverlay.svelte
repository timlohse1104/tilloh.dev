<script lang="ts">
  import type { TodoList } from '$lib/types/todo.ts';
  import { isEmoji, isEnter } from '$lib/util/helper.ts';
  import { listOverlayOptionsStore, todoStore } from '$lib/util/stores.ts';
  import Button, { Label } from '@smui/button';
  import Dialog, { Actions, Content, Title } from '@smui/dialog';
  import IconButton from '@smui/icon-button';
  import Textfield from '@smui/textfield';
  import HelperText from '@smui/textfield/helper-text';
  import Icon from '@smui/textfield/icon';
  import Tooltip, { Wrapper } from '@smui/tooltip';

  export let listIndex: number;
  export let newListName = '';
  export let newListEmoji = '';

  let newListEmojiInput: Textfield;
  let saveButton: Button;

  $: if (saveButton) {
    saveButton.$$set({
      disabled: !newListName || (!isEmoji(newListEmoji) && newListEmoji !== ''),
    });
  }
  $: if (newListEmojiInput) {
    if (!isEmoji(newListEmojiInput)) {
      newListEmojiInput.$$set({ invalid: true });
    } else {
      newListEmojiInput.$$set({ invalid: false });
    }
  }

  const createList = () => {
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
  };

  const updateList = () => {
    todoStore.update((n) => {
      console.log(listIndex);
      console.log(n);
      n[listIndex].name = newListName;
      n[listIndex].emoji = newListEmoji || '📝';
      return n;
    });

    closeOverlay();
  };

  const deleteList = () => {
    todoStore.update((n) => {
      n.splice(listIndex, 1);
      return n;
    });
    closeOverlay();
  };

  const proceedOnEnter = (event) => {
    if (isEnter(event)) {
      if (newListName && (isEmoji(newListEmoji) || newListEmoji === '')) {
        $listOverlayOptionsStore.type === 'new' ? createList() : updateList();
      }
    }
  };

  const closeOverlay = () => {
    $listOverlayOptionsStore.showOverlay = false;
    $listOverlayOptionsStore.type = undefined;
    listIndex = undefined;
    newListName = '';
    newListEmoji = '';
  };
</script>

<Dialog
  bind:open={$listOverlayOptionsStore.showOverlay}
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  {#if $listOverlayOptionsStore.type === 'new'}
    <Title id="simple-title">
      Liste erstellen
      <p class="subtitle">Lege hier eine neue Aufgabenliste an.</p>
    </Title>
  {:else}
    <Title id="simple-title">
      Liste bearbeiten
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
        on:keyup={(event) => proceedOnEnter(event)}
      />
      <div>
        <Textfield
          variant="outlined"
          bind:this={newListEmojiInput}
          bind:value={newListEmoji}
          label="Emoji der Liste"
          on:keyup={(event) => proceedOnEnter(event)}
        >
          <HelperText persistent slot="helper"
            >Vergibst du kein Emoji erhältst du 📝</HelperText
          >
          <Wrapper>
            <IconButton
              style="position:absolute;color: white;right:0;top:0"
              size="mini"
            >
              <Icon class="material-icons">info</Icon>
            </IconButton>
            <Tooltip xPos="center" yPos="above"
              >Emojis kann man z.B. hier https://emojipedia.org/ und hier
              https://emojifinder.com/ finden.</Tooltip
            >
          </Wrapper>
        </Textfield>
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
    <Button
      on:click={$listOverlayOptionsStore.type === 'new'
        ? createList
        : updateList}
      bind:this={saveButton}
    >
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

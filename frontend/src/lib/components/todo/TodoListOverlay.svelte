<script lang="ts">
  import type { TodoList } from '$lib/types/todo.ts';
  import { isEmoji, isEnter } from '$lib/util/helper.ts';
  import { listOverlayOptionsStore, todoStore } from '$lib/util/stores.ts';
  import { initialized, t } from '$lib/util/translations';
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
  {#if $initialized}
    {#if $listOverlayOptionsStore.type === 'new'}
      <Title id="simple-title">
        {$t('page.todos.overlay.createTitle')}
        <p class="subtitle">
          {$t('page.todos.overlay.createSubtitle')}
        </p>
      </Title>
    {:else}
      <Title id="simple-title">
        {$t('page.todos.overlay.editTitle')}
        <p class="subtitle">
          <b
            >{$t('page.todos.overlay.createSubtitle', {
              listName: newListName,
            })}</b
          >.
        </p>
      </Title>
    {/if}
    <Content id="simple-content">
      <div class="create_list_section">
        <Textfield
          variant="outlined"
          bind:value={newListName}
          label={$t('page.todos.overlay.listName')}
          required
          on:keyup={(event) => proceedOnEnter(event)}
        />
        <div>
          <Textfield
            variant="outlined"
            bind:this={newListEmojiInput}
            bind:value={newListEmoji}
            label={$t('page.todos.overlay.listEmoji')}
            on:keyup={(event) => proceedOnEnter(event)}
          >
            <HelperText persistent slot="helper"
              >{$t('page.todos.overlay.listEmojiDescription')}</HelperText
            >
            <Wrapper>
              <IconButton
                style="position:absolute;color: white;right:0;top:0"
                size="mini"
              >
                <Icon class="material-icons">info</Icon>
              </IconButton>
              <Tooltip xPos="center" yPos="above"
                >{$t('page.todos.overlay.emojiTooltip')}</Tooltip
              >
            </Wrapper>
          </Textfield>
        </div>
      </div>
    </Content>

    <Actions>
      <Button on:click={deleteList} color="secondary">
        <Icon class="material-icons">delete</Icon>
        <Label>{$t('page.shared.delete')}</Label>
      </Button>
      <Button on:click={closeOverlay} color="secondary">
        <Icon class="material-icons">playlist_remove</Icon>
        <Label>{$t('page.shared.abort')}</Label>
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
            ? $t('page.shared.append')
            : $t('page.shared.save')}</Label
        >
      </Button>
    </Actions>
  {:else}
    <Title id="simple-title">Locale initializing...</Title>
  {/if}
</Dialog>

<svelte:window
  on:keyup={(event) => (event.code === 'Escape' ? closeOverlay() : 'foo')}
/>

<style lang="scss">
  .subtitle {
    font-size: 1rem;
  }
  .create_list_section {
    display: flex;
    flex-direction: row;
    gap: var(--default-padding);
    margin-top: var(--default-padding);
  }
</style>

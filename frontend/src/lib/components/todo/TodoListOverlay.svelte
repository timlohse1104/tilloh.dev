<script lang="ts">
  // 1. IMPORTS
  import type { TodoList } from '$lib/types/todo.ts';
  import { isEmoji, isEnter } from '$lib/util/helper.ts';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Tooltip from 'carbon-components-svelte/src/Tooltip/Tooltip.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';

  // 2. PROPS
  let { listId, listName = '', listEmoji = '' } = $props();

  // 4. STATE
  let listIndex = $state<number>(-1);
  let modalStates = $state<string>('');

  // 8. EFFECTS
  $effect(() => {
    listIndex = $todoStore.findIndex((list) => list.id === listId);
  });

  $effect(() => {
    let classes = '';

    if (!listName || (!isEmoji(listEmoji) && listEmoji !== ''))
      classes += 'modal_unsavable';
    if ($listOverlayOptionsStore.type === 'new')
      classes += ' modal_undeletable';

    modalStates = classes;
  });

  // 5. FUNCTIONS
  // 5. FUNCTIONS
  const createList = () => {
    const list: TodoList = {
      id: listId || crypto.randomUUID(),
      name: listName,
      emoji: listEmoji || '📝',
      history: [],
      todos: [],
    };
    todoStore.update((n) => {
      return [...n, list];
    });

    closeOverlay();
    celebrate();
  };
  const updateList = () => {
    todoStore.update((n) => {
      console.log(listIndex);
      console.log(n);
      n[listIndex].name = listName;
      n[listIndex].emoji = listEmoji || '📝';
      return n;
    });

    closeOverlay();
  };
  const deleteList = (listId) => {
    const deletionTodoListIndex = $todoStore.findIndex(
      (todoList) => todoList.id === listId,
    );
    todoStore.update((n) => {
      n.splice(deletionTodoListIndex, 1);
      return n;
    });
    closeOverlay();
  };
  const proceedOnEnter = (event) => {
    if (isEnter(event)) {
      if (listName && (isEmoji(listEmoji) || listEmoji === '')) {
        $listOverlayOptionsStore.type === 'new' ? createList() : updateList();
      }
    }
  };
  const closeOverlay = () => {
    $listOverlayOptionsStore.showOverlay = false;
    $listOverlayOptionsStore.type = undefined;
    listId = undefined;
    listIndex = undefined;
    listName = '';
    listEmoji = '';
  };
</script>

<Modal
  bind:open={$listOverlayOptionsStore.showOverlay}
  modalHeading={$listOverlayOptionsStore.type === 'new'
    ? $t('page.todos.overlay.createTitle')
    : $t('page.todos.overlay.editTitle')}
  primaryButtonText={$listOverlayOptionsStore.type === 'new'
    ? $t('page.shared.append')
    : $t('page.shared.save')}
  primaryButtonIcon={Save}
  secondaryButtons={[
    { text: $t('page.shared.abort') },
    { text: $t('page.shared.delete') },
  ]}
  on:click:button--primary={$listOverlayOptionsStore.type === 'new'
    ? createList
    : updateList}
  on:click:button--secondary={({ detail }) => {
    if (detail.text === $t('page.shared.abort')) closeOverlay();
    if (detail.text === $t('page.shared.delete')) deleteList(listIndex);
  }}
  class={modalStates()}
>
  {#if $initialized}
    {#if $listOverlayOptionsStore.type === 'new'}
      <p class="subtitle">
        {$t('page.todos.overlay.createSubtitle')}
      </p>
    {:else}
      <p class="subtitle">
        <b
          >{$t('page.todos.overlay.createSubtitle', {
            listName: listName,
          })}</b
        >.
      </p>
    {/if}

    <div class="create_list_section">
      <TextInput
        bind:value={listName}
        labelText={$t('page.todos.overlay.listName')}
        placeholder={$t('page.todos.overlay.listName')}
        autofocus
        class="mb1"
        on:keyup={(event) => proceedOnEnter(event)}
      />
      <div>
        <TextInput
          bind:value={listEmoji}
          placeholder={$t('page.todos.overlay.listEmoji')}
          labelText={$t('page.todos.overlay.listEmojiDescription')}
          class="mb1"
          on:keyup={(event) => proceedOnEnter(event)}
        />

        <Tooltip triggerText="Emoji Info" direction="top">
          <p>{@html $t('page.todos.overlay.emojiTooltip')}</p>
        </Tooltip>
      </div>
    </div>
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

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
    gap: var(--default_padding);
    margin-top: var(--default_padding);
  }

  :global(
    .modal_unsavable
      > .bx--modal-container
      > .bx--modal-footer
      > .bx--btn--primary
  ) {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }

  :global(
    .modal_undeletable
      > .bx--modal-container
      > .bx--modal-footer
      > .bx--btn--secondary:nth-child(2)
  ) {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

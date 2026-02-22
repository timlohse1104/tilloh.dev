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
  let {
    listId,
    listName = '',
    listEmoji = '',
  }: {
    listId: string;
    listName?: string;
    listEmoji?: string;
  } = $props();

  // 4. STATE
  let localListName = $state<string>('');
  let localListEmoji = $state<string>('');

  // 5. DERIVED
  let listIndex = $derived($todoStore.findIndex((list) => list.id === listId));
  let modalStates = $derived.by(() => {
    let classes = '';
    if (!localListName || (!isEmoji(localListEmoji) && localListEmoji !== ''))
      classes += 'modal_unsavable';
    if ($listOverlayOptionsStore.type === 'new')
      classes += ' modal_undeletable';
    return classes;
  });

  // 6. EFFECTS
  $effect(() => {
    localListName = listName || '';
    localListEmoji = listEmoji || '';
  });

  // 8. FUNCTIONS
  const createList = () => {
    const newList: TodoList = {
      id: listId || crypto.randomUUID(),
      name: localListName,
      emoji: localListEmoji || '📝',
      history: [],
      todos: [],
    };
    todoStore.update((n) => {
      return [...n, newList];
    });

    closeOverlay();
    celebrate();

    // Dispatch event to parent to set this as active list
    window.dispatchEvent(new CustomEvent('list-created', { detail: { id: newList.id } }));
  };
  const updateList = () => {
    todoStore.update((n) => {
      return n.map((list, index) => {
        if (index === listIndex) {
          return {
            ...list,
            name: localListName,
            emoji: localListEmoji || '📝',
          };
        }
        return list;
      });
    });

    closeOverlay();
  };
  const deleteList = () => {
    todoStore.update((n) => {
      return n.filter((list) => list.id !== listId);
    });
    closeOverlay();
  };
  const proceedOnEnter = (event: KeyboardEvent) => {
    if (isEnter(event)) {
      if (localListName && (isEmoji(localListEmoji) || localListEmoji === '')) {
        $listOverlayOptionsStore.type === 'new' ? createList() : updateList();
      }
    }
  };
  const closeOverlay = () => {
    $listOverlayOptionsStore.showOverlay = false;
    $listOverlayOptionsStore.type = undefined;
    listIndex = -1;
    localListName = '';
    localListEmoji = '';
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
    if (detail.text === $t('page.shared.delete')) deleteList();
  }}
  class={modalStates}
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
            listName: localListName,
          })}</b
        >.
      </p>
    {/if}

    <div class="create_list_section">
      <TextInput
        bind:value={localListName}
        labelText={$t('page.todos.overlay.listName')}
        placeholder={$t('page.todos.overlay.listName')}
        autofocus
        class="mb1"
        on:keyup={(event) => proceedOnEnter(event)}
      />
      <div>
        <TextInput
          bind:value={localListEmoji}
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

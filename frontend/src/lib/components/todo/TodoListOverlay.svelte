<script lang="ts">
  // 1. IMPORTS
  import {
    createSharedTodoList,
    updateSharedTodoList,
    deleteSharedTodoList,
  } from '$lib/api/todo.api';
  import type { TodoList } from '$lib/types/todo.ts';
  import { isEmoji, isEnter } from '$lib/util/helper.ts';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Tooltip from 'carbon-components-svelte/src/Tooltip/Tooltip.svelte';
  import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import EmojiPicker from '$lib/components/shared/EmojiPicker.svelte';

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
  let sharedIdCopied = $state<boolean>(false);
  let showDeleteConfirm = $state<boolean>(false);

  // 5. DERIVED
  let listIndex = $derived($todoStore.findIndex((list) => list.id === listId));
  let currentList = $derived($todoStore.find((list) => list.id === listId));
  let isSharedList = $derived(currentList?.isShared || false);
  let modalStates = $derived.by(() => {
    let classes = '';
    if (!localListName || (!isEmoji(localListEmoji) && localListEmoji !== ''))
      classes += 'modal_unsavable';
    if ($listOverlayOptionsStore.type === 'new')
      classes += ' modal_undeletable';
    return classes;
  });
  let secondaryButtonsConfig = $derived.by(() => {
    const buttons: Array<{ text: string }> = [
      { text: $t('page.shared.abort') },
    ];

    // Add share/unshare button only for edit mode
    if ($listOverlayOptionsStore.type === 'edit') {
      if (isSharedList) {
        buttons.push({ text: $t('page.todos.share.makeLocal') });
      } else {
        buttons.push({ text: $t('page.todos.share.shareTitle') });
      }
    }

    // Add delete button (always last)
    buttons.push({ text: $t('page.shared.delete') });

    return buttons as [{ text: string }, { text: string }];
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
      isShared: false,
    };
    todoStore.update((n) => {
      return [...n, newList];
    });

    closeOverlay();
    celebrate();

    // Dispatch event to parent to set this as active list
    window.dispatchEvent(
      new CustomEvent('list-created', { detail: { id: newList.id } }),
    );
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

  const copySharedId = () => {
    if (currentList?.sharedId) {
      navigator.clipboard.writeText(currentList.sharedId);
      sharedIdCopied = true;
      setTimeout(() => (sharedIdCopied = false), 2000);
    }
  };

  const toggleShareList = async () => {
    if (isSharedList) {
      // Make local only
      todoStore.update((n) => {
        return n.map((list) => {
          if (list.id === listId) {
            const { sharedId, version, ...rest } = list;
            return {
              ...rest,
              isShared: false,
            };
          }
          return list;
        });
      });
    } else {
      // Make shared - call backend to create shared list
      try {
        const sharedList = await createSharedTodoList(
          localListName,
          localListEmoji || '📝',
        );

        // Update local store with shared list info
        todoStore.update((n) => {
          return n.map((list) => {
            if (list.id === listId) {
              return {
                ...list,
                isShared: true,
                sharedId: sharedList._id,
                version: sharedList.version,
              };
            }
            return list;
          });
        });

        // Push existing todos to the server
        if (currentList?.todos && currentList.todos.length > 0) {
          await updateSharedTodoList(sharedList._id, {
            name: localListName,
            emoji: localListEmoji || '📝',
            todos: currentList.todos,
            history: currentList.history || [],
            version: sharedList.version,
          });
        }
      } catch (error) {
        console.error('Error creating shared list:', error);
      }
    }
  };
  const confirmDelete = () => {
    showDeleteConfirm = true;
  };

  const deleteList = async () => {
    showDeleteConfirm = false;

    // If it's a shared list, delete from server first
    if (currentList?.isShared && currentList?.sharedId) {
      try {
        await deleteSharedTodoList(currentList.sharedId);
      } catch (error) {
        console.error('Error deleting shared list from server:', error);
        // Continue with local deletion even if server deletion fails
      }
    }

    // Delete from local store
    todoStore.update((n) => {
      return n.filter((list) => list.id !== listId);
    });
    closeOverlay();

    // Dispatch event to parent to select a new list after deletion
    window.dispatchEvent(new CustomEvent('list-deleted'));
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
  secondaryButtons={secondaryButtonsConfig}
  on:click:button--primary={$listOverlayOptionsStore.type === 'new'
    ? createList
    : updateList}
  on:click:button--secondary={({ detail }) => {
    if (detail.text === $t('page.shared.abort')) closeOverlay();
    if (detail.text === $t('page.shared.delete')) confirmDelete();
    if (
      detail.text === $t('page.todos.share.shareTitle') ||
      detail.text === $t('page.todos.share.makeLocal')
    ) {
      toggleShareList();
    }
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
          >{$t('page.todos.overlay.editSubtitle', {
            listName: localListName,
          })}</b
        >
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
      <div class="emoji_picker_section">
        <span class="emoji_picker_label">
          {$t('page.todos.overlay.listEmojiDescription')}
        </span>
        <EmojiPicker bind:selectedEmoji={localListEmoji} placeholder="📝" />
      </div>
    </div>

    {#if isSharedList && currentList?.sharedId}
      <div class="share_section">
        <hr class="share_section_divider" />
        <p>{$t('page.todos.share.shareDescription')}</p>
        <div class="shared_id_container">
          <TextInput
            value={currentList.sharedId}
            labelText="ID"
            readonly
            class="shared_id_input"
          />
          <button
            onclick={copySharedId}
            class="copy_button"
            title={$t('page.todos.share.copyId')}
          >
            <Copy />
          </button>
        </div>
      </div>
    {/if}

    {#if sharedIdCopied}
      <div class="notification_container">
        <InlineNotification
          kind="success"
          title={$t('page.todos.share.idCopied')}
          hideCloseButton={false}
          lowContrast
          on:close={() => (sharedIdCopied = false)}
        />
      </div>
    {/if}
  {:else}
    <p>Locale initializing...</p>
  {/if}
</Modal>

<!-- Delete Confirmation Modal -->
<Modal
  danger
  bind:open={showDeleteConfirm}
  modalHeading={$t('page.todos.overlay.deleteConfirmTitle')}
  primaryButtonText={$t('page.shared.delete')}
  secondaryButtonText={$t('page.shared.abort')}
  on:click:button--primary={deleteList}
  on:click:button--secondary={() => (showDeleteConfirm = false)}
  on:close={() => (showDeleteConfirm = false)}
>
  {#if $initialized}
    <p>
      {isSharedList
        ? $t('page.todos.overlay.deleteSharedWarning', { listName: localListName })
        : $t('page.todos.overlay.deleteLocalWarning', { listName: localListName })}
    </p>
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
    flex-direction: column;
    gap: 1rem;
    margin-top: var(--default_padding);
  }

  .emoji_picker_section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .emoji_picker_label {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--cds-text-secondary);
    margin-bottom: 0.25rem;
  }

  .share_section {
    margin-top: var(--default_padding);
    padding: calc(var(--default_padding) / 2);
    background-color: var(--lightgrey20);
    border-radius: 0.5rem;
  }

  .share_section_divider {
    border-color: var(--darkgrey80);
    margin-bottom: calc(var(--default_padding) * 2);
  }

  .shared_id_container {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    margin-top: 0.5rem;
  }

  .copy_button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cds-field);
    color: var(--cds-text-primary);
    border: 1px solid var(--cds-border-strong);
    border-radius: 0.25rem;
    padding: 0.875rem 1rem;
    cursor: pointer;
    transition: background 0.2s;
    height: 2.5rem;
    min-width: 2.5rem;
    margin-bottom: 1px;
  }

  .copy_button:hover {
    background: var(--cds-field-hover);
  }

  .copy_button:active {
    background: var(--cds-field-active);
  }

  .notification_container {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--cds-border-subtle);
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
      > .bx--btn--secondary:last-child
  ) {
    pointer-events: none;
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Make delete button red (last secondary button) */
  :global(
    .bx--modal-container > .bx--modal-footer > .bx--btn--secondary:last-child
  ) {
    background-color: #da1e28;
    border-color: #da1e28;
    color: white;
  }

  :global(
    .bx--modal-container
      > .bx--modal-footer
      > .bx--btn--secondary:last-child:hover
  ) {
    background-color: #ba1b23;
    border-color: #ba1b23;
  }

  /* Don't apply red styling when button is disabled */
  :global(
    .modal_undeletable
      > .bx--modal-container
      > .bx--modal-footer
      > .bx--btn--secondary:last-child
  ) {
    background-color: transparent;
    border-color: transparent;
    color: inherit;
  }
</style>

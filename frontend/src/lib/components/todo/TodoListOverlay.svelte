<script lang="ts">
  import type { TodoList } from '$lib/types/todo.ts';
  import { isEmoji, isEnter } from '$lib/util/helper.ts';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import { Modal, TextInput, Tooltip } from 'carbon-components-svelte';
  import { Save } from 'carbon-icons-svelte';

  export let listIndex: number;
  export let newListName = '';
  export let newListEmoji = '';

  $: modalStates = () => {
    let classes = '';

    console.log('newListName', newListName);
    console.log('!newListName', !newListName);
    console.log('newListEmoji', newListEmoji);
    console.log('isEmoji(newListEmoji)', isEmoji(newListEmoji));
    console.log(
      "(!isEmoji(newListEmoji) && newListEmoji !== '')",
      !isEmoji(newListEmoji) && newListEmoji !== '',
    );
    if (!newListName || (!isEmoji(newListEmoji) && newListEmoji !== ''))
      classes += 'modal_unsavable';
    if ($listOverlayOptionsStore.type === 'new')
      classes += ' modal_undeletable';

    return classes;
  };

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
            listName: newListName,
          })}</b
        >.
      </p>
    {/if}

    <div class="create_list_section">
      <TextInput
        bind:value={newListName}
        labelText={$t('page.todos.overlay.listName')}
        placeholder={$t('page.todos.overlay.listName')}
        autofocus
        class="mb1"
        on:keyup={(event) => proceedOnEnter(event)}
      />
      <div>
        <TextInput
          bind:value={newListEmoji}
          labelText={$t('page.todos.overlay.listEmoji')}
          placeholder={$t('page.todos.overlay.listEmojiDescription')}
          class="mb1"
          on:keyup={(event) => proceedOnEnter(event)}
        />

        <Tooltip triggerText="Emoji Info" direction="top">
          <p>{$t('page.todos.overlay.emojiTooltip')}</p>
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

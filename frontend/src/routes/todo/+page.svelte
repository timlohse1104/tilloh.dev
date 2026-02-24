<script lang="ts">
  // 1. IMPORTS
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import TodoListComponent from '$lib/components/todo/TodoList.svelte';
  import TodoListOverlay from '$lib/components/todo/TodoListOverlay.svelte';
  import { getSharedTodoList } from '$lib/api/todo.api';
  import { applicationRoutes } from '$lib/config/applications';
  import type { TodoList } from '$lib/types/todo';
  import { languageStore } from '$lib/util/stores/store-language';
  import { listOverlayOptionsStore } from '$lib/util/stores/store-other';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, setLocale, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Modal from 'carbon-components-svelte/src/Modal/Modal.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import ClickableTile from 'carbon-components-svelte/src/Tile/ClickableTile.svelte';
  import Catalog from 'carbon-icons-svelte/lib/Catalog.svelte';
  import DocumentDownload from 'carbon-icons-svelte/lib/DocumentDownload.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import TaskAdd from 'carbon-icons-svelte/lib/TaskAdd.svelte';
  import { onMount } from 'svelte';

  // 2. CONST (non-reactive constants)
  const { todo: todoRoute } = applicationRoutes;
  const LAST_VIEWED_LIST_KEY = 'tilloh-dev:todo:lastViewedListId';

  // 4. STATE
  let currentListId = $state('');
  let newListId = $state('');
  let openMenu = $state(false);
  let locale = $state($languageStore);
  let showImportModal = $state(false);
  let importSharedId = $state('');
  let importErrorMessage = $state('');
  let showImportError = $state(false);

  // 6. EFFECTS
  $effect(() => {
    locale = $languageStore;
  });

  // Persist last viewed list ID to localStorage
  $effect(() => {
    if (currentListId) {
      localStorage.setItem(LAST_VIEWED_LIST_KEY, currentListId);
    }
  });

  // Global polling for all shared lists to detect deletions
  $effect(() => {
    const sharedLists = $todoStore.filter((list) => list.isShared && list.sharedId);
    if (sharedLists.length === 0) return;

    const checkAllSharedLists = async () => {
      const listsToRemove: string[] = [];

      for (const list of sharedLists) {
        try {
          const result = await getSharedTodoList(list.sharedId!);
          if (result.status === 404) {
            listsToRemove.push(list.id);
          }
        } catch (error) {
          console.error('Error checking shared list:', list.name, error);
        }
      }

      if (listsToRemove.length > 0) {
        console.log('Removing deleted shared lists:', listsToRemove.length);
        todoStore.update((lists) => lists.filter((list) => !listsToRemove.includes(list.id)));

        // If current list was deleted, select another
        if (listsToRemove.includes(currentListId)) {
          window.dispatchEvent(new CustomEvent('list-deleted'));
        }
      }
    };

    // Check immediately
    checkAllSharedLists();

    // Then check every 10 seconds
    const interval = setInterval(checkAllSharedLists, 10000);

    return () => clearInterval(interval);
  });

  // 7. LIFECYCLE
  onMount(async () => {
    await setLocale($languageStore);

    // Restore last viewed list from localStorage
    const savedListId = localStorage.getItem(LAST_VIEWED_LIST_KEY);
    if (savedListId && $todoStore.some((list) => list.id === savedListId)) {
      currentListId = savedListId;
    } else if ($todoStore.length > 0) {
      // Fallback to first list if saved ID doesn't exist
      currentListId = $todoStore[0].id;
    }

    // Listen for list creation events
    window.addEventListener('list-created', ((e: CustomEvent) => {
      currentListId = e.detail.id;
    }) as EventListener);

    // Listen for list deletion events
    window.addEventListener('list-deleted', () => {
      // Set currentListId to first remaining list, or empty if none exist
      if ($todoStore.length > 0) {
        currentListId = $todoStore[0].id;
      } else {
        currentListId = '';
        localStorage.removeItem(LAST_VIEWED_LIST_KEY);
      }
    });
  });

  // 8. FUNCTIONS
  const showListOverlay = (type: 'new' | 'edit', id?: string) => {
    openMenu = false;
    if (type === 'new') {
      newListId = crypto.randomUUID();
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    } else {
      currentListId = id;
      $listOverlayOptionsStore.showOverlay = true;
      $listOverlayOptionsStore.type = type;
    }
  };

  const importSharedList = async () => {
    if (!importSharedId.trim()) return;

    try {
      // Check for duplicates
      const existingList = $todoStore.find((list) => list.sharedId === importSharedId);
      if (existingList) {
        importErrorMessage = $t('page.todos.share.importDuplicate');
        showImportError = true;
        setTimeout(() => {
          showImportError = false;
        }, 5000);
        return;
      }

      const result = await getSharedTodoList(importSharedId);

      if (result.status !== 200 || !result.data) {
        importErrorMessage = $t('page.todos.share.importError');
        showImportError = true;
        setTimeout(() => {
          showImportError = false;
        }, 5000);
        return;
      }

      const sharedList = result.data;
      const newList: TodoList = {
        id: crypto.randomUUID(),
        name: sharedList.name,
        emoji: sharedList.emoji,
        todos: sharedList.todos,
        history: sharedList.history || [],
        isShared: true,
        sharedId: sharedList._id,
        version: sharedList.version,
      };

      todoStore.update((n) => [...n, newList]);
      importSharedId = '';
      showImportModal = false;
    } catch (error) {
      console.error('Error importing shared list:', error);
      importErrorMessage = $t('page.todos.share.importError');
      showImportError = true;
      setTimeout(() => {
        showImportError = false;
      }, 5000);
    }
  };
  const setActiveList = (id: string) => {
    currentListId = id;
    openMenu = false;
  };
  const getListInformation = (id: string): { name: string; emoji: string } => {
    const list = $todoStore.find((list) => list.id === id);
    if (list) return { name: list.name, emoji: list.emoji };
    return { name: undefined, emoji: undefined };
  };
</script>

<svelte:head>
  <title>{todoRoute.name[locale]}</title>
  <meta name={todoRoute.name[locale]} content="tilloh.dev" />
</svelte:head>

{#if todoRoute.toggle}
  {#if $initialized}
    <section>
      <Modal
        passiveModal
        bind:open={openMenu}
        modalHeading={$t('page.todos.sideMenu.title')}
        class="todo_list_modal"
      >
        <p>
          {$t('page.todos.sideMenu.description')}
        </p>

        <p class="mt1">
          {$t('page.todos.sideMenu.persistenceInfo')}
        </p>

        {#if $todoStore.length === 0}
          <div class="centered mb1">
            <p class="mt1">{$t('page.todos.sideMenu.emptyInfo')}</p>
          </div>
        {:else}
          <div class="mt1">
            {#each $todoStore as list}
              <ClickableTile on:click={() => setActiveList(list.id)}>
                <div class="todo_list_entry">
                  <h4>
                    {list.emoji}
                    {list.name}
                    {#if list.isShared}
                      <span
                        class="shared_badge"
                        title={$t('page.todos.share.sharedList')}>🔗</span
                      >
                    {/if}
                  </h4>
                  <Button
                    kind="tertiary"
                    iconDescription={$t('page.todos.overlay.editTitle')}
                    tooltipAlignment="end"
                    icon={Edit}
                    size="field"
                    on:click={() => showListOverlay('edit', list.id)}
                  />
                </div>
              </ClickableTile>
            {/each}
          </div>
        {/if}

        <hr style="border-color:var(--darkgrey80);width:95%" />

        <div class="centered button_group">
          <Button
            kind="tertiary"
            iconDescription={$t('page.todos.overlay.createTitle')}
            icon={TaskAdd}
            on:click={() => showListOverlay('new')}
            class="mt1"
          >
            {$t('page.todos.sideMenu.createNewList')}
          </Button>
          <Button
            kind="tertiary"
            iconDescription={$t('page.todos.share.importList')}
            icon={DocumentDownload}
            on:click={() => {
              openMenu = false;
              showImportModal = true;
            }}
            class="mt1"
          >
            {$t('page.todos.share.importList')}
          </Button>
        </div>
      </Modal>

      <Modal
        bind:open={showImportModal}
        modalHeading={$t('page.todos.share.importTitle')}
        primaryButtonText={$t('page.todos.share.importButton')}
        secondaryButtonText={$t('page.shared.abort')}
        on:click:button--primary={importSharedList}
        on:click:button--secondary={() => (showImportModal = false)}
      >
        {#if $initialized}
          <p>{$t('page.todos.share.importDescription')}</p>
          <TextInput
            bind:value={importSharedId}
            labelText={$t('page.todos.share.importPlaceholder')}
            placeholder={$t('page.todos.share.importPlaceholder')}
            class="mt1"
            on:keyup={(e) => e.key === 'Enter' && importSharedList()}
          />
        {:else}
          <p>Locale initializing...</p>
        {/if}
      </Modal>

      <div class="app_content">
        {#if showImportError}
          <InlineNotification
            kind="error"
            title={$t('page.shared.error')}
            subtitle={importErrorMessage}
            hideCloseButton={false}
            lowContrast
            on:close={() => (showImportError = false)}
          />
        {/if}
        <div class="main_content">
          <Button
            kind="tertiary"
            iconDescription={$t('page.todos.sideMenu.title')}
            icon={Catalog}
            id="list_menu_button"
            tooltipPosition="left"
            on:click={() => (openMenu = !openMenu)}
          />
          {#if $todoStore.length === 0}
            <h1 class="mt2">
              {$t('page.todos.list.emptyTitle')}
            </h1>
            <div style="display:flex;flex-direction:column;align-items:center;">
              <p class="mt2">
                {$t('page.todos.list.emptySubtitle')}
                <Catalog />
              </p>
            </div>
          {:else}
            <TodoListComponent listId={currentListId || $todoStore[0].id} />
          {/if}
        </div>
      </div>

      {#if $listOverlayOptionsStore.showOverlay}
        <TodoListOverlay
          listId={$listOverlayOptionsStore.type === 'new'
            ? newListId
            : currentListId}
          listName={getListInformation(
            $listOverlayOptionsStore.type === 'new' ? newListId : currentListId,
          ).name}
          listEmoji={getListInformation(
            $listOverlayOptionsStore.type === 'new' ? newListId : currentListId,
          ).emoji}
        />
      {/if}
    </section>
  {:else}
    <section>Locale initializing...</section>
  {/if}
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  section {
    position: relative;
    display: flex;
    z-index: 0;
  }

  :global(.todo_list_modal .bx--modal-container .bx--modal-content) {
    margin-bottom: 2rem;
  }

  .todo_list_entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .shared_badge {
    margin-left: 0.5rem;
    font-size: 0.8em;
    color: var(--primary);
  }

  .button_group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .app_content {
    flex: auto;
    overflow: auto;
    position: relative;
    flex-grow: 1;
  }

  .main_content {
    overflow: auto;
    height: 100%;
    box-sizing: border-box;
  }

  :global(#list_menu_button) {
    position: absolute;
    right: 0;
    top: 0;
    margin: calc(var(--default_padding) / 10);
  }
</style>

<script lang="ts">
  // 1. IMPORTS
  import { getSharedTodoList, updateSharedTodoList } from '$lib/api/todo.api';
  import type { Todo } from '$lib/types/todo';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Category from 'carbon-icons-svelte/lib/Category.svelte';
  import ChevronDown from 'carbon-icons-svelte/lib/ChevronDown.svelte';
  import ChevronUp from 'carbon-icons-svelte/lib/ChevronUp.svelte';
  import List from 'carbon-icons-svelte/lib/List.svelte';
  import { onMount } from 'svelte';
  import TodoComponent from './Todo.svelte';
  import TodoInputSection from './TodoInputSection.svelte';
  import TodoItemList from './TodoItemList.svelte';

  // 2. PROPS
  let { listId }: { listId: string } = $props();

  // 3. STATE
  let isCategoryView = $state(true); // false = classic, true = byCategory (default: category view)

  // 4. STATE
  let syncTimeout = $state<any>(null);
  let showConflictNotification = $state(false);
  let showDeletedNotification = $state(false);
  let historyModalOpen = $state(false);
  let categoriesModalOpen = $state(false);
  let lastCategoryInputContext = $state<'new-todo' | 'edit-todo' | null>(null);
  let headerExpanded = $state(true);

  // 5. DERIVED
  let list = $derived.by(() => {
    const allLists = $todoStore;
    const foundList = listId
      ? allLists.find((l) => l.id === listId)
      : undefined;

    if (foundList) {
      // Sort todos: unchecked first, checked last
      const sortedTodos = [...foundList.todos]
        .map((todo) => ({
          ...todo,
          category: todo.category || '',
        }))
        .sort((a, b) => {
          if (a.done === b.done) return 0;
          return a.done ? 1 : -1;
        });

      return {
        ...foundList,
        todos: sortedTodos,
        categories: foundList.categories || [],
      };
    }

    return undefined;
  });

  let isSharedList = $derived(list?.isShared || false);

  // 6. DERIVED - Categorized view
  let categorizedTodos = $derived.by(() => {
    if (!list || !isCategoryView) return {};

    const categories: Record<string, Todo[]> = {};

    // Group by category, but separate done and undone items
    const undoneTodos = list.todos.filter((todo) => !todo.done);
    const doneTodos = list.todos.filter((todo) => todo.done);

    // Group undone todos by category
    undoneTodos.forEach((todo) => {
      const category = todo.category || '';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(todo);
    });

    // Add "Done" category for completed items
    if (doneTodos.length > 0) {
      categories['Done'] = doneTodos;
    }

    return categories;
  });

  // 7. LIFECYCLE
  onMount(() => {
    // Listen for rename events from Todo components
    window.addEventListener('rename', ((e: CustomEvent) => {
      renameTodo(e.detail.id, e.detail.title, e.detail.category);
    }) as EventListener);
  });

  // Reactive sync setup - automatically starts/stops based on isSharedList
  $effect(() => {
    if (!isSharedList || !list?.sharedId) return;

    // Fetch immediately to check if list still exists
    fetchAndMergeSharedList();

    // Set up periodic polling every 5 seconds to pull updates from server
    const interval = setInterval(() => {
      fetchAndMergeSharedList();
    }, 5000);

    // Cleanup function runs when effect re-runs or component unmounts
    return () => clearInterval(interval);
  });

  // 8. FUNCTIONS
  const syncSharedList = async () => {
    if (!isSharedList || !list?.sharedId || !list?.version) return;

    // Clear any existing timeout
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    // Debounce sync to avoid too many requests
    syncTimeout = setTimeout(async () => {
      try {
        const result = await updateSharedTodoList(list.sharedId, {
          name: list.name,
          emoji: list.emoji,
          todos: list.todos,
          history: list.history,
          categories: list.categories || [],
          version: list.version,
        });

        if (result.status === 200 && result.data) {
          // Success - update local version to match server
          todoStore.update((todoListArray) => {
            return todoListArray.map((l) => {
              if (l.id === listId) {
                return {
                  ...l,
                  version: result.data!.version,
                };
              }
              return l;
            });
          });
        } else if (result.status === 409) {
          // Conflict - pull server state and show notification
          await fetchAndMergeSharedList();
          showConflictNotification = true;
          setTimeout(() => {
            showConflictNotification = false;
          }, 5000);
        } else {
          console.error('Sync failed with status:', result.status);
        }
      } catch (error) {
        console.error('Error syncing shared list:', error);
      }
    }, 1000); // Debounce by 1 second
  };

  const fetchAndMergeSharedList = async () => {
    if (!isSharedList || !list?.sharedId) return;

    try {
      const result = await getSharedTodoList(list.sharedId);

      if (result.status === 404) {
        console.log(
          'List deleted by another user, removing locally:',
          list.name,
        );
        // List was deleted by another user - remove from local store
        todoStore.update((todoListArray) => {
          return todoListArray.filter((l) => l.id !== listId);
        });

        // Show notification that list was deleted
        showDeletedNotification = true;
        setTimeout(() => {
          showDeletedNotification = false;
        }, 5000);

        // Dispatch event to parent to select a new list
        window.dispatchEvent(new CustomEvent('list-deleted'));
        return;
      }

      if (result.status === 200 && result.data) {
        const serverList = result.data;

        // Only update if server has a newer version
        if (serverList.version > (list.version || 0)) {
          console.log('Syncing updates from server for list:', list.name);
          todoStore.update((todoListArray) => {
            return todoListArray.map((l) => {
              if (l.id === listId) {
                return {
                  ...l,
                  name: serverList.name,
                  emoji: serverList.emoji,
                  todos: serverList.todos,
                  history: serverList.history,
                  categories: serverList.categories || [],
                  version: serverList.version,
                };
              }
              return l;
            });
          });
        }
      } else if (result.status !== 200) {
        console.warn('Unexpected status from server:', result.status);
      }
    } catch (error) {
      console.error('Error fetching shared list:', error);
    }
  };

  const updateCategories = (listId: string, newCategory?: string) => {
    if (!newCategory) return;

    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          const categories = list.categories || [];
          if (!categories.includes(newCategory)) {
            return {
              ...list,
              categories: [...categories, newCategory],
            };
          }
        }
        return list;
      });
    });
  };

  const renameTodo = (
    todoId: string,
    newTitle: string,
    newCategory?: string,
  ) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map((todo) =>
              todo.id === todoId
                ? {
                    ...todo,
                    title: newTitle,
                    category:
                      newCategory !== undefined ? newCategory : todo.category,
                  }
                : todo,
            ),
          };
        }
        return list;
      });
    });

    // Update categories if a new category was added
    if (newCategory) {
      updateCategories(listId, newCategory);
    }

    syncSharedList();
  };

  const deleteTodo = (todoId: string) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.filter((todo) => todo.id !== todoId),
          };
        }
        return list;
      });
    });
    syncSharedList();
  };
  const checkTodo = (todoId: string) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            todos: list.todos.map((todo) =>
              todo.id === todoId ? { ...todo, done: !todo.done } : todo,
            ),
          };
        }
        return list;
      });
    });
    syncSharedList();
  };
  const clearHistory = () => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            history: [],
          };
        }
        return list;
      });
    });
    syncSharedList();
  };

  const removeEntryFromHistory = (entry: string) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            history: list.history.filter((e) => e !== entry),
          };
        }
        return list;
      });
    });
  };

  const clearCategories = () => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            categories: [],
          };
        }
        return list;
      });
    });
    syncSharedList();
  };

  const removeCategory = (category: string) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            categories: list.categories.filter((c) => c !== category),
          };
        }
        return list;
      });
    });
    syncSharedList();
  };

  const readdTodoFromHistory = (entry: string) => {
    todoStore.update((todoListArray) => {
      return todoListArray.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            todos: [
              ...list.todos,
              {
                id: crypto.randomUUID(),
                title: entry,
                done: false,
                category: '',
              },
            ],
          };
        }
        return list;
      });
    });
    syncSharedList();
  };
</script>

{#if $initialized}
  <section>
    {#if showConflictNotification}
      <InlineNotification
        kind="info"
        title={$t('page.todos.share.conflictResolved')}
        subtitle={$t('page.todos.share.conflictDescription')}
        hideCloseButton={false}
        lowContrast
        on:close={() => (showConflictNotification = false)}
      />
    {/if}
    {#if showDeletedNotification}
      <InlineNotification
        kind="warning"
        title={$t('page.todos.share.listDeleted')}
        subtitle={$t('page.todos.share.listDeletedDescription')}
        hideCloseButton={false}
        lowContrast
        on:close={() => (showDeletedNotification = false)}
      />
    {/if}
    <div class="list_area">
      <div class="list_header">
        <div class="list_title_row">
          <h2>
            {list?.emoji || $t('page.todos.list.noEmoji')}
            {list?.name || $t('page.todos.list.noEmoji')}
          </h2>
          <div class="view_toggle">
            <button
              class="view_btn"
              class:active={!isCategoryView}
              onclick={() => (isCategoryView = false)}
              title={$t('page.todos.view.classic')}
              aria-label={$t('page.todos.view.classic')}
            >
              <List size={16} />
            </button>
            <button
              class="view_btn"
              class:active={isCategoryView}
              onclick={() => (isCategoryView = true)}
              title={$t('page.todos.view.byCategory')}
              aria-label={$t('page.todos.view.byCategory')}
            >
              <Category size={16} />
            </button>
          </div>
          <button
            class="header_toggle_btn"
            onclick={() => (headerExpanded = !headerExpanded)}
            aria-label={headerExpanded
              ? $t('page.todos.collapseInput')
              : $t('page.todos.expandInput')}
          >
            {#if headerExpanded}
              <ChevronUp size={20} />
            {:else}
              <ChevronDown size={20} />
            {/if}
          </button>
        </div>
        {#if headerExpanded}
          <TodoInputSection
            {listId}
            categories={list?.categories || []}
            onTodoAdded={() => {
              syncSharedList();
            }}
            onOpenHistory={() => {
              categoriesModalOpen = false;
              historyModalOpen = true;
            }}
            onOpenCategories={() => {
              historyModalOpen = false;
              const activeEl = document.activeElement;
              if (activeEl?.closest('[data-category-input="edit-todo"]')) {
                lastCategoryInputContext = 'edit-todo';
              } else {
                lastCategoryInputContext = 'new-todo';
              }
              categoriesModalOpen = true;
            }}
          />
        {/if}
      </div>

      <div class="list_content">
        {#if !isCategoryView}
          {#if Object.keys(list?.todos).length === 0}
            <pre class="status">{$t('page.todos.list.emptyList')}</pre>
          {:else}
            {#each list?.todos || [] as todo (todo.id)}
              <TodoComponent
                id={todo.id}
                title={todo.title}
                done={todo.done}
                category={todo.category}
                categories={list?.categories || []}
                deleteTodo={() => deleteTodo(todo.id)}
                todoChecked={() => checkTodo(todo.id)}
              />
            {/each}
          {/if}
        {:else if Object.keys(categorizedTodos).length === 0}
          <pre class="status">{$t('page.todos.list.emptyList')}</pre>
        {:else}
          {#each Object.entries(categorizedTodos) as [category, todos]}
            <div class="category-section">
              <h3 class="category-header">
                {category === 'Done'
                  ? $t('page.todos.doneCategory')
                  : category === ''
                    ? $t('page.todos.uncategorized')
                    : category}
              </h3>
              {#each todos as todo (todo.id)}
                <TodoComponent
                  id={todo.id}
                  title={todo.title}
                  done={todo.done}
                  amount={todo.amount}
                  category={todo.category}
                  categories={list?.categories || []}
                  deleteTodo={() => deleteTodo(todo.id)}
                  todoChecked={() => checkTodo(todo.id)}
                />
              {/each}
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- History Modal -->
    <TodoItemList
      bind:open={historyModalOpen}
      title={$t('page.todos.list.history')}
      items={list?.history || []}
      emptyMessage={$t('page.todos.list.historyEmpty')}
      clearTooltip={$t('page.todos.deleteHistroy')}
      onItemClick={readdTodoFromHistory}
      onRemoveItem={removeEntryFromHistory}
      onClearAll={clearHistory}
      onClose={() => (historyModalOpen = false)}
    />

    <!-- Categories Modal -->
    <TodoItemList
      bind:open={categoriesModalOpen}
      title={$t('page.todos.list.categories')}
      items={list?.categories || []}
      emptyMessage={$t('page.todos.list.categoriesEmpty')}
      clearTooltip={$t('page.todos.deleteCategories')}
      itemClickTooltip="Click to use this category"
      onItemClick={(category) => {
        window.dispatchEvent(
          new CustomEvent('category-selected', {
            detail: { category, context: lastCategoryInputContext },
          }),
        );
      }}
      onRemoveItem={removeCategory}
      onClearAll={clearCategories}
      onClose={() => (categoriesModalOpen = false)}
      preventFocusSteal={true}
    />
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    padding: 0;
    flex-direction: column;
    overflow: hidden;
    display: flex;
    align-items: center;
    height: 100%;
  }

  .list_area {
    width: 85%;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1rem 0;
    box-sizing: border-box;

    @media #{$tablet} {
      width: 100%;
    }

    @media #{$phone} {
      width: 100%;
    }
  }

  .list_header {
    margin: 0;
    flex-shrink: 0;
    padding-bottom: 1rem;
  }

  .list_title_row {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    h2 {
      flex: 1;
    }
  }

  .header_toggle_btn {
    display: none;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: 0.25rem;
    line-height: 0;
    flex-shrink: 0;
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    @media #{$phone} {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .view_toggle {
    display: flex;
    gap: 2px;
    margin-left: auto;

    @media #{$phone} {
      margin-left: 0;
    }
  }

  .view_btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    padding: 0.25rem;
    line-height: 0;
    flex-shrink: 0;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.8);
    }

    &.active {
      background: rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 1);
      border-color: rgba(255, 255, 255, 0.5);
    }
  }

  .list_content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }

  .category-section {
    margin-bottom: 1.5rem;
  }

  .category-header {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
</style>

<script lang="ts">
  // 1. IMPORTS
  import { getSharedTodoList, updateSharedTodoList } from '$lib/api/todo.api';
  import type { Todo } from '$lib/types/todo';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';
  import { onMount } from 'svelte';
  import TodoComponent from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';
  import TodoItemList from './TodoItemList.svelte';

  // 2. PROPS
  let { listId }: { listId: string } = $props();

  // 3. STATE
  let isCategoryView = $state(true); // false = classic, true = byCategory (default: category view)

  // 4. STATE
  let syncTimeout = $state<any>(null);
  let showConflictNotification = $state(false);
  let showDeletedNotification = $state(false);

  // 5. DERIVED
  let list = $derived.by(() => {
    const allLists = $todoStore;
    const foundList = listId
      ? allLists.find((l) => l.id === listId)
      : undefined;

    if (foundList) {
      // Sort todos: unchecked first, checked last
      // Also ensure backwards compatibility: add amount and category if missing
      const sortedTodos = [...foundList.todos]
        .map((todo) => ({
          ...todo,
          amount: todo.amount || '1x',
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
      renameTodo(
        e.detail.id,
        e.detail.title,
        e.detail.amount,
        e.detail.category,
      );
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
        console.log('List deleted by another user, removing locally:', list.name);
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
    newAmount: string,
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
                    amount: newAmount,
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
                amount: '1x',
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
    <div class="mt2 list_area">
      <div class="list_header">
        <h2>
          {list?.emoji || $t('page.todos.list.noEmoji')}
          {list?.name || $t('page.todos.list.noEmoji')}
        </h2>
        <hr />
        <div class="history_categories_container">
          <div class="history_area">
            <TodoItemList
              title={$t('page.todos.list.history')}
              items={list?.history || []}
              emptyMessage={$t('page.todos.list.historyEmpty')}
              clearTooltip={$t('page.todos.deleteHistroy')}
              onItemClick={readdTodoFromHistory}
              onRemoveItem={removeEntryFromHistory}
              onClearAll={clearHistory}
            />
          </div>
          <div class="categories_area">
            <TodoItemList
              title={$t('page.todos.list.categories')}
              items={list?.categories || []}
              emptyMessage={$t('page.todos.list.categoriesEmpty')}
              clearTooltip={$t('page.todos.deleteCategories')}
              itemClickTooltip="Click to use this category"
              onItemClick={(category) => {
                window.dispatchEvent(
                  new CustomEvent('category-selected', { detail: { category } }),
                );
              }}
              onRemoveItem={removeCategory}
              onClearAll={clearCategories}
              preventFocusSteal={true}
            />
          </div>
        </div>
        <div class="view-toggle-container">
          <Toggle
            bind:toggled={isCategoryView}
            labelA={$t('page.todos.view.classic')}
            labelB={$t('page.todos.view.byCategory')}
            size="sm"
          />
        </div>
        <TodoInput
          {listId}
          categories={list?.categories || []}
          onTodoAdded={() => {
            syncSharedList();
          }}
        />
      </div>

      <div class="mt1 list_content">
        {#if !isCategoryView}
          {#if Object.keys(list?.todos).length === 0}
            <pre class="status">{$t('page.todos.list.emptyList')}</pre>
          {:else}
            {#each list?.todos || [] as todo (todo.id)}
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
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    padding: 0;
  }

  section {
    flex-direction: column;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .list_area {
    width: 75%;

    @media #{$tablet} {
      width: 100%;
    }

    @media #{$phone} {
      width: 100%;
    }
  }

  .list_header {
    margin: 0;
  }

  .list_content {
    display: flex;
    flex-direction: column;

    @media #{$tablet} {
      height: 65vh;
    }

    @media #{$phone} {
      height: 40vh;
    }
  }

  .history_categories_container {
    display: flex;
    gap: 1rem;
    width: 100%;

    @media #{$phone} {
      flex-direction: column;
      gap: 0;
    }
  }

  .history_area {
    display: flex;
    flex-direction: column;
    flex: 1;

    @media #{$phone} {
      width: 100%;
    }
  }

  .categories_area {
    display: flex;
    flex-direction: column;
    flex: 1;

    @media #{$phone} {
      width: 100%;
    }
  }

  hr {
    width: 100%;
  }

  .view-toggle-container {
    margin: 1rem 0;
    display: flex;
    justify-content: flex-end;
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

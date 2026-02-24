<script lang="ts">
  // 1. IMPORTS
  import { onMount } from 'svelte';
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import type { Todo } from '$lib/types/todo';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import TodoComponent from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';
  import Toggle from 'carbon-components-svelte/src/Toggle/Toggle.svelte';

  // 2. PROPS
  let { listId }: { listId: string } = $props();

  // 3. STATE
  let viewMode = $state('classic'); // 'classic' or 'byCategory'
  let isCategoryView = $derived.by(() => viewMode === 'byCategory');

  // 5. DERIVED
  let list = $derived.by(() => {
    const allLists = $todoStore;
    const foundList = listId ? allLists.find((l) => l.id === listId) : undefined;

    if (foundList) {
      // Sort todos: unchecked first, checked last
      // Also ensure backwards compatibility: add amount and category if missing
      const sortedTodos = [...foundList.todos]
        .map((todo) => ({
          ...todo,
          amount: todo.amount || '1x',
          category: todo.category || 'Uncategorized',
        }))
        .sort((a, b) => {
          if (a.done === b.done) return 0;
          return a.done ? 1 : -1;
        });

      return {
        ...foundList,
        todos: sortedTodos,
      };
    }

    return undefined;
  });

  // 6. DERIVED - Categorized view
  let categorizedTodos = $derived.by(() => {
    if (!list || !isCategoryView) return {};
    
    const categories: Record<string, Todo[]> = {};
    
    // Group by category, but separate done and undone items
    const undoneTodos = list.todos.filter(todo => !todo.done);
    const doneTodos = list.todos.filter(todo => todo.done);
    
    // Group undone todos by category
    undoneTodos.forEach(todo => {
      const category = todo.category || 'Uncategorized';
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
      renameTodo(e.detail.id, e.detail.title, e.detail.amount, e.detail.category);
    }) as EventListener);
  });

  const toggleViewMode = (event) => {
    viewMode = event.detail.toggled ? 'byCategory' : 'classic';
  };

  // 8. FUNCTIONS
  const renameTodo = (todoId: string, newTitle: string, newAmount: string, newCategory?: string) => {
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
                    category: newCategory !== undefined ? newCategory : todo.category
                  }
                : todo,
            ),
          };
        }
        return list;
      });
    });
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
  };
  const selectRandomTagColor = ():
    | 'red'
    | 'magenta'
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'gray'
    | 'cool-gray'
    | 'warm-gray'
    | 'high-contrast'
    | 'outline' => {
    const colors: (
      | 'red'
      | 'magenta'
      | 'purple'
      | 'blue'
      | 'cyan'
      | 'teal'
      | 'green'
      | 'gray'
      | 'cool-gray'
      | 'warm-gray'
      | 'high-contrast'
      | 'outline'
    )[] = [
      'red',
      'magenta',
      'purple',
      'blue',
      'cyan',
      'teal',
      'green',
      'gray',
      'cool-gray',
      'warm-gray',
      'high-contrast',
      'outline',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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
              },
            ],
          };
        }
        return list;
      });
    });
  };
</script>

{#if $initialized}
  <section>
    <div class="mt2 list_area">
      <div class="list_header">
        <h2>
          {list?.emoji || $t('page.todos.list.noEmoji')}
          {list?.name || $t('page.todos.list.noEmoji')}
        </h2>
        <hr />
        <div class="history_area">
          <Accordion>
            <AccordionItem
              title={$t('page.todos.list.history')}
              class="custom_accordion_content"
            >
              {#if list?.history?.length > 0}
                <div class="history_list">
                  <div class="history_entry_list">
                    {#each list.history as entry (entry)}
                      <div class="history_tag_wrapper">
                        <button
                          onclick={() => readdTodoFromHistory(entry)}
                          class="history_tag"
                        >
                          {entry}
                        </button>
                        <button
                          onclick={(e) => {
                            e.stopPropagation();
                            removeEntryFromHistory(entry);
                          }}
                          class="history_delete_btn"
                          title="Remove from history"
                        >
                          ✕
                        </button>
                      </div>
                    {/each}
                  </div>
                  <Button
                    kind="danger"
                    size="small"
                    iconDescription={$t('page.todos.deleteHistroy')}
                    tooltipAlignment="end"
                    icon={TrashCan}
                    on:click={clearHistory}
                    class="history_delete_button"
                  />
                </div>
              {:else}
                <pre class="status">{$t('page.todos.list.historyEmpty')}</pre>
              {/if}
            </AccordionItem>
          </Accordion>
        </div>
        <div class="view-toggle-container">
          <Toggle
            bind:toggled={isCategoryView}
            labelA={$t('page.todos.view.classic')}
            labelB={$t('page.todos.view.byCategory')}
            on:change={toggleViewMode}
            size="sm"
          />
        </div>
        <TodoInput {listId} />
      </div>

      <div class="mt1 list_content">
        {#if !isCategoryView}
          {#each list?.todos || [] as todo (todo.id)}
            <TodoComponent
              id={todo.id}
              title={todo.title}
              done={todo.done}
              amount={todo.amount}
              category={todo.category}
              deleteTodo={() => deleteTodo(todo.id)}
              todoChecked={() => checkTodo(todo.id)}
            />
          {/each}
        {:else}
          {#each Object.entries(categorizedTodos) as [category, todos]}
            <div class="category-section">
              <h3 class="category-header">
                {category === 'Done' ? $t('page.todos.doneCategory') : category}
              </h3>
              {#each todos as todo (todo.id)}
                <TodoComponent
                  id={todo.id}
                  title={todo.title}
                  done={todo.done}
                  amount={todo.amount}
                  category={todo.category}
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

  .history_area {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .history_list {
    display: flex;
    align-items: start;
    justify-content: space-between;
    width: 100%;
  }

  .history_entry_list {
    display: flex;
    flex-wrap: wrap;
  }

  hr {
    width: 100%;
  }

  .history_tag_wrapper {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0.25rem;
    background: #393939;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background: #525252;
    }
  }

  .history_tag {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    font-size: 0.875rem;
  }

  .history_delete_btn {
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.2s ease;

    &:hover {
      color: #da1e28;
    }
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

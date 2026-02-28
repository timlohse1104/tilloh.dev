<script lang="ts">
  // 1. IMPORTS
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { onMount } from 'svelte';

  // 2. PROPS
  let {
    listId,
    categories,
    onTodoAdded,
  }: { listId: string; categories: string[]; onTodoAdded?: () => void } = $props();

  // 4. STATE
  let newTodoName = $state('');
  let newTodoAmount = $state('1x');
  let newTodoCategory = $state('');

  // 5. DERIVED
  let categoryAutocomplete = $derived.by(() => {
    if (!newTodoCategory || newTodoCategory.length === 0) return null;

    const matches = categories.filter((cat) =>
      cat.toLowerCase().startsWith(newTodoCategory.toLowerCase()),
    );

    return matches.length > 0 ? matches[0] : null;
  });

  // 7. LIFECYCLE
  onMount(() => {
    // Listen for category selection from category history
    const handleCategorySelected = ((e: CustomEvent) => {
      const activeElement = document.activeElement as HTMLInputElement;

      // Check if the focused element is inside this component's category input wrapper
      const wrapper = activeElement?.closest('[data-category-input="new-todo"]');

      if (wrapper) {
        newTodoCategory = e.detail.category;
      }
    }) as EventListener;

    window.addEventListener('category-selected', handleCategorySelected);

    return () => {
      window.removeEventListener('category-selected', handleCategorySelected);
    };
  });

  // 8. FUNCTIONS
  const autocompleteCategory = () => {
    if (!newTodoCategory) return;

    const matches = categories.filter((cat) =>
      cat.toLowerCase().startsWith(newTodoCategory.toLowerCase()),
    );

    if (matches.length > 0) {
      newTodoCategory = matches[0];
    }
  };

  const handleCategoryKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      autocompleteCategory();
    } else if (e.key === 'Enter') {
      saveTodo();
    }
  };

  const saveTodo = () => {
    if (newTodoName) {
      todoStore.update((todoListArray) => {
        return todoListArray.map((list) => {
          if (list.id === listId) {
            const currentCategories = list.categories || [];
            const updatedCategories =
              newTodoCategory && !currentCategories.includes(newTodoCategory)
                ? [...currentCategories, newTodoCategory]
                : currentCategories;

            return {
              ...list,
              todos: [
                ...list.todos,
                {
                  id: crypto.randomUUID(),
                  title: newTodoName,
                  done: false,
                  amount: newTodoAmount || '1x',
                  category: newTodoCategory || '',
                },
              ],
              history: Array.from(new Set([...list.history, newTodoName])),
              categories: updatedCategories,
            };
          }
          return list;
        });
      });
      newTodoName = '';
      newTodoAmount = '1x';
      newTodoCategory = '';
    }
    if (onTodoAdded) {
      onTodoAdded();
    }
  };
</script>

{#if $initialized}
  <section class="todo-input-container">
    <div class="input-row">
      <div class="todo-amount-input">
        <TextInput
          bind:value={newTodoAmount}
          placeholder={$t('page.todos.amount')}
          labelText={$t('page.todos.amount')}
          on:keydown={(e) => e.key === 'Enter' && saveTodo()}
        />
      </div>
      <TextInput
        bind:value={newTodoName}
        placeholder={$t('page.todos.newTodo')}
        labelText={$t('page.todos.newTodo')}
        on:keydown={(e) => e.key === 'Enter' && saveTodo()}
      />
      <div class="category-input-wrapper" data-category-input="new-todo">
        <TextInput
          bind:value={newTodoCategory}
          placeholder={$t('page.todos.categoryPlaceholder')}
          labelText={$t('page.todos.category')}
          on:keydown={handleCategoryKeydown}
        />
        {#if categoryAutocomplete && categoryAutocomplete !== newTodoCategory}
          <div class="autocomplete-hint">
            <kbd>Tab</kbd> → {categoryAutocomplete}
          </div>
        {/if}
      </div>
      <Button
        kind="primary"
        size="field"
        iconDescription={$t('page.todos.addTodo')}
        tooltipAlignment="end"
        icon={Add}
        on:click={saveTodo}
        class="add-button"
      />
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .todo-input-container {
    width: 100%;
    margin-top: 1rem;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .todo-amount-input {
    flex: 1;
  }

  .category-input-wrapper {
    position: relative;
    flex: 1;
  }

  .autocomplete-hint {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
  }

  .autocomplete-hint kbd {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    font-size: 0.7rem;
    font-family: monospace;
    font-weight: 600;
    margin-right: 0.25rem;
  }

</style>

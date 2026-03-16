<script lang="ts">
  // 1. IMPORTS
  import { todoStore } from '$lib/util/stores/store-todo';
  import { displayCategory, normalizeCategory } from '$lib/util/helper';
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
      const context = e.detail.context;
      const activeElement = document.activeElement as HTMLInputElement;
      const wrapper = activeElement?.closest('[data-category-input="new-todo"]');

      if (context === 'new-todo' || wrapper) {
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
      const normalizedCategory = normalizeCategory(newTodoCategory);
      todoStore.update((todoListArray) => {
        return todoListArray.map((list) => {
          if (list.id === listId) {
            const currentCategories = list.categories || [];
            const updatedCategories =
              normalizedCategory && !currentCategories.includes(normalizedCategory)
                ? [...currentCategories, normalizedCategory]
                : currentCategories;

            return {
              ...list,
              todos: [
                ...list.todos,
                {
                  id: crypto.randomUUID(),
                  title: newTodoName,
                  done: false,
                  category: normalizedCategory,
                },
              ],
              categories: updatedCategories,
            };
          }
          return list;
        });
      });
      newTodoName = '';
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
      <div class="title-input-wrapper">
        <TextInput
          bind:value={newTodoName}
          placeholder={$t('page.todos.newTodo')}
          labelText={$t('page.todos.newTodo')}
          on:keydown={(e) => e.key === 'Enter' && saveTodo()}
        />
      </div>
      <div class="category-input-wrapper" data-category-input="new-todo">
        <TextInput
          bind:value={newTodoCategory}
          placeholder={$t('page.todos.categoryPlaceholder')}
          labelText={$t('page.todos.category')}
          on:keydown={handleCategoryKeydown}
        />
        {#if categoryAutocomplete && categoryAutocomplete !== newTodoCategory}
          <div class="autocomplete-hint">
            <kbd>Tab</kbd> → {displayCategory(categoryAutocomplete)}
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
  @use '../../styles/variables.scss' as *;

  .todo-input-container {
    width: 100%;
    margin-top: 1rem;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;

    @media #{$phone} {
      flex-wrap: wrap;
    }
  }

  .title-input-wrapper {
    flex: 1;
    min-width: 0;

    @media #{$phone} {
      flex: 1 1 100%;
    }
  }

  .category-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 0;

    @media #{$phone} {
      flex: 1 1 100%;
    }
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

    @media #{$phone} {
      display: none;
    }
  }

  .autocomplete-hint kbd {
    display: inline-block;
    padding: 0.125rem 0.375rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    font-size: 0.7rem;
    font-family: var(--font-mono);
    font-weight: 600;
    margin-right: 0.25rem;
  }

</style>

<script lang="ts">
  // 1. IMPORTS
  import { t } from '$lib/util/translations';
  import { displayCategory, normalizeCategory } from '$lib/util/helper';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import ContextMenu from 'carbon-components-svelte/src/ContextMenu/ContextMenu.svelte';
  import ContextMenuOption from 'carbon-components-svelte/src/ContextMenu/ContextMenuOption.svelte';
  import Close from 'carbon-icons-svelte/lib/Close.svelte';
  import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
  import Save from 'carbon-icons-svelte/lib/Save.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

  // 2. PROPS
  let {
    id,
    title,
    done,
    category,
    categories,
    deleteTodo,
    todoChecked,
  }: {
    id: string;
    title: string;
    done?: boolean;
    category?: string;
    categories: string[];
    deleteTodo: () => void;
    todoChecked: () => void;
  } = $props();

  // 4. STATE
  let isRenaming = $state(false);
  let newTitle = $state('');
  let newCategory = $state('');
  let todoObject: HTMLElement | undefined = $state(undefined);

  // 5. DERIVED
  let todoTitle = $derived(title);
  let todoCategory = $derived(category || '');
  let isDone = $derived(done);

  let categoryAutocomplete = $derived.by(() => {
    if (!newCategory || newCategory.length === 0 || !isRenaming) return null;

    const matches = categories.filter((cat) =>
      cat.toLowerCase().startsWith(newCategory.toLowerCase()),
    );

    return matches.length > 0 ? matches[0] : null;
  });

  // 8. FUNCTIONS
  const autocompleteCategory = () => {
    if (!newCategory) return;

    const matches = categories.filter((cat) =>
      cat.toLowerCase().startsWith(newCategory.toLowerCase()),
    );

    if (matches.length > 0) {
      newCategory = matches[0];
    }
  };

  const handleCategoryKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      autocompleteCategory();
    } else if (e.key === 'Enter') {
      e.stopPropagation();
      saveEdit();
    }
  };

  const startEdit = () => {
    newTitle = todoTitle;
    newCategory = todoCategory;
    isRenaming = true;
  };

  const saveEdit = () => {
    if (newTitle.trim()) {
      // Emit rename event to parent
      const event = new CustomEvent('rename', {
        detail: {
          id: id,
          title: newTitle,
          category: normalizeCategory(newCategory),
        },
      });
      window.dispatchEvent(event);
    }
    isRenaming = false;
  };

  const cancelEdit = () => {
    isRenaming = false;
    newTitle = '';
    newCategory = '';
  };

  // 7. LIFECYCLE
  $effect(() => {
    // Listen for category selection from category history
    const handleCategorySelected = ((e: CustomEvent) => {
      const context = e.detail.context;
      const activeElement = document.activeElement as HTMLInputElement;
      const wrapper = activeElement?.closest('[data-category-input="edit-todo"]');

      if (isRenaming && (context === 'edit-todo' || wrapper)) {
        newCategory = e.detail.category;
      }
    }) as EventListener;

    window.addEventListener('category-selected', handleCategorySelected);

    return () => {
      window.removeEventListener('category-selected', handleCategorySelected);
    };
  });

  $effect(() => {
    if (isRenaming) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cancelEdit();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  });
</script>

<section
  bind:this={todoObject}
  onclick={isRenaming ? undefined : todoChecked}
  role="button"
  tabindex="0"
  onkeydown={(e) => !isRenaming && e.key === 'Enter' && todoChecked()}
>
  {#if isRenaming}
    <div class="edit-container">
      <input
        type="text"
        bind:value={newTitle}
        placeholder="Title"
        class="title-input"
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            saveEdit();
          }
        }}
      />
      <div class="category-input-wrapper" data-category-input="edit-todo">
        <input
          type="text"
          bind:value={newCategory}
          placeholder={$t('page.todos.categoryPlaceholder')}
          class="category-input"
          onkeydown={handleCategoryKeydown}
        />
        {#if categoryAutocomplete && categoryAutocomplete !== newCategory}
          <div class="autocomplete-hint">
            <kbd>Tab</kbd> → {displayCategory(categoryAutocomplete)}
          </div>
        {/if}
      </div>
      <Button
        kind="primary"
        size="small"
        on:click={saveEdit}
        class="save-btn"
        icon={Save}
        iconDescription="Save"
      />
      <Button
        kind="tertiary"
        size="small"
        on:click={cancelEdit}
        class="cancel-btn"
        icon={Close}
        iconDescription="Cancel"
      />
    </div>
  {:else}
    <div class="checkbox-wrapper">
      <Checkbox checked={isDone} readonly />
      <span class={isDone ? 'striked todo-label' : 'todo-label'}>
        {todoTitle}
      </span>
    </div>
  {/if}
  <div
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()}
    role="button"
    tabindex="-1"
    style="display: contents;"
  >
    <Button
      kind="danger"
      size="small"
      iconDescription={$t('page.todos.deleteTodo')}
      tooltipAlignment="end"
      icon={TrashCan}
      onclick={deleteTodo}
    />
  </div>
</section>

<ContextMenu target={todoObject ? [todoObject] : []}>
  <ContextMenuOption
    indented
    labelText={$t('page.todos.editTodo')}
    icon={Edit}
    on:click={startEdit}
  />
</ContextMenu>

<style lang="scss">
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition:
      background-color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
    background-color: transparent;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }

  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .checkbox-wrapper :global(.bx--checkbox-wrapper) {
    margin: 0;
    flex-shrink: 0;
    pointer-events: none;
  }

  .todo-label {
    user-select: none;
    font-weight: 600;
  }

  .striked {
    text-decoration: line-through;
    opacity: 0.6;
    font-weight: 100;
  }

  .edit-container {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    flex: 1;
  }

  .title-input {
    flex: 2;
  }

  .category-input-wrapper {
    position: relative;
    flex: 1;
  }

  .category-input {
    width: 100%;
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

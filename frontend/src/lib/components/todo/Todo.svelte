<script lang="ts">
  // 1. IMPORTS
  import { t } from '$lib/util/translations';
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
    amount,
    category,
    categories,
    deleteTodo,
    todoChecked,
  }: {
    id: string;
    title: string;
    done?: boolean;
    amount?: string;
    category?: string;
    categories: string[];
    deleteTodo: () => void;
    todoChecked: () => void;
  } = $props();

  // 4. STATE
  let isRenaming = $state(false);
  let newTitle = $state('');
  let newAmount = $state('');
  let newCategory = $state('');
  let todoObject: HTMLElement | undefined = $state(undefined);

  // 5. DERIVED
  let todoTitle = $derived(title);
  let todoAmount = $derived(amount || '1x');
  let todoCategory = $derived(category || '');
  let isDone = $derived(done);

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
    newAmount = todoAmount;
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
          amount: newAmount,
          category: newCategory,
        },
      });
      window.dispatchEvent(event);
    }
    isRenaming = false;
  };

  const cancelEdit = () => {
    isRenaming = false;
    newTitle = '';
    newAmount = '';
    newCategory = '';
  };

  // 7. LIFECYCLE
  $effect(() => {
    if (isRenaming) {
      const handleKeyDown = (e) => {
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
        bind:value={newAmount}
        placeholder={$t('page.todos.amount')}
        maxlength="10"
        class="amount-input"
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            saveEdit();
          }
        }}
      />
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
      <input
        type="text"
        bind:value={newCategory}
        placeholder={$t('page.todos.categoryPlaceholder')}
        class="category-input"
        onkeydown={handleCategoryKeydown}
      />
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
    <label class="checkbox-wrapper">
      <input
        type="checkbox"
        checked={isDone}
        onchange={todoChecked}
        class="hidden-checkbox"
      />
      <Checkbox checked={isDone} readonly />
      <span class="amount-label">{todoAmount}</span>
      <span class={isDone ? 'striked todo-label' : 'todo-label'}>
        {todoTitle}
      </span>
    </label>
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

  .hidden-checkbox {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
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

  .amount-label {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    margin-right: 0.5rem;
    min-width: 3rem;
    text-align: right;
  }

  .edit-container {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
    flex: 1;
  }

  .amount-input {
    flex: 0 0 6rem;
  }

  .title-input {
    flex: 2;
  }

  .category-input {
    flex: 1;
  }

</style>

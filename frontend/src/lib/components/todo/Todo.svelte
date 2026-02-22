<script lang="ts">
  // 1. IMPORTS
  import type { Todo } from '$lib/types/todo.ts';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

  // 2. PROPS
  let {
    todo,
    deleteTodo,
    todoChecked,
  }: {
    todo: Todo;
    deleteTodo: () => void;
    todoChecked: () => void;
  } = $props();

  // 4. STATE
  let showContextMenu = $state(false);
  let contextMenuX = $state(0);
  let contextMenuY = $state(0);
  let isRenaming = $state(false);
  let newTitle = $state('');
  let newAmount = $state('');

  // 5. DERIVED
  let todoTitle = $derived(todo.title);
  let todoAmount = $derived(todo.amount || '1x');
  let isDone = $derived(todo.done);

  // 8. FUNCTIONS
  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    contextMenuX = e.clientX;
    contextMenuY = e.clientY;
    showContextMenu = true;
  };

  const handleLongPress = (e: TouchEvent) => {
    const touch = e.touches[0];
    contextMenuX = touch.clientX;
    contextMenuY = touch.clientY;
    showContextMenu = true;
  };

  const startRename = () => {
    newTitle = todoTitle;
    newAmount = todoAmount;
    isRenaming = true;
    showContextMenu = false;
  };

  const saveRename = () => {
    if (newTitle.trim()) {
      // Emit rename event to parent
      const event = new CustomEvent('rename', {
        detail: { id: todo.id, title: newTitle, amount: newAmount },
      });
      window.dispatchEvent(event);
    }
    isRenaming = false;
  };

  const cancelRename = () => {
    isRenaming = false;
    newTitle = '';
    newAmount = '';
  };
</script>

<section
  onclick={isRenaming ? undefined : todoChecked}
  oncontextmenu={handleContextMenu}
  ontouchstart={handleLongPress}
  role="button"
  tabindex="0"
  onkeydown={(e) => !isRenaming && e.key === 'Enter' && todoChecked()}
>
  {#if isRenaming}
    <div class="rename-container" onclick={(e) => e.stopPropagation()} role="form">
      <input
        type="text"
        bind:value={newAmount}
        placeholder="Amount"
        maxlength="10"
        class="amount-input"
      />
      <input
        type="text"
        bind:value={newTitle}
        placeholder="Title"
        class="title-input"
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            saveRename();
          }
        }}
      />
      <button onclick={saveRename} class="save-btn">✓</button>
      <button onclick={cancelRename} class="cancel-btn">✗</button>
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

{#if showContextMenu}
  <div
    class="context-menu"
    style="left: {contextMenuX}px; top: {contextMenuY}px;"
    role="menu"
  >
    <button onclick={startRename} class="context-menu-item" role="menuitem">
      {$t('page.todos.renameTodo')}
    </button>
  </div>
  <div
    class="context-menu-overlay"
    onclick={() => (showContextMenu = false)}
    onkeydown={(e) => e.key === 'Escape' && (showContextMenu = false)}
    role="button"
    tabindex="-1"
  ></div>
{/if}

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
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
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

  .context-menu {
    position: fixed;
    background: #262626;
    border: 1px solid #393939;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    z-index: 1000;
    overflow: hidden;
  }

  .context-menu-item {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .context-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .rename-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex: 1;
  }

  .amount-input {
    width: 4rem;
    padding: 0.25rem 0.5rem;
    background: #393939;
    border: 1px solid #525252;
    border-radius: 4px;
    color: white;
    font-size: 0.875rem;
  }

  .title-input {
    flex: 1;
    padding: 0.25rem 0.5rem;
    background: #393939;
    border: 1px solid #525252;
    border-radius: 4px;
    color: white;
  }

  .save-btn,
  .cancel-btn {
    padding: 0.25rem 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  .save-btn {
    background: #24a148;
    color: white;

    &:hover {
      background: #198038;
    }
  }

  .cancel-btn {
    background: #da1e28;
    color: white;

    &:hover {
      background: #a2191f;
    }
  }
</style>

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

  // 5. DERIVED
  let todoTitle = $derived(todo.title);
  let isDone = $derived(todo.done);
</script>

<section onclick={todoChecked}>
  <label class="checkbox-wrapper">
    <input
      type="checkbox"
      checked={isDone}
      onchange={todoChecked}
      class="hidden-checkbox"
    />
    <Checkbox checked={isDone} readonly />
    <span class={isDone ? 'striked todo-label' : 'todo-label'}>
      {todoTitle}
    </span>
  </label>
  <div
    onclick={(e) => e.stopPropagation()}
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
</style>

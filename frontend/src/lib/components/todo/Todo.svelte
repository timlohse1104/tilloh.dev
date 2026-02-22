<script lang="ts">
  // 1. IMPORTS
  import type { Todo } from '$lib/types/todo.ts';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Checkbox from 'carbon-components-svelte/src/Checkbox/Checkbox.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

  // 2. PROPS
  export let todo: Todo;
  export let deleteTodo;
  export let todoChecked;
</script>

<section>
  <Checkbox
    bind:checked={todo['done']}
    on:click={todoChecked}
  >
    <span slot="labelText" class={todo?.done ? 'ml1 striked' : 'ml1'}>
      {todo?.title}
    </span>
  </Checkbox>
  <Button
    kind="danger"
    size="small"
    iconDescription={$t('page.todos.deleteTodo')}
    tooltipAlignment="end"
    icon={TrashCan}
    on:click={deleteTodo}
  />
</section>

<style lang="scss">
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .striked {
    text-decoration: line-through;
  }
</style>

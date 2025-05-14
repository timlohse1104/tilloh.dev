<script lang="ts">
  import type { Todo } from '$lib/types/todo.ts';
  import { Button, Checkbox } from 'carbon-components-svelte';
  import { TrashCan } from 'carbon-icons-svelte';

  export let todo: Todo;
  export let deleteTodo;
  export let todoChecked;
</script>

<section>
  <Checkbox
    bind:checked={todo['done']}
    labelText="Label text"
    on:click={todoChecked}
  >
    <span slot="labelText" class={todo?.done ? 'ml1 striked' : 'ml1'}>
      {todo?.title}
    </span>
  </Checkbox>
  <Button
    kind="danger"
    size="small"
    iconDescription="TODO"
    icon={TrashCan}
    on:click={deleteTodo}
  />
</section>

<style>
  section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .striked {
    text-decoration: line-through;
  }
</style>

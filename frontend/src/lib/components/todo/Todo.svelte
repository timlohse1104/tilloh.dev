<script lang="ts">
  import type { Todo } from '$lib/types/todo.ts';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import IconButton, { Icon } from '@smui/icon-button';

  export let todo: Todo;
  export let deleteTodo;
  export let todoChecked;
</script>

<section>
  <div class="todo">
    <FormField>
      <Checkbox bind:checked={todo['done']} on:click={todoChecked} />
      <span slot="label" class={todo?.done ? 'striked' : ''}>{todo?.title}</span
      >
    </FormField>
    <IconButton
      color="secondary"
      style="margin-left: auto;"
      size="button"
      on:click={deleteTodo}
    >
      <Icon class="material-icons">delete</Icon>
    </IconButton>
  </div>
</section>

<style>
  .todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .striked {
    text-decoration: line-through;
  }
</style>

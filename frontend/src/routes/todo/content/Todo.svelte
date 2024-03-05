<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import IconButton, { Icon } from '@smui/icon-button';
  import { todoStore } from '../util/stores.ts';

  export let listIndex: number;
  export let todoIndex: number;
  export let deleteTodo;

  $: currentTodo = $todoStore[listIndex].todos[todoIndex];
</script>

<section>
  <div class="todo">
    <FormField>
      <Checkbox bind:checked={currentTodo['done']} />
      <span slot="label" class={currentTodo?.done ? 'striked' : ''}
        >{currentTodo?.title}</span
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

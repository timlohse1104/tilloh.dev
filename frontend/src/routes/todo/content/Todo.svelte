<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import IconButton, { Icon } from '@smui/icon-button';
  import { todoStore } from '../util/stores.ts';

  export let listIndex: number;
  export let todoIndex: number;
  export let deleteTodo;
</script>

<section>
  <div class="todo">
    <FormField>
      <Checkbox bind:checked={$todoStore[listIndex].todos[todoIndex].done} />
      <span
        slot="label"
        class={$todoStore[listIndex].todos[todoIndex].done ? 'striked' : ''}
        >{$todoStore[listIndex].todos[todoIndex].title}</span
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

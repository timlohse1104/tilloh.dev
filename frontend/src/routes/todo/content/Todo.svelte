<script>
  import Button from '@smui/button';
  export let todo;
  export let deleteTodo;
</script>

<div class="todo">
  <p class="todo-text">{todo.title}</p>
  <Button class="delete-todo" on:click={deleteTodo} variant="raised"
    >Löschen</Button
  >
</div>

<style>
  .todo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .todo-text {
    margin-right: var(--default-padding);
  }
</style>

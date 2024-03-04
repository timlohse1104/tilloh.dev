<script lang="ts">
  import { todoStore } from '../util/stores.ts';
  import Task from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';

  export let listIndex;

  $: currentList = $todoStore[listIndex] || $todoStore[0];

  function deleteTodo(index) {
    todoStore.update((list) => {
      list[listIndex].todos.splice(index, 1);
      return list;
    });
  }
</script>

<section class="todo-list">
  <h2>
    {currentList?.emoji || '📝'}
    {currentList?.name || 'Hier würde der Listenname stehen...'}
  </h2>
  <hr />
  <br />
  <pre class="status">History: {currentList?.history ||
      'Hier würde der Verlauf stehen...'}</pre>

  {#if !currentList}
    <p style="margin-top:2rem;">Hier ist später Platz für viele Einträge...</p>
  {:else}
    <TodoInput {listIndex} />
    {#if currentList?.todos?.length === 0}
      <p style="margin-top:2rem;">Bisher ziemlich leer hier...</p>
    {:else}
      {#each currentList?.todos as todo, i (i)}
        <Task {todo} deleteTodo={() => deleteTodo(i)} />
      {/each}
    {/if}
  {/if}
</section>

<style lang="scss">
  .todo-list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }

  hr {
    width: 100%;
  }
</style>

<script lang="ts">
  import IconButton, { Icon } from '@smui/icon-button';
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

  function clearHistory() {
    todoStore.update((list) => {
      list[listIndex].history = [];
      return list;
    });
  }
</script>

<section
  class="todo-list"
  style="overflow:hidden;display:flex;align-items:center;"
>
  <div class="todo-list-area">
    <h2>
      {currentList?.emoji || '📝'}
      {currentList?.name || 'Hier würde der Listenname stehen...'}
    </h2>
    <hr />
    <br />
    <div class="history-area">
      Verlauf:
      {#if currentList?.history?.length > 0}
        <div class="history-list">
          <pre class="status">{currentList?.history}</pre>
          <IconButton
            color="secondary"
            style="margin-left: auto;"
            size="button"
            on:click={clearHistory}
          >
            <Icon class="material-icons">delete</Icon>
          </IconButton>
        </div>
      {:else if !currentList?.history}
        <pre class="status">Hier würde der Verlauf stehen...</pre>
      {:else}
        <pre class="status">Kein Verlauf vorhanden...</pre>
      {/if}
    </div>

    {#if !currentList}
      <p style="margin-top:2rem;">
        Hier ist später Platz für viele Einträge...
      </p>
    {:else}
      <div>
        <TodoInput {listIndex} />
      </div>
      {#if currentList?.todos?.length === 0}
        <p style="margin-top:2rem;">Bisher ziemlich leer hier...</p>
      {:else}
        {#each currentList?.todos as todo, i (i)}
          <Task {listIndex} todoIndex={i} deleteTodo={() => deleteTodo(i)} />
        {/each}
      {/if}
    {/if}
  </div>
</section>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  .todo-list {
    display: flex;
    flex-direction: column;
  }

  .todo-list-area {
    width: 50%;

    @media #{$tablet} {
      width: 75%;
    }

    @media #{$phone} {
      width: 80%;
      margin-top: 2rem;
    }
  }

  .history-area {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
  }

  .history-list {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  hr {
    width: 100%;
  }
</style>

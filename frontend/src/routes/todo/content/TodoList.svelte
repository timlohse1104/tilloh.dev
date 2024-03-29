<script lang="ts">
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import { todoStore } from '../util/stores.ts';
  import Todo from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';

  export let listIndex;

  $: currentList = $todoStore[listIndex] || $todoStore[0];

  function deleteTodo(index) {
    todoStore.update((list) => {
      list[listIndex].todos.splice(index, 1);
      return list;
    });
  }
  function checkTodo(index) {
    todoStore.update((list) => {
      list[listIndex].todos[index].done = !list[listIndex].todos[index].done;
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
  <div class="list-area">
    <div class="list-header">
      <h2>
        {currentList?.emoji || '📝'}
        {currentList?.name || 'Hier würde der Listenname stehen...'}
      </h2>
      <hr />
      <div class="history-area">
        {#if currentList?.history?.length > 0}
          <div class="history-list">
            <Wrapper>
              <Button color="secondary" variant="outlined">
                <Icon class="material-icons">info</Icon>
                <Label>Verlauf</Label>
                <Tooltip xPos="end" yPos="detected">
                  {currentList?.history}
                </Tooltip>
              </Button>
            </Wrapper>
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
      <TodoInput {listIndex} />
    </div>

    <div class="list-content">
      {#if !currentList}
        <p style="margin-top:2rem;">
          Hier ist später Platz für viele Einträge...
        </p>
      {:else if currentList?.todos?.length === 0}
        <p style="margin-top:2rem;">Bisher ziemlich leer hier...</p>
      {:else}
        {#each currentList?.todos as todo, i (i)}
          {#if todo}
            <Todo
              {todo}
              deleteTodo={() => deleteTodo(i)}
              todoChecked={() => checkTodo(i)}
            />
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  section {
    padding: 0;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
  }

  .list-area {
    width: 50%;

    @media #{$tablet} {
      width: 75%;
    }

    @media #{$phone} {
      width: 80%;
    }
  }

  .list-header {
    margin: 0;
  }

  .list-content {
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--default-padding) * 2);
    height: 75vh;
    overflow-y: auto;

    @media #{$tablet} {
      height: 65vh;
    }

    @media #{$phone} {
      height: 40vh;
    }
  }

  .history-area {
    display: flex;
    flex-direction: column;
  }

  .history-list {
    display: flex;
    align-items: center;
    margin-top: var(--default-padding);
  }

  hr {
    width: 100%;
  }
</style>

<script lang="ts">
  import { todoStore } from '$lib/util/stores.ts';
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import Todo from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';

  export let listIndex;

  $: currentList = $todoStore[listIndex] || $todoStore[0];

  const deleteTodo = (index) => {
    todoStore.update((list) => {
      list[listIndex].todos.splice(index, 1);
      return list;
    });
  };
  const checkTodo = (index) => {
    todoStore.update((list) => {
      list[listIndex].todos[index].done = !list[listIndex].todos[index].done;
      return list;
    });
  };

  const clearHistory = () => {
    todoStore.update((list) => {
      list[listIndex].history = [];
      return list;
    });
  };
</script>

{#if $initialized}
  <section
    class="todo_list"
    style="overflow:hidden;display:flex;align-items:center;"
  >
    <div class="list_area">
      {#if currentList || currentList?.todos?.length > 0}
        <div class="list_header">
          <h2>
            {currentList?.emoji || $t('page.todos.list.noEmoji')}
            {currentList?.name || $t('page.todos.list.noEmoji')}
          </h2>
          <hr />
          <div class="history_area">
            {#if currentList?.history?.length > 0}
              <div class="history_list">
                <Wrapper>
                  <Button color="secondary" variant="outlined">
                    <Icon class="material-icons">info</Icon>
                    <Label>{$t('page.todos.list.history')}</Label>
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
            {:else}
              <pre class="status">{$t('page.todos.list.historyEmpty')}</pre>
            {/if}
          </div>
          <TodoInput {listIndex} />
        </div>
      {/if}

      <div class="list_content">
        {#if !currentList}
          <h1 style="margin-top:2rem;">
            {$t('page.todos.list.emptyTitle1')}
            <Icon class="material-icons">list</Icon>
            {$t('page.todos.list.emptyTitle2')}
          </h1>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p style="margin-top:2rem;">
              {$t('page.todos.list.emptySubtitle')}
              <Icon class="material-icons">menu</Icon>
            </p>
          </div>
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
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @import '../../styles/variables.scss';

  section {
    padding: 0;
  }

  .todo_list {
    display: flex;
    flex-direction: column;
  }

  .list_area {
    width: 50%;

    @media #{$tablet} {
      width: 75%;
    }

    @media #{$phone} {
      width: 80%;
    }
  }

  .list_header {
    margin: 0;
  }

  .list_content {
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

  .history_area {
    display: flex;
    flex-direction: column;
  }

  .history_list {
    display: flex;
    align-items: center;
    margin-top: var(--default-padding);
  }

  hr {
    width: 100%;
  }
</style>

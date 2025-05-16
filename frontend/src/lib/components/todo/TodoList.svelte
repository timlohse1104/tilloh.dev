<script lang="ts">
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import List from 'carbon-icons-svelte/lib/List.svelte';
  import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
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
  const selectRandomTagColor = ():
    | 'red'
    | 'magenta'
    | 'purple'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'green'
    | 'gray'
    | 'cool-gray'
    | 'warm-gray'
    | 'high-contrast'
    | 'outline' => {
    const colors: (
      | 'red'
      | 'magenta'
      | 'purple'
      | 'blue'
      | 'cyan'
      | 'teal'
      | 'green'
      | 'gray'
      | 'cool-gray'
      | 'warm-gray'
      | 'high-contrast'
      | 'outline'
    )[] = [
      'red',
      'magenta',
      'purple',
      'blue',
      'cyan',
      'teal',
      'green',
      'gray',
      'cool-gray',
      'warm-gray',
      'high-contrast',
      'outline',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const removeEntryFromHistory = (event) => {
    const tagText =
      event.explicitOriginalTarget.parentElement.parentElement.textContent.trim() ||
      '';

    if (!tagText) return;

    todoStore.update((list) => {
      list[listIndex].history = list[listIndex].history.filter((entry) => {
        return entry !== tagText;
      });
      return list;
    });
  };
  const readdTodoFromHistory = (event) => {
    const tagText = event.target.textContent.trim() || '';

    if (!tagText) return;

    todoStore.update((n) => {
      n[listIndex].todos.push({ title: tagText, done: false });
      return [...n];
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
              <h4 class="mt1">{$t('page.todos.list.history')}</h4>
              <div class="history_list">
                <div class="history_entry_list">
                  {#each currentList?.history as entry}
                    <Tag
                      filter
                      interactive
                      type={selectRandomTagColor()}
                      on:close={removeEntryFromHistory}
                    >
                      <button
                        on:click={readdTodoFromHistory}
                        class="tag_button"
                      >
                        {entry}
                      </button>
                    </Tag>
                  {/each}
                </div>
                <Button
                  kind="danger"
                  size="small"
                  iconDescription={$t('page.todos.deleteHistroy')}
                  tooltipAlignment="end"
                  icon={TrashCan}
                  on:click={clearHistory}
                />
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
            <List />
            {$t('page.todos.list.emptyTitle2')}
          </h1>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p style="margin-top:2rem;">
              {$t('page.todos.list.emptySubtitle')}
              <Menu />
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
  @use '../../styles/variables.scss' as *;

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
    margin-top: calc(var(--default_padding) * 2);
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
    justify-content: space-between;
  }

  .history_entry_list {
    display: flex;
  }

  .tag_button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: inherit;
    text-decoration: none;
    display: inline;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  hr {
    width: 100%;
  }
</style>

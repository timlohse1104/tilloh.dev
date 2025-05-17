<script lang="ts">
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Accordion from 'carbon-components-svelte/src/Accordion/Accordion.svelte';
  import AccordionItem from 'carbon-components-svelte/src/Accordion/AccordionItem.svelte';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Tag from 'carbon-components-svelte/src/Tag/Tag.svelte';
  import List from 'carbon-icons-svelte/lib/List.svelte';
  import Menu from 'carbon-icons-svelte/lib/Menu.svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import { onMount } from 'svelte';
  import Todo from './Todo.svelte';
  import TodoInput from './TodoInput.svelte';

  export let listId;

  let list;
  $: if (listId) console.log('listId', listId);
  $: if (list) console.log('list', list);

  onMount(() => {
    list = $todoStore.find((list) => list.id === listId);
  });

  const deleteTodo = (index) => {
    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.todos.splice(index, 1);
      return todoListArray;
    });
  };
  const checkTodo = (index) => {
    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.todos[index].done = !list.todos[index].done;
      return todoListArray;
    });
  };
  const clearHistory = () => {
    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.history = [];
      return todoListArray;
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

    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.history = list.history.filter((entry) => {
        return entry !== tagText;
      });
      return todoListArray;
    });
  };
  const readdTodoFromHistory = (event) => {
    const tagText = event.target.textContent.trim() || '';

    if (!tagText) return;

    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.todos.push({ id: crypto.randomUUID(), title: tagText, done: false });
      return [...todoListArray];
    });
  };
</script>

{#if $initialized}
  <section>
    <div class="list_area">
      {#if list?.todos?.length > 0}
        <div class="list_header">
          <h2>
            {list.emoji || $t('page.todos.list.noEmoji')}
            {list.name || $t('page.todos.list.noEmoji')}
          </h2>
          <hr />
          <div class="history_area">
            <Accordion>
              <AccordionItem title={$t('page.todos.list.history')}>
                {#if list?.history?.length > 0}
                  <div class="history_list">
                    <div class="history_entry_list">
                      {#each list.history as entry}
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
              </AccordionItem>
            </Accordion>
          </div>
          <TodoInput {listId} />
        </div>
      {/if}

      <div class="mt1 list_content">
        {#if !list}
          <h1 class="mt2">
            {$t('page.todos.list.emptyTitle1')}
            <List />
            {$t('page.todos.list.emptyTitle2')}
          </h1>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p class="mt2">
              {$t('page.todos.list.emptySubtitle')}
              <Menu />
            </p>
          </div>
        {:else}
          {#each list.todos as todo, i (i)}
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

  section {
    flex-direction: column;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .list_area {
    width: 75%;

    @media #{$tablet} {
      width: 100%;
    }

    @media #{$phone} {
      width: 100%;
    }
  }

  .list_header {
    margin: 0;
  }

  .list_content {
    display: flex;
    flex-direction: column;

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
    align-items: start;
    justify-content: space-between;
  }

  .history_entry_list {
    display: flex;
    flex-wrap: wrap;
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

<script lang="ts">
  // 1. IMPORTS
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import TextInput from 'carbon-components-svelte/src/TextInput/TextInput.svelte';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';

  // 2. PROPS
  let { listId, onTodoAdded }: { listId: string; onTodoAdded?: () => void } = $props();

  // 4. STATE
  let newTodoName = $state('');
  let newTodoAmount = $state('1x');
  let newTodoCategory = $state('');

  // 8. FUNCTIONS
  const saveTodo = () => {
    if (newTodoName) {
      todoStore.update((todoListArray) => {
        return todoListArray.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              todos: [
                ...list.todos,
                {
                  id: crypto.randomUUID(),
                  title: newTodoName,
                  done: false,
                  amount: newTodoAmount || '1x',
                  category: newTodoCategory || '',
                },
              ],
              history: Array.from(new Set([...list.history, newTodoName])),
            };
          }
          return list;
        });
      });
      newTodoName = '';
      newTodoAmount = '1x';
      newTodoCategory = '';
    }
    if (onTodoAdded) {
      onTodoAdded();
    }
  };
</script>

{#if $initialized}
  <section class="todo-input-container">
    <div class="input-row">
      <div class="todo-amount-input">
        <TextInput
          bind:value={newTodoAmount}
          placeholder={$t('page.todos.amount')}
          labelText={$t('page.todos.amount')}
          on:keydown={(e) => e.key === 'Enter' && saveTodo()}
        />
      </div>
      <TextInput
        bind:value={newTodoName}
        placeholder={$t('page.todos.newTodo')}
        labelText={$t('page.todos.newTodo')}
        on:keydown={(e) => e.key === 'Enter' && saveTodo()}
      />
      <TextInput
        bind:value={newTodoCategory}
        placeholder={$t('page.todos.categoryPlaceholder')}
        labelText={$t('page.todos.category')}
        on:keydown={(e) => e.key === 'Enter' && saveTodo()}
      />
      <Button
        kind="primary"
        size="field"
        iconDescription={$t('page.todos.addTodo')}
        tooltipAlignment="end"
        icon={Add}
        on:click={saveTodo}
        class="add-button"
      />
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .todo-input-container {
    width: 100%;
    margin-top: 1rem;
  }

  .input-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .todo-amount-input {
    flex: 1;
  }

</style>

<script lang="ts">
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';

  export let listId;

  let newTodoName = '';

  const saveTodo = () => {
    if (newTodoName) {
      todoStore.update((todoListArray) => {
        const list = todoListArray.find((list) => list.id === listId);
        list.todos.push({
          id: crypto.randomUUID(),
          title: newTodoName,
          done: false,
        });
        return [...todoListArray];
      });
      addToHistory(newTodoName);
      newTodoName = '';
    }
  };
  const addToHistory = (todoName) => {
    todoStore.update((todoListArray) => {
      const list = todoListArray.find((list) => list.id === listId);
      list.history = Array.from(new Set(list.history).add(todoName));
      return todoListArray;
    });
  };
</script>

{#if $initialized}
  <section>
    <InputWithButton
      bind:value={newTodoName}
      placeholder="Neuer Eintrag"
      labelText={$t('page.todos.newTodo')}
      iconDescription={$t('page.todos.addTodo')}
      tooltipAlignment="end"
      icon={Add}
      action={saveTodo}
      customClasses="mt1"
    />
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

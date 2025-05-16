<script lang="ts">
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';

  export let listIndex;

  let newTodoName = '';

  const saveTodo = () => {
    if (newTodoName) {
      todoStore.update((n) => {
        n[listIndex].todos.push({ title: newTodoName, done: false });
        return [...n];
      });
      addToHistory(newTodoName);
      newTodoName = '';
    }
  };
  const addToHistory = (todoName) => {
    todoStore.update((n) => {
      n[listIndex].history = Array.from(
        new Set(n[listIndex].history).add(todoName),
      );
      return n;
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

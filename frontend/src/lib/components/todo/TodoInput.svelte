<script lang="ts">
  // 1. IMPORTS
  import { todoStore } from '$lib/util/stores/store-todo';
  import { initialized, t } from '$lib/util/translations';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';

  // 2. PROPS
  let { listId }: { listId: string } = $props();

  // 4. STATE
  let newTodoName = $state('');

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
                  amount: '1x',
                },
              ],
              history: Array.from(new Set([...list.history, newTodoName])),
            };
          }
          return list;
        });
      });
      newTodoName = '';
    }
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

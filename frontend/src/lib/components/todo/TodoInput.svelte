<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { todoStore } from '$lib/util/store-todo.ts';
  import { initialized, t } from '$lib/util/translations';
  import Autocomplete from '@smui-extra/autocomplete';

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
  <Autocomplete
    options={$todoStore[listIndex]?.history || []}
    bind:value={newTodoName}
    bind:text={newTodoName}
    label={$t('page.todos.newTodo')}
    style="margin-top: 1rem; width: 100%;"
    textfield$style="width: 100%;"
    on:SMUIAutocomplete:selected={(event) => {
      newTodoName = event.detail;
      saveTodo();
    }}
    on:SMUIAutocomplete:noMatchesAction={saveTodo}
    on:keyup={(event) => {
      if (isEnter(event)) {
        saveTodo();
      }
    }}
  />
{:else}
  <Autocomplete
    options={$todoStore[listIndex]?.history || []}
    bind:value={newTodoName}
    bind:text={newTodoName}
    label="Locale initializing..."
    style="margin-top: 1rem; width: 100%;"
    textfield$style="width: 100%;"
    on:SMUIAutocomplete:selected={(event) => {
      newTodoName = event.detail;
      saveTodo();
    }}
    on:SMUIAutocomplete:noMatchesAction={saveTodo}
    on:keyup={(event) => {
      if (isEnter(event)) {
        saveTodo();
      }
    }}
  />
{/if}

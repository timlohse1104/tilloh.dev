<script lang="ts">
  import Autocomplete from '@smui-extra/autocomplete';
  import { todoStore } from '../util/stores.ts';

  export let listIndex;

  let newTodoName = '';

  function saveTodo() {
    if (newTodoName) {
      todoStore.update((n) => {
        n[listIndex].todos.push({ title: newTodoName });
        return [...n];
      });
      addToHistory(newTodoName);
      newTodoName = '';
    }
  }

  function addToHistory(todoName) {
    todoStore.update((n) => {
      n[listIndex].history = Array.from(
        new Set(n[listIndex].history).add(todoName),
      );
      return n;
    });
  }
</script>

<Autocomplete
  options={$todoStore[listIndex].history}
  bind:value={newTodoName}
  label="Neuer Eintrag"
  style="margin-top: 1rem; width: 100%"
  on:SMUIAutocomplete:selected={saveTodo}
  on:SMUIAutocomplete:noMatchesAction={saveTodo}
  on:keyup={(event) => {
    if (event['code'] === 'Enter') {
      saveTodo();
    }
  }}
/>

<style lang="scss">
</style>

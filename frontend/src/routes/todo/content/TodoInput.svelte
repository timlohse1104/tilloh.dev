<script lang="ts">
  import Textfield from '@smui/textfield';
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
      n[listIndex].history.push(todoName);
      return n;
    });
  }
</script>

<Textfield
  variant="outlined"
  bind:value={newTodoName}
  label="Neue Aufgabe"
  style="margin-top: 1rem; width: 100%"
  on:keyup={(event) => {
    if (event['code'] === 'Enter') {
      saveTodo();
    }
  }}
/>

<style lang="scss">
</style>

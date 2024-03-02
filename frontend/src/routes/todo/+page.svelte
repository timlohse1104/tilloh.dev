<script>
  import { localTodoStore } from './/util/localStore.js';

  let newTask = '';
  let tasks = localTodoStore('tasks', []);
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<section></section>

<style>
  section {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>

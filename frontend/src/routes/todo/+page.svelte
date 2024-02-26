<script>
  import Fab, { Icon } from '@smui/fab';
  import TextField from '@smui/textfield';
  import localStore from './/util/localStore.js';
  import Task from './content/Task.svelte';

  let newTask = '';
  let tasks = localStore('tasks', []);

  function saveTask() {
    if (newTask) {
      tasks.update((n) => {
        return [...n, newTask];
      });
      newTask = '';
    }
  }

  function deleteTask(index) {
    tasks.update((n) => {
      n.splice(index, 1);
      return n;
    });
  }
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<main>
  <div style="display:flex;">
    <TextField
      bind:value={newTask}
      label="Aufgabe hinzufügen"
      variant="outlined"
      style="flex-grow: 1; margin-right: 1em;"
    />
    <Fab on:click={saveTask}>
      <Icon class="material-icons">add</Icon>
    </Fab>
  </div>
  <h2>Liste</h2>
  <hr />
  {#each $tasks as task, i (i)}
    <Task {task} deleteTask={() => deleteTask(i)} />
  {/each}
</main>

<style>
  main {
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>

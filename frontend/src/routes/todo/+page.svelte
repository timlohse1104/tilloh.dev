<script>
  import Task from './content/Task.svelte';
  import localStore from './util/localStore';

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

  function deleteTask(i) {
    tasks.update((n) => {
      n.splice(i, 1);
      return n;
    });
  }
</script>

<svelte:head>
  <title>Todo</title>
  <meta name="Todo" content="Todo" />
</svelte:head>

<main>
  <h1>Todo List</h1>
  <input
    bind:value={newTask}
    on:keyup={(e) => e.key === 'Enter' && saveTask()}
  />
  <button on:click={saveTask}>Add Task</button>
  <ul>
    {#each $tasks as task, i (i)}
      <Task {task} deleteTask={() => deleteTask(i)} />
    {/each}
  </ul>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  button {
    margin-left: 10px;
  }
</style>

<script lang="ts">
  import Task from './Task.svelte';

  export let localTaskStore;
  let listName = 'Aufgabenliste';
  $: if (localTaskStore) {
    console.log('localTaskStore', localTaskStore);
    listName = 'Aufgabenliste';
  }

  function deleteTask(index) {
    localTaskStore.update((n) => {
      n.splice(index, 1);
      return n;
    });
  }
</script>

<section class="todo-list">
  <h2>{listName}</h2>
  <hr />
  {#each $localTaskStore as task, i (i)}
    <Task {task} deleteTask={() => deleteTask(i)} />
  {/each}
</section>

<style lang="scss">
  .todo-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
</style>

<script>
  export let task;
  export let deleteTask;
</script>

<div class="task">
  <p class="task-text">{task}</p>
  <button class="delete-task" on:click={deleteTask}>Delete</button>
</div>

<style>
  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin: 10px;
    border: 1px solid black;
    border-radius: 15px;
  }

  .delete-task {
    padding: 5px 10px;
    border: none;
    background: red;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }
</style>

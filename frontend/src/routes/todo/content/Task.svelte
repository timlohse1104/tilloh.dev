<script>
  import Button from '@smui/button';
  export let task;
  export let deleteTask;
</script>

<div class="task">
  <p class="task-text">{task}</p>
  <Button class="delete-task" on:click={deleteTask} variant="raised"
    >Löschen</Button
  >
</div>

<style>
  .task {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
</style>

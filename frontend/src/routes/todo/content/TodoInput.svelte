<script lang="ts">
  import Textfield from '@smui/textfield';

  export let localTaskStore;

  let newTask = '';

  function saveTask() {
    if (newTask) {
      localTaskStore.update((n) => {
        return [...n, newTask];
      });
      newTask = '';
    }
  }
</script>

<Textfield
  variant="outlined"
  bind:value={newTask}
  label="Neue Aufgabe"
  style="margin-top: 1rem; width: 100%"
  on:keyup={(event) => {
    if (event['code'] === 'Enter') {
      saveTask();
    }
  }}
/>

<style lang="scss">
</style>

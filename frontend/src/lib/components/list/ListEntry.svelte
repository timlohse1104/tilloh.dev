<script lang="ts">
  import type { ListEntry } from '$lib/types/list';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import IconButton, { Icon } from '@smui/icon-button';

  export let listEntry: ListEntry;
  export let deleteListEntry;
  export let listEntryChecked;
</script>

<section>
  <div class="entry">
    <FormField>
      <Checkbox bind:checked={listEntry['done']} on:click={listEntryChecked} />
      <span slot="label" class={listEntry?.done ? 'striked' : ''}
        >{listEntry?.title}</span
      >
    </FormField>
    <IconButton
      color="secondary"
      style="margin-left: auto;"
      size="button"
      on:click={deleteListEntry}
    >
      <Icon class="material-icons">delete</Icon>
    </IconButton>
  </div>
</section>

<style>
  .entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .striked {
    text-decoration: line-through;
  }
</style>

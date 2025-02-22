<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { listStore } from '$lib/util/stores/store-list';
  import { initialized, t } from '$lib/util/translations';
  import Autocomplete from '@smui-extra/autocomplete';

  export let listIndex;

  let newListEntryName = '';

  const saveListEntry = () => {
    if (newListEntryName) {
      listStore.update((n) => {
        n[listIndex].entries.unshift({ title: newListEntryName, done: false });
        return [...n];
      });
      addToHistory(newListEntryName);
      newListEntryName = '';
    }
  };

  const addToHistory = (listEntryName) => {
    listStore.update((n) => {
      n[listIndex].history = Array.from(
        new Set(n[listIndex].history).add(listEntryName),
      );
      return n;
    });
  };
</script>

{#if $initialized}
  <Autocomplete
    options={$listStore[listIndex]?.history || []}
    bind:value={newListEntryName}
    bind:text={newListEntryName}
    label={$t('page.lists.newEntry')}
    style="margin-top: 1rem; width: 100%;"
    textfield$style="width: 100%;"
    on:SMUIAutocomplete:selected={(event) => {
      newListEntryName = event.detail;
      saveListEntry();
    }}
    on:SMUIAutocomplete:noMatchesAction={saveListEntry}
    on:keyup={(event) => {
      if (isEnter(event)) {
        saveListEntry();
      }
    }}
  />
{:else}
  <Autocomplete
    options={$listStore[listIndex]?.history || []}
    bind:value={newListEntryName}
    bind:text={newListEntryName}
    label="Locale initializing..."
    style="margin-top: 1rem; width: 100%;"
    textfield$style="width: 100%;"
    on:SMUIAutocomplete:selected={(event) => {
      newListEntryName = event.detail;
      saveListEntry();
    }}
    on:SMUIAutocomplete:noMatchesAction={saveListEntry}
    on:keyup={(event) => {
      if (isEnter(event)) {
        saveListEntry();
      }
    }}
  />
{/if}

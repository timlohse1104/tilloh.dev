<script lang="ts">
  import { listStore } from '$lib/util/stores/store-list';
  import { initialized, t } from '$lib/util/translations';
  import { onMount } from 'svelte';
  import CreateListButton from './CreateListButton.svelte';
  import ListEntry from './ListEntry.svelte';
  import ListEntryInput from './ListEntryInput.svelte';

  export let listIndex;

  $: currentList = $listStore[listIndex] || $listStore[0];
  // Sort entries by done status
  $: if (currentList) currentList.entries.sort((a, b) => a.done - b.done);

  const deleteListEntry = (id: string) => {
    const index = currentList.entries.findIndex((e) => e.id === id);
    listStore.update((list) => {
      list[listIndex]?.entries?.splice(index, 1);
      return list;
    });
  };
  const checkListEntry = (id: string) => {
    const index = currentList.entries.findIndex((e) => e.id === id);
    listStore.update((list) => {
      list[listIndex].entries[index].done =
        !list[listIndex]?.entries[index]?.done;
      return list;
    });
  };

  onMount(() => {
    console.log('currentList', currentList);
  });
</script>

{#if $initialized}
  <section
    class="entry_list"
    style="overflow:hidden;display:flex;align-items:center;"
  >
    <div class="list_area">
      <div class="list_header">
        {#if currentList || currentList?.lists?.length > 0}
          <h2>
            {currentList?.emoji || $t('page.lists.list.noEmoji')}
            {currentList?.name || $t('page.lists.list.noEmoji')}
          </h2>
          <ListEntryInput {listIndex} />
        {:else}
          <h1 style="margin-top:2rem;">
            {$t('page.lists.list.emptyTitle')}
          </h1>
        {/if}
      </div>

      <div class="list_content">
        {#if !currentList}
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p style="margin-top:2rem;">
              {$t('page.lists.list.emptySubtitle')}
              <CreateListButton />
            </p>
          </div>
        {:else}
          {#each currentList?.entries as listEntry (listEntry.id)}
            {#if listEntry}
              <ListEntry
                {listEntry}
                deleteListEntry={() => deleteListEntry(listEntry.id)}
                listEntryChecked={() => checkListEntry(listEntry.id)}
              />
            {/if}
          {/each}
          <!-- {#each currentList?.entries as listEntry, i (i)}
            {#if listEntry}
              <ListEntry
                {listEntry}
                deleteListEntry={() => deleteListEntry(i)}
                listEntryChecked={() => checkListEntry(i)}
              />
            {/if}
          {/each} -->
        {/if}
      </div>
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    padding: 0;
  }

  .entry_list {
    display: flex;
    flex-direction: column;
  }

  .list_area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      @media #{$phone} {
        width: 60%;
      }
    }
  }

  .list_header {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 50%;

    @media #{$tablet} {
      width: 70%;
    }

    @media #{$phone} {
      width: 100%;
    }
  }

  .list_content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    width: 50%;

    @media #{$tablet} {
      width: 70%;
    }

    @media #{$phone} {
      width: 100%;
    }
  }

  .history_area {
    display: flex;
    flex-direction: column;
  }

  .history_list {
    display: flex;
    align-items: center;
    margin-top: var(--default_padding);
  }
</style>

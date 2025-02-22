<script lang="ts">
  import { listStore } from '$lib/util/stores/store-list';
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import CreateListButton from './CreateListButton.svelte';
  import ListEntry from './ListEntry.svelte';
  import ListEntryInput from './ListEntryInput.svelte';

  export let listIndex;

  $: currentList = $listStore[listIndex] || $listStore[0];

  $: if (currentList) console.log(currentList);

  const deleteListEntry = (index) => {
    listStore.update((list) => {
      list[listIndex].lists.splice(index, 1);
      return list;
    });
  };
  const checkListEntry = (index) => {
    listStore.update((list) => {
      list[listIndex].lists[index].done = !list[listIndex].lists[index].done;
      return list;
    });
  };

  const clearHistory = () => {
    listStore.update((list) => {
      list[listIndex].history = [];
      return list;
    });
  };
</script>

{#if $initialized}
  <section
    class="entry_list"
    style="overflow:hidden;display:flex;align-items:center;"
  >
    <div class="list_area">
      {#if currentList || currentList?.lists?.length > 0}
        <div class="list_header">
          <h2>
            {currentList?.emoji || $t('page.lists.list.noEmoji')}
            {currentList?.name || $t('page.lists.list.noEmoji')}
          </h2>
          <div class="history_area">
            {#if currentList?.history?.length > 0}
              <div class="history_list">
                <Wrapper>
                  <Button color="secondary" variant="outlined">
                    <Icon class="material-icons">info</Icon>
                    <Label>{$t('page.lists.list.history')}</Label>
                    <Tooltip xPos="end" yPos="detected">
                      {currentList?.history}
                    </Tooltip>
                  </Button>
                </Wrapper>
                <IconButton
                  color="secondary"
                  style="margin-left: auto;"
                  size="button"
                  on:click={clearHistory}
                >
                  <Icon class="material-icons">delete</Icon>
                </IconButton>
              </div>
            {:else}
              <pre class="status">{$t('page.lists.list.historyEmpty')}</pre>
            {/if}
          </div>
          <ListEntryInput {listIndex} />
        </div>
      {/if}

      <div class="list_content">
        {#if !currentList}
          <h1 style="margin-top:2rem;">
            {$t('page.lists.list.emptyTitle')}
          </h1>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p style="margin-top:2rem;">
              {$t('page.lists.list.emptySubtitle')}
              <CreateListButton />
            </p>
          </div>
        {:else}
          {#each currentList?.entries as listEntry, i (i)}
            {#if listEntry}
              <ListEntry
                {listEntry}
                deleteListEntry={() => deleteListEntry(i)}
                listEntryChecked={() => checkListEntry(i)}
              />
            {/if}
          {/each}
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

    h2 {
      @media #{$tablet} {
        width: 60vw;
      }

      @media #{$phone} {
        width: 60vw;
      }
    }
  }

  .list_content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
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

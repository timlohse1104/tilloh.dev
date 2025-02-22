<script lang="ts">
  import { listStore } from '$lib/util/stores/store-list';
  import { initialized, t } from '$lib/util/translations';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import Tooltip, { Wrapper } from '@smui/tooltip';
  import ListEntry from './ListEntry.svelte';
  import ListEntryInput from './ListEntryInput.svelte';

  export let listIndex;

  $: currentList = $listStore[listIndex] || $listStore[0];

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
          <hr />
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
            {$t('page.lists.list.emptyTitle1')}
            <Icon class="material-icons">list</Icon>
            {$t('page.lists.list.emptyTitle2')}
          </h1>
          <div style="display:flex;flex-direction:column;align-items:center;">
            <p style="margin-top:2rem;">
              {$t('page.lists.list.emptySubtitle')}
              <Icon class="material-icons">menu</Icon>
            </p>
          </div>
        {:else}
          {#each currentList?.lists as listEntry, i (i)}
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
    width: 50%;

    @media #{$tablet} {
      width: 75%;
    }

    @media #{$phone} {
      width: 80%;
    }
  }

  .list_header {
    margin: 0;
  }

  .list_content {
    display: flex;
    flex-direction: column;
    margin-top: calc(var(--default_padding) * 2);
    height: 75vh;
    overflow-y: auto;

    @media #{$tablet} {
      height: 65vh;
    }

    @media #{$phone} {
      height: 40vh;
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

  hr {
    width: 100%;
  }
</style>

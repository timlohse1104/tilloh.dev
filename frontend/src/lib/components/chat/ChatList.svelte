<script lang="ts">
  import { chatStore } from '$lib/util/stores/store-chat';
  import { Icon } from '@smui/icon-button';
  import { Button, Tooltip } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import Chat from './Chat.svelte';
  import ChatInput from './ChatInput.svelte';

  export let listIndex;

  $: currentList = $chatStore[listIndex] || $chatStore[0];

  const deleteChat = (index) => {
    chatStore.update((list) => {
      list[listIndex].chats.splice(index, 1);
      return list;
    });
  };
  const checkChat = (index) => {
    chatStore.update((list) => {
      list[listIndex].chats[index].done = !list[listIndex].chats[index].done;
      return list;
    });
  };

  const clearHistory = () => {
    chatStore.update((list) => {
      list[listIndex].history = [];
      return list;
    });
  };
</script>

<section
  class="chat_list"
  style="overflow:hidden;display:flex;align-items:center;"
>
  <div class="list_area">
    {#if currentList || currentList?.chats?.length > 0}
      <div class="list_header">
        <h2>
          {currentList?.emoji || '📝'}
          {currentList?.name || 'Hier würde der Chatname stehen...'}
        </h2>
        <hr />
        <div class="history_area">
          {#if currentList?.history?.length > 0}
            <div class="history_list">
              <Tooltip triggerText="Verlauf" direction="bottom">
                {currentList?.history}
              </Tooltip>

              <Button
                kind="danger-tertiary"
                iconDescription="Delete"
                icon={TrashCan}
                style="margin-left: auto;"
                on:click={clearHistory}
              />
            </div>
          {:else if !currentList?.history}
            <pre class="status">Hier würde der Verlauf stehen...</pre>
          {:else}
            <pre class="status">Kein Verlauf vorhanden...</pre>
          {/if}
        </div>
        <ChatInput {listIndex} />
      </div>
    {/if}

    <div class="list_content">
      {#if !currentList || currentList?.chats?.length === 0}
        <h1 style="margin-top:2rem;">
          Wähle einen <Icon class="material-icons">chat</Icon> Chat aus.
        </h1>
        <div style="display:flex;flex-direction:column;align-items:center;">
          <p style="margin-top:2rem;">
            Klicke oben rechts auf den Menü-Button.
            <Icon class="material-icons">menu</Icon>
          </p>
        </div>
      {:else}
        {#each currentList?.chats as chat, i (i)}
          {#if chat}
            <Chat
              {chat}
              deleteChat={() => deleteChat(i)}
              chatChecked={() => checkChat(i)}
            />
          {/if}
        {/each}
      {/if}
    </div>
  </div>
</section>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    padding: 0;
  }

  .chat_list {
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

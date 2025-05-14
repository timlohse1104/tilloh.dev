<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { chatStore } from '$lib/util/stores/store-chat';
  import { Button, TextInput } from 'carbon-components-svelte';
  import { Add } from 'carbon-icons-svelte';

  export let listIndex;

  let newChatName = '';

  const saveChat = () => {
    if (newChatName) {
      chatStore.update((n) => {
        n[listIndex].chats.push({ title: newChatName, done: false });
        return [...n];
      });
      addToHistory(newChatName);
      newChatName = '';
    }
  };

  const addToHistory = (chatName) => {
    chatStore.update((n) => {
      n[listIndex].history = Array.from(
        new Set(n[listIndex].history).add(chatName),
      );
      return n;
    });
  };
</script>

<section>
  <TextInput
    bind:value={newChatName}
    placeholder="Neuer Eintrag"
    on:keyup={(event) => {
      if (isEnter(event)) {
        saveChat();
      }
    }}
  />
  <Button kind="tertiary" size="field" icon={Add} on:click={saveChat} />
</section>

<style>
  section {
    display: flex;
    justify-content: space-between;
  }
</style>

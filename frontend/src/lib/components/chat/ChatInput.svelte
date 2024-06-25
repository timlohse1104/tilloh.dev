<script lang="ts">
  import { isEnter } from '$lib/util/helper.ts';
  import { chatStore } from '$lib/util/stores.ts';
  import Autocomplete from '@smui-extra/autocomplete';

  export let listIndex;

  let newChatName = '';

  function saveChat() {
    if (newChatName) {
      chatStore.update((n) => {
        n[listIndex].chats.push({ title: newChatName, done: false });
        return [...n];
      });
      addToHistory(newChatName);
      newChatName = '';
    }
  }

  function addToHistory(chatName) {
    chatStore.update((n) => {
      n[listIndex].history = Array.from(
        new Set(n[listIndex].history).add(chatName),
      );
      return n;
    });
  }
</script>

<Autocomplete
  options={$chatStore[listIndex]?.history || []}
  bind:value={newChatName}
  bind:text={newChatName}
  label="Neuer Eintrag"
  style="margin-top: 1rem; width: 100%;"
  textfield$style="width: 100%;"
  on:SMUIAutocomplete:selected={(event) => {
    newChatName = event.detail;
    saveChat();
  }}
  on:SMUIAutocomplete:noMatchesAction={saveChat}
  on:keyup={(event) => {
    if (isEnter(event)) {
      saveChat();
    }
  }}
/>

<style lang="scss">
</style>

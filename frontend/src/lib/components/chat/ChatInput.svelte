<script lang="ts">
  import { chatStore } from '$lib/util/stores/store-chat';
  import { Add } from 'carbon-icons-svelte';
  import InputWithButton from '../shared/custom-carbon-components/InputWithButton.svelte';

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
  <InputWithButton
    value={newChatName}
    placeholder="Neuer Eintrag"
    icon={Add}
    action={saveChat}
    kind="tertiary"
    customClasses="mt2"
  />
</section>

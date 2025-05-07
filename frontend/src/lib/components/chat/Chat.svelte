<script lang="ts">
  import { Button, Checkbox } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import type { Chat } from '../../types/chat.ts';

  export let chat: Chat;
  export let deleteChat;
  export let chatChecked;
</script>

<section>
  <div class="chat">
    <Checkbox
      bind:checked={chat['done']}
      on:click={chatChecked}
      labelText={chat?.title}
    />
    <Button
      kind="danger-tertiary"
      iconDescription="TODO"
      icon={TrashCan}
      style="margin-left: auto;"
      size="small"
      on:click={deleteChat}
    />
  </div>
</section>

<style>
  .chat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
</style>

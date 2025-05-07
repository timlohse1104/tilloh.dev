<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import { Button } from 'carbon-components-svelte';
  import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
  import type { Chat } from '../../types/chat.ts';

  export let chat: Chat;
  export let deleteChat;
  export let chatChecked;
</script>

<section>
  <div class="chat">
    <FormField>
      <Checkbox bind:checked={chat['done']} on:click={chatChecked} />
      <span slot="label" class={chat?.done ? 'striked' : ''}>{chat?.title}</span
      >
    </FormField>
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

  .striked {
    text-decoration: line-through;
  }
</style>

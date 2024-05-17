<script lang="ts">
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';
  import IconButton, { Icon } from '@smui/icon-button';
  import type { Chat } from '../types/chat.ts';

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
    <IconButton
      color="secondary"
      style="margin-left: auto;"
      size="button"
      on:click={deleteChat}
    >
      <Icon class="material-icons">delete</Icon>
    </IconButton>
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

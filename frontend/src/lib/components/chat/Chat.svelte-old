<script lang="ts">
  import { isEnter } from '$lib/util/helper';
  import Card from '@smui/card';
  import IconButton from '@smui/icon-button';
  import Paper from '@smui/paper';
  import Snackbar, { Actions, Label } from '@smui/snackbar';
  import { Input } from '@smui/textfield';
  import Icon from '@smui/textfield/icon';
  import { io } from 'socket.io-client';
  import { afterUpdate, onMount } from 'svelte';

  const socket = io(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:61154'
      : 'https://api.tilloh.dev/api/chat',
  );

  let messages = [];
  let joined = false;
  let username = '';
  let newMessage = '';
  let chatSection;
  let typingDisplay = '';
  let joinButton;
  let joinSnackbar;
  let sendMessageButton;

  $: if (joinButton) {
    joinButton.$$set({
      disabled: !username,
    });
  }

  $: if (sendMessageButton) {
    sendMessageButton.$$set({
      disabled: !newMessage,
    });
  }

  $: if (joinSnackbar) {
    if (joined) joinSnackbar.open();
  }

  $: isOwnMessage = (message) => message?.name === username;

  // Svelte lifecycle hooks
  onMount(() => {
    // Establish websocket connection
    socket.on('connect', () => {
      console.log(
        `Established websocket connection to ${socket.io.opts.hostname}:${socket.io.opts.port}.`,
      );
      socket.emit('findAllMessages', {}, (response) => {
        const uniqueUsers = [
          ...new Set(response.map((message) => message.name)),
        ];
        console.log(
          `Received ${response?.length} initial messages with ${uniqueUsers?.length} unique users from server.`,
        );
        messages = [
          ...response.map((message) => {
            return {
              ...message,
              timestamp: new Date(message.timestamp).toLocaleString(),
            };
          }),
        ];
      });
    });

    // Subscribe to new messages
    socket.on('message', (message) => {
      messages = [
        ...messages,
        {
          ...message,
          timestamp: new Date(message.timestamp).toLocaleString(),
        },
      ];
    });

    // Subscribe to typing events
    socket.on('typing', ({ name, isTyping }) => {
      if (isTyping) {
        typingDisplay = `${name} schreibt...`;
      } else {
        typingDisplay = '';
      }
    });
  });

  afterUpdate(() => {
    // Auto scroll to bottom for latest messages
    if (chatSection) chatSection.scrollTop = chatSection?.scrollHeight;
  });

  // Custom functions
  const join = () => {
    // Join chat room
    socket.emit(
      'join',
      {
        name: username,
      },
      (allNames) => {
        console.log('Identified names for this client: ', allNames);
        joined = true;
      },
    );
  };

  let typingTimeout;
  const emitTyping = () => {
    // Broadcast typing status to other users
    socket.emit('typing', {
      isTyping: true,
    });
    // Automatically reset typing status after 2 seconds
    typingTimeout = setTimeout(() => {
      socket.emit('typing', {
        isTyping: false,
      });
    }, 2000);
  };

  const sendMessage = () => {
    // Send message to server
    socket.emit(
      'createMessage',
      {
        name: username,
        text: newMessage,
      },
      (createdMessage) => {
        console.log('Created message: ', createdMessage);
        newMessage = '';
      },
    );
  };
</script>

<section class="main-container">
  {#if !joined}
    <div class="join-container">
      <h2>
        <span class="material-icons">chat</span>
        Willkommen im Chat!
      </h2>
      <h3 class="join-header">Bitte gib deinen Namen ein, um beizutreten.</h3>
      <div class="join-input-container">
        <Paper class="join-paper" elevation={6}>
          <Icon class="material-icons" style="color:var(--lightgrey80)"
            >text_format</Icon
          >
          <Input
            bind:value={username}
            on:keyup={(event) => {
              if (isEnter(event)) {
                if (username) join();
              }
            }}
            placeholder="Dein Name"
            class="join-input"
          />
        </Paper>
        <IconButton
          on:click={join}
          bind:this={joinButton}
          size="mini"
          class="material-icons"
          >arrow_forward
        </IconButton>
      </div>
    </div>
  {:else}
    <section class="chat-section" bind:this={chatSection}>
      {#each messages as message}
        <div class="message-container">
          <article
            class="message {isOwnMessage(message)
              ? 'message-left'
              : 'message-right'}"
          >
            <Card
              padded
              class="message {isOwnMessage(message)
                ? 'message-left'
                : 'message-right'}"
              style={`background-color: var(${
                isOwnMessage(message) ? '--color-theme-1' : '--color-theme-2'
              })`}
            >
              <p class="message-header">
                <b>{message?.name}</b> | {message?.timestamp}
              </p>
              <p
                class="message-body"
                style={`color: var(${isOwnMessage(message) ? '--darkgrey80' : '--light80'})`}
              >
                {message?.text}
              </p>
            </Card>
          </article>
        </div>
      {/each}
    </section>

    <!-- Footer -->
    <footer class="chat-footer">
      {#if typingDisplay}
        <p class="is-size-7">{typingDisplay}</p>
      {/if}
      <Paper class="join-paper" elevation={6}>
        <Icon class="material-icons" style="color:var(--lightgrey80)">edit</Icon
        >
        <Input
          bind:value={newMessage}
          on:input={emitTyping}
          on:keyup={(event) => {
            if (isEnter(event)) {
              if (username) sendMessage();
            }
          }}
          placeholder="Schreibe deine Nachricht"
          class="join-input"
        />
      </Paper>
      <IconButton
        on:click={sendMessage}
        bind:this={sendMessageButton}
        size="mini"
        class="material-icons"
        >send
      </IconButton>
    </footer>
  {/if}
</section>

<!-- Info Area -->
<Snackbar bind:this={joinSnackbar}>
  <Label>Erfolgreich dem Chat als {username} beigetreten.</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss">close</IconButton>
  </Actions>
</Snackbar>

<style lang="scss">
  @import '../../../lib/styles/global.scss';

  /* Head styles */
  .main-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
  }
  .join-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: var(--default-padding);
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
  }

  /* Join styles */
  .join-header {
    padding-bottom: calc(var(--default-padding) * 2);
  }
  .join-input-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  * :global(.join-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 600px;
    margin: 0 12px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.join-paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.join-input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface);
  }
  * :global(.join-input::placeholder) {
    color: var(--mdc-theme-on-surface);
    opacity: 0.6;
  }

  /* Chat styles */
  .chat-section {
    overflow-y: auto;
    padding: 1em;
    height: 85vh;

    @media #{$tablet} {
      height: 78vh;
    }

    @media #{$phone} {
      height: 70vh;
    }
  }
  .message {
    max-width: 75%;
  }
  .message-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    padding-bottom: var(--default-padding);
  }
  .message-header {
    font-size: 0.8em;
    color: var(--lightgrey80);
    margin: 0 0 16px 0;
    width: max-content;
  }
  .message-body {
    text-wrap: wrap;
    margin: 0;
  }
  .message-left {
    align-self: flex-start;
  }
  .message-right {
    align-self: flex-end;
  }

  /* Footer styles */
  .chat-footer {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    padding: var(--default-padding) 0;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
  }
</style>

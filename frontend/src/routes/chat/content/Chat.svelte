<script lang="ts">
  import Fab from '@smui/fab';
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

  $: if (joinButton) {
    joinButton.$$set({
      disabled: !username,
    });
  }

  $: if (joinSnackbar) {
    if (joined) joinSnackbar.open();
  }

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

<main class="main-container">
  <section class="hero is-link is-bold hero-head">
    <div class="hero-body">
      <div class="container"></div>
    </div>
  </section>

  {#if !joined}
    <div class="solo-demo-container solo-container">
      <Paper class="solo-paper" elevation={6}>
        <Icon class="material-icons" style="color:var(--lightgrey80)"
          >text_format</Icon
        >
        <Input
          bind:value={username}
          on:keyup={(event) => {
            if (event['code'] === 'Enter') {
              if (username) join();
            }
          }}
          placeholder="Dein Name"
          class="solo-input"
        />
      </Paper>
      <Fab
        on:click={join}
        bind:this={joinButton}
        color="primary"
        mini
        class="solo-fab"
      >
        <Icon class="material-icons">arrow_forward</Icon>
      </Fab>
    </div>
  {:else}
    <section class="chat-section" bind:this={chatSection}>
      {#each messages as message}
        <div class="message-container">
          <article
            class="message {message?.name === username
              ? 'is-info'
              : 'is-success'} {message?.name === username
              ? 'message-left'
              : 'message-right'}"
          >
            <div class="message-header">
              <p>{message?.name} | {message?.timestamp}</p>
            </div>
            <div class="message-body">
              {message?.text}
            </div>
          </article>
        </div>
      {/each}
    </section>

    <section class="hero-foot">
      <footer class="section is-small">
        {#if typingDisplay}
          <p class="is-size-7">{typingDisplay}</p>
        {/if}
        <form on:submit|preventDefault={sendMessage}>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                on:input={emitTyping}
                bind:value={newMessage}
                class="input"
                name="userInput"
                type="text"
                placeholder="Schreibe deine Nachricht"
              />
            </div>
            <div class="control">
              <button class="button is-info"> Senden </button>
            </div>
          </div>
        </form>
      </footer>
    </section>
  {/if}

  <!-- Info Area -->
  <Snackbar bind:this={joinSnackbar}>
    <Label>Erfolgreich dem Chat als {username} beigetreten.</Label>
    <Actions>
      <IconButton class="material-icons" title="Dismiss">close</IconButton>
    </Actions>
  </Snackbar>
</main>

<style>
  /* Head styles */
  :global(html, body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .hero-head {
    flex: 0 0 auto;
  }

  .hero-foot {
    flex: 0 0 auto;
  }

  .solo-demo-container {
    padding: var(--default-padding);
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
  }

  /* Join styles */
  .solo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  * :global(.solo-paper) {
    display: flex;
    align-items: center;
    flex-grow: 1;
    max-width: 600px;
    margin: 0 12px;
    padding: 0 12px;
    height: 48px;
  }
  * :global(.solo-paper > *) {
    display: inline-block;
    margin: 0 12px;
  }
  * :global(.solo-input) {
    flex-grow: 1;
    color: var(--mdc-theme-on-surface);
  }
  * :global(.solo-input::placeholder) {
    color: var(--mdc-theme-on-surface);
    opacity: 0.6;
  }
  * :global(.solo-fab) {
    flex-shrink: 0;
  }

  /* Chat styles */
  .chat-section {
    overflow-y: auto;
    flex: 1 1 auto;
    padding: 1em;
  }

  .message-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1em;
  }

  .message-left {
    align-self: flex-start;
  }

  .message-right {
    align-self: flex-end;
  }
</style>

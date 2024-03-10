<script lang="ts">
  import Chat from './content/Chat.svelte';
</script>

<svelte:head>
  <title>Chat</title>
  <meta name="Chat" content="Chat" />
</svelte:head>

<section>
  <Chat />
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    position: relative;
    display: flex;
    z-index: 0;
  }
</style>

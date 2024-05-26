<script>
  import { page } from '$app/stores';
  import Header from './Header.svelte';
  import './styles.css';
</script>

<svelte:head>
  {#if $page.url.pathname === '/'}
    <link rel="icon" href="/favicons/home.favicon.svg" />
  {:else if $page.url.pathname === '/memorandum'}
    <link rel="icon" href="/favicons/memorandum.favicon.svg" />
  {:else if $page.url.pathname === '/todo'}
    <link rel="icon" href="/favicons/todo.favicon.svg" />
  {:else if $page.url.pathname === '/chat'}
    <link rel="icon" href="/favicons/chat.favicon.svg" />
  {:else if $page.url.pathname === '/catch-em-all'}
    <link rel="icon" href="/favicons/catch-em-all.favicon.svg" />
  {:else if $page.url.pathname === '/uno-sort'}
    <link rel="icon" href="/favicons/uno-sort.favicon.svg" />
  {:else if $page.url.pathname === '/about'}
    <link rel="icon" href="/favicons/about.favicon.svg" />
  {:else if $page.url.pathname === '/settings'}
    <link rel="icon" href="/favicons/settings.favicon.svg" />
  {/if}
</svelte:head>

<div class="app">
  <Header />

  <main>
    <slot />
  </main>
</div>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  :global(::-webkit-scrollbar) {
    width: 12px;
    background-color: var(--darkgrey80);
  }

  :global(::-webkit-scrollbar-track) {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: var(--darkgrey80);
  }

  :global(::-webkit-scrollbar-thumb) {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: var(--color-theme-2-50);

    &:hover {
      background-color: var(--color-theme-2);
    }
  }
</style>

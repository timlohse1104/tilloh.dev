<script>
  import { page } from '$app/stores';
  import Header from './_layout/Header.svelte';
  import './styles.css';

  $: pageName = $page.url.pathname.replace('/', '')
    ? $page.url.pathname.replace('/', '')
    : 'home';
</script>

<svelte:head>
  <link rel="icon" href={`/favicons/${pageName}.favicon.svg`} />
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

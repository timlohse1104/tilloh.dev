<script lang="ts">
  import { page } from '$app/stores';
  import GlobalLogin from '$lib/components/shared/GlobalLogin.svelte';
  import Header from '$lib/components/shared/Header.svelte';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { languageStore } from '$lib/util/stores/store-language';
  import { themeStore } from '$lib/util/stores/store-theme';
  import 'carbon-components-svelte/css/all.css';
  import { onMount } from 'svelte';
  import './styles.css';

  $: isVerified = $identifierStore ? true : false;
  $: locale = $languageStore;
  $: theme = $themeStore;
  $: isAdminRoute = $page.url.pathname.replace('/', '') === 'admin';

  onMount(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
  });

  $: {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }
</script>

<div class="app">
  <Header {locale} />

  {#if !isVerified}
    <div class="login_container">
      <GlobalLogin {isVerified} isAdminLogin={isAdminRoute} />
    </div>
  {:else}
    <main>
      <slot />
    </main>
  {/if}
</div>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  main {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100vw;
    overflow: auto;
    flex: 1;
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
    background-color: lightgreen;

    &:hover {
      background-color: green;
    }
  }

  .login_container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }
</style>

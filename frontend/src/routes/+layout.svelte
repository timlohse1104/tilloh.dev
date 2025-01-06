<script lang="ts">
  import GlobalLogin from '$lib/components/shared/GlobalLogin.svelte';
  import Header from '$lib/components/shared/Header.svelte';
  import { languageStore } from '$lib/util/languageStore';
  import { themeStore } from '$lib/util/themeStore';
  import { onMount } from 'svelte';
  import './styles.css';

  export let isVerified: boolean = false;

  $: locale = $languageStore;
  $: theme = $themeStore;

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
      <GlobalLogin {isVerified} />
    </div>
  {:else}
    <slot />
    <!-- <main>
    </main> -->
  {/if}
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
    background-color: var(--color_theme_2_50);

    &:hover {
      background-color: var(--color_theme_2);
    }
  }

  .login_container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }
</style>

<script lang="ts">
  import { page } from '$app/stores';
  import GlobalLogin from '$lib/components/shared/GlobalLogin.svelte';
  import Header from '$lib/components/shared/Header.svelte';
  import { backgroundStore } from '$lib/util/stores/store-background';
  import { identifierStore } from '$lib/util/stores/store-identifier';
  import { languageStore } from '$lib/util/stores/store-language';
  import { darkThemeValue, themeStore } from '$lib/util/stores/store-theme';
  import {
    confettiAmount,
    confettiDuration,
    isConfettiVisibleStore,
  } from '$lib/util/stores/stores-global';
  import { confetti } from '@neoconfetti/svelte';
  import 'carbon-components-svelte/css/all.css';
  import './styles.css';

  $: isVerified = $identifierStore ? true : false;
  $: locale = $languageStore;
  $: isAdminRoute = $page.url.pathname.replace('/', '') === 'admin';
  $: theme = $themeStore;
  $: document.documentElement.setAttribute('theme', theme);
  $: getAppClasses = `app background_${$backgroundStore}_${$themeStore === darkThemeValue ? 'dark' : 'light'}`;
</script>

<div class={getAppClasses}>
  {#if $isConfettiVisibleStore}
    <div class="confetti_container">
      <div
        use:confetti={{
          stageHeight: window.visualViewport.height - 5,
          stageWidth: window.visualViewport.width,
          duration: confettiDuration,
          particleCount: confettiAmount,
        }}
      ></div>
    </div>
  {/if}

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

  .confetti_container {
    display: flex;
    justify-content: center;
    z-index: 9999;
  }
</style>

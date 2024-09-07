<script>
  import { page } from '$app/stores';
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { sharedIdentifierStore } from '$lib/util/stores';
  import { getlocale } from '$lib/util/translations';
  import { Icon } from '@smui/icon-button';
  import BurgerMenu from './BurgerMenu.svelte';

  const locale = getlocale();

  $: pageName = $page.url.pathname.replace('/', '')
    ? $page.url.pathname.replace('/', '')
    : 'home';
  $: currentPage = applicationRoutes[pageName] || utilityRoutes[pageName];
</script>

<section>
  <div class="headerBox">
    <div class="meInfo"></div>

    <div class="headlineBox">
      <h2>
        <Icon class="material-icons">{currentPage.icon}</Icon>
        {currentPage.name[locale]}
      </h2>

      <p>
        {#if $sharedIdentifierStore.id}
          <span style="color: var(--green)">online 🌐</span>
        {:else}
          <span style="color: var(--red)">offline 📴</span>
        {/if}
      </p>
    </div>

    <div class="corner">
      <BurgerMenu />
    </div>
  </div>
</section>

<style lang="scss">
  .headerBox {
    display: flex;
    justify-content: space-between;
    background-color: var(--darkgrey80);
    padding: 0.5em 1em;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    border-bottom: var(--white30) 1px solid;
  }

  .headlineBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--light80);

    h2 {
      margin: 0;
      font-size: 2em;
    }
  }

  .corner {
    width: 3em;
    height: 3em;
    margin: 0.25em 0.5em;
    display: flex;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  .meInfo {
    display: flex;
    flex-direction: column;
  }

  p {
    font-size: 0.8em;
    margin: 0 0 0 1rem;
  }
</style>

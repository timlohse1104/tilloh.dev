<script>
  import { page } from '$app/stores';
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { sharedIdentifierStore } from '$lib/util/store-other';
  import IconButton, { Icon } from '@smui/icon-button';
  import BurgerMenu from './BurgerMenu.svelte';

  export let locale;

  $: pageName = $page.url.pathname.replace('/', '') || 'home';
  $: currentPage = applicationRoutes[pageName] || utilityRoutes[pageName];
</script>

<section>
  <div class="header_box">
    <div class="me_info">
      <IconButton class="tilloh_logo" href={applicationRoutes.home.path}>
        <img src={'/images/logo.png'} alt="tilloh.dev logo" />
      </IconButton>
    </div>

    <div class="headline_box">
      <h2>
        <Icon class="material-icons">{currentPage?.icon}</Icon>
        {currentPage?.name?.[locale]}
      </h2>

      <p>
        {#if $sharedIdentifierStore.id}
          <span style="color: var(--green) !important">🌐 Cloud</span>
        {:else}
          <span style="color: var(--red) !important">📴 Lokal</span>
        {/if}
      </p>
    </div>

    <div class="corner">
      <BurgerMenu {locale} />
    </div>
  </div>
</section>

<style lang="scss">
  .header_box {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 1em;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    border-bottom: var(--white30) 1px solid;
  }

  :global(.tilloh_logo) {
    width: 3em;
    height: 3em;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .headline_box {
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
    height: 3em;
    margin: 0.25em 0.5em;
    display: flex;
  }

  .me_info {
    display: flex;
    flex-direction: column;
  }

  p {
    font-size: 0.8em;
    margin: 0 0 0 1rem;
  }
</style>

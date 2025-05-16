<script>
  import { page } from '$app/stores';
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { sharedIdentifierStore } from '$lib/util/stores/store-other';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import GlobalMenu from './GlobalMenu.svelte';

  export let locale;

  const getCurrentPage = () => {
    const plainPage = applicationRoutes[pageName] || utilityRoutes[pageName];
    if (!plainPage && pageName) {
      const pageNameParts = pageName.split('/');
      if (pageNameParts.length > 1) {
        const routeKey = pageNameParts[0];
        return applicationRoutes[routeKey] || utilityRoutes[routeKey];
      }
    }
    return plainPage;
  };

  $: pageName = $page.url.pathname.replace('/', '') || 'home';
  $: currentPage = getCurrentPage();
  $: if (pageName) currentPage = getCurrentPage();
</script>

<section>
  <div class="header_box">
    <Button
      kind="ghost"
      iconDescription={$t('page.shared.toggledSiteBackButtonText')}
      tooltipAlignment="end"
      href={applicationRoutes.home.path}
      class="home_button"
    >
      <img
        src={'/images/logo.png'}
        alt="tilloh.dev logo"
        style="height: 3em;"
      />
    </Button>

    <div class="headline_box">
      <h2>
        {#await import(
          /* @vite-ignore */
          `/node_modules/carbon-icons-svelte/lib/${currentPage?.icon}.svelte`
        ) then icon}
          <svelte:component this={icon.default} />
        {/await}
        {currentPage?.name?.[locale]}
      </h2>

      <p>
        {#if $sharedIdentifierStore.id}
          <span style="color: green !important">🌐 Cloud</span>
        {:else}
          <span style="color: red !important">📴 Lokal</span>
        {/if}
      </p>
    </div>

    <GlobalMenu {locale} />
  </div>
</section>

<style lang="scss">
  .header_box {
    display: flex;
    justify-content: space-between;
    padding: 1rem 1rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    border-bottom: var(--white30) 1px solid;
  }

  .headline_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 2em;
    }
  }

  :global(.bx--btn.home_button) {
    padding: 0;
    margin: 0;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  p {
    font-size: 0.8em;
    margin: 0 0 0 1rem;
  }
</style>

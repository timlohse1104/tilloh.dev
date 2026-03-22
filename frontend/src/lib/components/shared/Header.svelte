<script>
  import { page } from '$app/stores';
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { sharedIdentifierStore } from '$lib/util/stores/store-other';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Cloud from 'carbon-icons-svelte/lib/Cloud.svelte';
  import CloudOffline from 'carbon-icons-svelte/lib/CloudOffline.svelte';
  import GlobalMenu from './GlobalMenu.svelte';

  export let locale;

  const getCurrentPage = () => {
    const plainPage = $applicationRoutes[pageName] || utilityRoutes[pageName];
    if (!plainPage && pageName) {
      const pageNameParts = pageName.split('/');
      if (pageNameParts.length > 1) {
        const routeKey = pageNameParts[0];
        return $applicationRoutes[routeKey] || utilityRoutes[routeKey];
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
      href={$applicationRoutes.home.path}
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
        <svelte:component this={currentPage?.icon} />
        {currentPage?.name?.[locale]}
        {#if $sharedIdentifierStore.id}
          <Cloud class="storage-icon storage-icon--cloud" />
        {:else}
          <CloudOffline class="storage-icon storage-icon--offline" />
        {/if}
      </h2>
    </div>

    <GlobalMenu {locale} />
  </div>
</section>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

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
      display: flex;
      align-items: center;
      gap: 0.3em;

      :global(svg:first-child) {
        width: 1em;
        height: 1em;
        flex-shrink: 0;
      }

      @media #{$phone} {
        font-size: 1.2em;
      }
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

  :global(.storage-icon) {
    width: 0.75em;
    height: 0.75em;
    flex-shrink: 0;
  }

  :global(.storage-icon--cloud) {
    color: #42be65;
  }

  :global(.storage-icon--offline) {
    color: #fa4d56;
  }
</style>

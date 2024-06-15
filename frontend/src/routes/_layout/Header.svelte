<script>
  import { page } from '$app/stores';
  import github from '$lib/images/github-light.svg';
  import logo from '$lib/images/stadtwerk-logo.svg';
  import { sharedIdentifierStore } from '$lib/util/stores';
  import IconButton, { Icon } from '@smui/icon-button';
  import {
    applicationRoutes,
    utilityRoutes,
  } from '../../lib/config/applications';
  const { home } = applicationRoutes;
  const { settings, admin } = utilityRoutes;

  $: pageName = $page.url.pathname.replace('/', '')
    ? $page.url.pathname.replace('/', '')
    : 'home';
  $: currentPage = applicationRoutes[pageName] || utilityRoutes[pageName];
</script>

<section>
  <div class="headerBox">
    <div class="meInfo">
      <div class="corner">
        {#if $page.url.pathname === home.path}
          <IconButton href="https://stadtwerk.org" target="_blank">
            <img src={logo} alt="stadtwerk" />
          </IconButton>
        {:else}
          <IconButton
            style="color: white; text-decoration: none;"
            href={home.path}
          >
            <Icon class="material-icons">{home.icon}</Icon>
          </IconButton>
        {/if}
      </div>
    </div>

    <div class="headlineBox">
      <h2>
        <Icon class="material-icons">{currentPage.icon}</Icon>
        {currentPage.name}
      </h2>

      <p>
        {#if $sharedIdentifierStore.id}
          <span style="color: var(--green)">online 🌐</span>
        {:else}
          <span style="color: var(--red)">offline 📴</span>
        {/if}
      </p>
    </div>

    {#if $page.url.pathname === home.path}
      <div class="corner">
        <IconButton href="https://github.com/timlohse1104" target="_blank">
          <img src={github} alt="GitHub" />
        </IconButton>
      </div>
    {:else}
      <div class="corner">
        <IconButton
          style="color: white;  text-decoration: none;"
          href={settings.path}
          ><Icon class="material-icons">{settings.icon}</Icon></IconButton
        >
      </div>
    {/if}
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

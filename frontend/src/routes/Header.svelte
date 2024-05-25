<script>
  import { page } from '$app/stores';
  import github from '$lib/images/github-light.svg';
  import logo from '$lib/images/stadtwerk-logo.svg';
  import { sharedIdentifierStore } from '$lib/util/stores';
  import IconButton, { Icon } from '@smui/icon-button';

  $: pageName =
    $page.url.pathname.replace('/', '').charAt(0).toUpperCase() +
    $page.url.pathname.slice(2);
</script>

<section>
  <div class="headerBox">
    <div class="meInfo">
      <div class="corner">
        {#if $page.url.pathname === '/'}
          <IconButton href="https://stadtwerk.org" target="_blank">
            <img src={logo} alt="stadtwerk" />
          </IconButton>
        {:else if $page.url.pathname === '/settings'}
          <IconButton style="color: white; text-decoration: none;" href="/"
            ><Icon class="material-icons">home</Icon></IconButton
          >
        {:else}
          <IconButton style="color: white; text-decoration: none;" href="/"
            ><Icon class="material-icons">home</Icon></IconButton
          >
          <IconButton
            style="color: white;  text-decoration: none;"
            href="/settings"
            ><Icon class="material-icons">settings</Icon></IconButton
          >
        {/if}
      </div>
    </div>

    <div class="headlineBox">
      {#if $page.url.pathname === '/'}
        <h2>Startseite</h2>
      {:else if $page.url.pathname === '/settings'}
        <h2>Einstellungen</h2>
      {:else if $page.url.pathname === '/uno-sort'}
        <h2>UNO Sortierung</h2>
      {:else}
        <h2>{pageName}</h2>
      {/if}

      <p>
        Verbindungsstatus:
        {#if $sharedIdentifierStore.id}
          <span style="color: var(--green)"> Online 🌐</span>
        {:else}
          <span style="color: var(--red)">Offline 📴</span>
        {/if}
      </p>
    </div>

    <div class="corner">
      <IconButton href="https://github.com/timlohse1104" target="_blank">
        <img src={github} alt="GitHub" />
      </IconButton>
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

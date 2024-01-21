<script>
  import { page } from '$app/stores';
  import github from '$lib/images/github.svg';
  import logo from '$lib/images/stadtwerk-logo.svg';
  import IconButton, { Icon } from '@smui/icon-button';

  $: pageName =
    $page.url.pathname.replace('/', '').charAt(0).toUpperCase() +
    $page.url.pathname.slice(2);
</script>

<section>
  <div class="headerBox">
    <div class={$page.url.pathname !== '/' ? 'hide' : 'corner'}>
      <IconButton href="https://stadtwerk.org" target="_blank">
        <img src={logo} alt="stadtwerk" />
      </IconButton>
    </div>
    <div class={$page.url.pathname === '/' ? 'hide' : 'corner'}>
      <IconButton style="color: var(--mdc-theme-on-surface, #fff);" href="/"
        ><Icon class="material-icons">home</Icon></IconButton
      >
    </div>

    <div class="headlineBox">
      <h2>{$page.url.pathname !== '/' ? pageName : 'Home'}</h2>
      <p>made by Tilloh with 💙</p>
    </div>

    <div class="corner">
      <IconButton href="https://github.com/timlohse1104" target="_blank">
        <img src={github} alt="GitHub" />
      </IconButton>
    </div>
  </div>
</section>

<style lang="scss">
  @import '$lib/styles/_variables.scss';

  .headerBox {
    display: flex;
    justify-content: space-between;
    background-color: $darkgrey80;
    padding: 0.5em 1em;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    border-bottom: $white30 1px solid;
  }

  .headlineBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      margin: 0;
      font-size: 2em;
    }

    p {
      font-size: 0.8em;
      margin: 0;
    }
  }

  .hide {
    display: none;
  }

  .corner {
    width: 3em;
    height: 3em;
    margin: 0.25em 0.5em;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }
</style>

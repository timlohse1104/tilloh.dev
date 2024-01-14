<script>
  import { page } from '$app/stores';
  import github from '$lib/images/github.svg';
  import logo from '$lib/images/stadtwerk-logo.svg';
  import IconButton, { Icon } from '@smui/icon-button';
</script>

<section>
  <div class="header-box">
    <div class={$page.url.pathname !== '/' ? 'hide' : 'corner'}>
      <IconButton href="https://github.com/timlohse1104" target="_blank">
        <img src={github} alt="GitHub" />
      </IconButton>
    </div>

    <div class={$page.url.pathname === '/' ? 'hide' : 'corner'}>
      <IconButton style="color: var(--mdc-theme-on-surface, #fff);" href="/"
        ><Icon class="material-icons">home</Icon></IconButton
      >
    </div>

    <div class={$page.url.pathname !== '/' ? 'hide' : 'corner'}>
      <IconButton href="https://stadtwerk.org" target="_blank">
        <img src={logo} alt="stadtwerk" />
      </IconButton>
    </div>
  </div>
</section>

<style>
  .header-box {
    display: flex;
    justify-content: space-between;
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

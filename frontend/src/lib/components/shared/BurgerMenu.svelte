<script lang="ts">
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { themeStore } from '$lib/util/themeStore';
  import { initialized, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import ThemeSwitch from './ThemeSwitch.svelte';

  export let locale;

  $: appLinks = Object.values(applicationRoutes).map((route) => ({
    title: route.name[locale],
    link: route.path,
    icon: route.icon,
  }));
  $: utilLinks = Object.values(utilityRoutes).map((route) => ({
    title: route.name[locale],
    link: route.path,
    icon: route.icon,
  }));
</script>

<IconButton>
  <button popovertarget="hamburger-menu">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M5 8h22M5 16h22M5 24h22"
      /></svg
    >
  </button>
</IconButton>

<aside
  popover
  id="hamburger-menu"
  style={$themeStore === 'dark'
    ? 'background-color: var(--color_bg_2);'
    : 'background-color: var(--color_bg_light_2);'}
>
  {#if $initialized}
    <div class="burger-menu-header">
      <IconButton class="tilloh-logo" href={applicationRoutes.home.path}>
        <img src={'/images/logo.png'} alt="tilloh.dev logo" />
      </IconButton>
      <h1>{$t('page.shared.burgerMenuTitle')}</h1>
    </div>
    <hr />
    <ul>
      {#each appLinks as link}
        <li>
          <Icon class="material-icons menu-icons">{link.icon}</Icon>
          <a href={link.link}>{link.title} </a>
        </li>
      {/each}
    </ul>

    <hr />

    <ul>
      {#each utilLinks as link}
        <li>
          <Icon class="material-icons menu-icons">{link.icon}</Icon>
          <a href={link.link}>{link.title}</a>
        </li>
      {/each}
    </ul>

    <hr />

    <LanguageSwitch
      customStyle="padding-left: var(--menu_left);margin-top:3rem;"
    />
    <ThemeSwitch
      customStyle="padding-left: var(--menu_left);margin-top:3rem;"
    />

    <footer>
      <IconButton href="https://github.com/timlohse1104" target="_blank">
        <img src={'/images/links/github-light.svg'} alt="GitHub" />
      </IconButton>
      <p>{$t('page.shared.madeByText')}</p>
      <IconButton href="https://stadtwerk.org" target="_blank">
        <img src={'/images/links/stadtwerk-logo.svg'} alt="stadtwerk" />
      </IconButton>
    </footer>
  {:else}
    <section>Locale initializing...</section>
  {/if}
</aside>

<style lang="scss">
  @import '../../styles/variables.scss';

  :root {
    --menu_left: 2rem;
  }

  button {
    all: unset;
    cursor: pointer;
    display: block;
    margin: 0;
    padding: 0.5rem;
    line-height: 0;
  }

  aside {
    position: fixed;
    width: 30%;
    height: 100%;
    inset: 0;
    border: 0;
    margin: 0;
    margin-left: auto;
    transform: translateX(100%);
    --duration: 500ms;
    transition:
      transform var(--duration),
      overlay var(--duration) allow-discrete,
      display var(--duration) allow-discrete;

    @media #{$tablet} {
      width: 50%;
      font-size: x-large;
    }

    @media #{$phone} {
      width: 75%;
      font-size: larger;
    }

    &:popover-open {
      transform: translateX(0);
    }

    &::backdrop {
      background-color: var(--black30);
      opacity: 1;
      transition:
        opacity var(--duration),
        overlay var(--duration) allow-discrete,
        display var(--duration) allow-discrete;
    }
  }

  .burger-menu-header {
    display: flex;
    align-items: center;
    margin-left: var(--menu_left);
  }

  h1 {
    text-align: left;
    color: var(--color_text);

    @media #{$phone} {
      font-size: larger;
    }
  }

  :global(.tilloh-logo) {
    width: 2em;
    height: 2em;
    margin-right: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  hr {
    position: fixed;
    left: var(--menu_left);
    margin: 0;
  }

  hr:first-of-type {
    border: 1.25px solid var(--mdc-theme-on-surface);
    width: 75%;
  }

  hr:not(:first-of-type) {
    border: 0.05rem solid var(--mdc-theme-on-surface);
    width: 50%;
    opacity: 0.3;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 3rem;
    margin-bottom: 1rem;

    @media #{$tablet} {
      margin-top: 2rem;
    }

    @media #{$phone} {
      margin-top: 2rem;
    }
  }

  li {
    display: flex;
    align-items: center;
    border: 0;
    padding-left: var(--menu_left);

    &:hover {
      background-color: black;
    }
  }

  a {
    color: var(--color_text);
    text-decoration: none;
    display: block;
    padding: 1rem;
  }

  footer {
    position: fixed;
    bottom: 2rem;
    left: 0;
    width: 100%;
    text-align: center;
    color: var(--color_text);
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;

    @media #{$phone} {
      font-size: 0.8rem;
    }

    p {
      margin: 0 2rem 0 2rem;
    }
    img {
      width: 2em;
      height: 2em;
      object-fit: contain;
    }
  }

  @starting-style {
    aside:popover-open {
      transform: translateX(100%);
    }
    aside::backdrop {
      opacity: 0;
    }
  }

  :global(.menu-icons) {
    color: var(--color_text);
  }
</style>

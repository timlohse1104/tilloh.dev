<script lang="ts">
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { initialized, t } from '$lib/util/translations';
  import { Icon } from '@smui/common';
  import IconButton from '@smui/icon-button';
  import { Button } from 'carbon-components-svelte';
  import { Menu } from 'carbon-icons-svelte';

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

<Button
  kind="tertiary"
  iconDescription="TODO"
  icon={Menu}
  popovertarget="hamburger-menu"
  tooltipPosition="left"
  size="xl"
/>

<aside popover id="hamburger-menu">
  {#if $initialized}
    <div class="burger-menu-header">
      <IconButton class="tilloh-logo" href={applicationRoutes.home.path}>
        <img src={'/images/logo.png'} alt="tilloh.dev logo" />
      </IconButton>
      <h2>{$t('page.shared.burgerMenuTitle')}</h2>
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
  @use '../../styles/variables.scss' as *;

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
      font-size: large;
    }

    @media #{$phone} {
      width: 75%;
      font-size: medium;
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

  h2 {
    text-align: left;
    font-size: 2.5rem;

    @media #{$phone} {
      font-size: x-large;
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
    border: 1.25px solid;
    width: 75%;
  }

  hr:not(:first-of-type) {
    border: 0.05rem solid;
    width: 50%;
    opacity: 0.3;
  }

  ul {
    list-style: none;
    padding: 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  li {
    display: flex;
    align-items: center;
    border: 0;
    padding-left: var(--menu_left);

    &:hover {
      background-color: var(--lightgrey80);
    }
  }

  a {
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
</style>

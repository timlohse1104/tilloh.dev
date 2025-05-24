<script lang="ts">
  import { applicationRoutes, utilityRoutes } from '$lib/config/applications';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

  export let locale;

  let globalMenuObject;

  $: appLinks = Object.values(applicationRoutes).map((route) => ({
    id: route.id,
    title: route.name[locale],
    link: route.path,
    icon: route.icon,
  }));
  $: utilLinks = Object.values(utilityRoutes).map((route) => ({
    id: route.id,
    title: route.name[locale],
    link: route.path,
    icon: route.icon,
  }));

  const togglePopover = () => {
    if (globalMenuObject) globalMenuObject.togglePopover();
  };
</script>

<Button
  kind="tertiary"
  iconDescription={$t('page.shared.button.globalMenu')}
  icon={Menu}
  popovertarget="hamburger-menu"
  tooltipPosition="left"
  class="global_menu"
/>

<aside popover bind:this={globalMenuObject} id="hamburger-menu">
  {#if $initialized}
    <div class="burger-menu-header">
      <h2 class="mt1">{$t('page.shared.burgerMenuTitle')}</h2>
    </div>
    <hr />
    <ul>
      {#each appLinks as link}
        <li>
          <svelte:component this={link.icon} />
          <a href={link.link} on:click={togglePopover}>{link.title} </a>
        </li>
      {/each}
    </ul>

    <hr />

    <ul>
      {#each utilLinks as link}
        <li>
          <svelte:component this={link.icon} />
          <a href={link.link} on:click={togglePopover}>{link.title}</a>
        </li>
      {/each}
    </ul>

    <footer>
      <Button
        kind="tertiary"
        iconDescription={$t('page.shared.button.github')}
        href="https://github.com/timlohse1104"
        target="_blank"
        class="global_menu_footer_buttons"
      >
        <img src={'/images/links/github-dark.svg'} alt="GitHub" />
      </Button>
      <p>{$t('page.shared.madeByText')}</p>
      <Button
        kind="tertiary"
        iconDescription={$t('page.shared.button.stadtwerk')}
        href="https://stadtwerk.org"
        target="_blank"
        class="global_menu_footer_buttons"
      >
        <img
          src={'/images/links/stadtwerk-logo.svg'}
          style="height: 3em;"
          alt="stadtwerk"
        />
      </Button>
    </footer>
  {:else}
    <section>Locale initializing...</section>
  {/if}
</aside>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  :global(.bx--btn.global_menu) {
    padding: 0;
    margin: 0;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.bx--btn.global_menu_footer_buttons) {
    padding: 0;
    margin: 0;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  aside {
    background-color: var(--cds-ui-background);
    color: var(--cds-text-01);
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
      background-color: var(--black80);
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
    color: var(--cds-text-01);
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

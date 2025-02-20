<script>
  import { applicationRoutes } from '$lib/config/applications';
  import { languageStore } from '$lib/util/stores/store-language';
  import { Icon } from '@smui/common';

  export let appKey;

  const app = applicationRoutes[appKey];

  $: locale = $languageStore;
</script>

<li aria-current={appKey === 'home' ? 'page' : undefined}>
  <span class="navRow">
    <Icon
      class="material-icons"
      style="cursor: pointer;font-size: 1.2rem;"
      on:click={() => window.open(app.path, '_self')}>{app.icon}</Icon
    >
    <a href={app.path}>{app.name[locale]}</a>
  </span>
</li>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  li {
    position: relative;
    height: 100%;

    display: flex;
    align-items: center;

    .navRow {
      display: flex;
      align-items: end;
      padding-left: 1rem;
    }
  }

  li[aria-current='page']::before {
    --size: 5px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color_theme_1);
  }

  a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1rem;
    color: var(--color_text);
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;

    @media #{$tablet} {
      font-size: 1rem;
      padding: 0 0.8rem;
    }

    @media #{$phone} {
      font-size: 0.8rem;
      padding: 0 0.3rem;
      font-weight: 800;
    }
  }

  a:hover {
    color: var(--color_theme_1);
  }
</style>

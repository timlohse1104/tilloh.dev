<script>
  import { languageStore } from '$lib/util/stores/store-language';

  export let appKey;
  export let app;

  $: if (app) console.log(app);

  $: locale = $languageStore;
</script>

<li aria-current={appKey === 'home' ? 'page' : undefined}>
  <span class="navRow">
    {#await import(
      `/node_modules/carbon-icons-svelte/lib/${app?.icon}.svelte`
    ) then icon}
      <svelte:component this={icon.default} />
    {/await}
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
    border-top: var(--size) solid green;
  }

  a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1rem;
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
    color: green;
  }
</style>

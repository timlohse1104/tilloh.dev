<script lang="ts">
  import { onMount } from 'svelte';
  import NavigationEntry from './NavigationEntry.svelte';

  export let routes;

  const routeKeys = Object.keys(routes);
  const activeRouteKeys = routeKeys.filter((key) => routes[key].toggle);
  const applicationRoutesKeysHalf = Math.floor(activeRouteKeys.length / 2);
  const applicationRoutesKeysThird = Math.floor(activeRouteKeys.length / 3);
  let currentWidth;

  onMount(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });

  const updateWidth = () => {
    currentWidth = window.innerWidth;
  };
</script>

<section>
  {#if currentWidth > 1400}
    <div class="navigation_box">
      <nav>
        <ul>
          {#each activeRouteKeys as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth > 850}
    <div class="navigation_box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(0, applicationRoutesKeysHalf)] as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation_box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysHalf)] as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth < 850}
    <div class="navigation_box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(0, applicationRoutesKeysThird)] as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation_box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysThird, applicationRoutesKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation_box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} app={routes[appKey]} />
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</section>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin-top: 0;
  }

  .navigation_box {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  }

  nav {
    display: flex;
    justify-content: center;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
  }

  :global(li + li) {
    border-left: var(--lightgrey80) 1px solid;
  }
</style>

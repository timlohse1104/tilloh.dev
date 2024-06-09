<script>
  import { onMount } from 'svelte';
  import { routes } from '../../lib/config/applications';
  import NavigationEntry from './NavigationEntry.svelte';

  const routeKeys = Object.keys(routes);
  const filteredRouteKeys = routeKeys.filter(
    (key) => key !== 'settings' && key !== 'admin',
  );
  const filteredRouteKeysHalf = Math.floor(filteredRouteKeys.length / 2);
  const filteredRouteKeysThird = Math.floor(filteredRouteKeys.length / 3);

  let currentWidth;

  function updateWidth() {
    currentWidth = window.innerWidth;
  }

  onMount(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  });
</script>

<section>
  {#if currentWidth > 1400}
    <div class="navigation-box">
      <nav>
        <ul>
          {#each filteredRouteKeys as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth > 850}
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...filteredRouteKeys.slice(0, filteredRouteKeysHalf)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...filteredRouteKeys.slice(filteredRouteKeysHalf)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth < 850}
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...filteredRouteKeys.slice(0, filteredRouteKeysThird)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...filteredRouteKeys.slice(filteredRouteKeysThird, filteredRouteKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...filteredRouteKeys.slice(filteredRouteKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</section>

<style lang="scss">
  @import '../../lib/styles/global.scss';

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin-top: 0;
  }

  .navigation-box {
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

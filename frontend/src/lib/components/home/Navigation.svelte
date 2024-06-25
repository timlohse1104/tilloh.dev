<script>
  import { applicationRoutes } from '$lib/config/applications';
  import { onMount } from 'svelte';
  import NavigationEntry from './NavigationEntry.svelte';

  const applicationRouteKeys = Object.keys(applicationRoutes);
  const activeRouteKeys = applicationRouteKeys.filter(
    (key) => applicationRoutes[key].toggle,
  );
  const applicationRoutesKeysHalf = Math.floor(activeRouteKeys.length / 2);
  const applicationRoutesKeysThird = Math.floor(activeRouteKeys.length / 3);

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
          {#each activeRouteKeys as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth > 850}
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(0, applicationRoutesKeysHalf)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysHalf)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {:else if currentWidth < 850}
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(0, applicationRoutesKeysThird)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysThird, applicationRoutesKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
    <div class="navigation-box">
      <nav>
        <ul>
          {#each [...activeRouteKeys.slice(applicationRoutesKeysThird * 2)] as appKey}
            <NavigationEntry {appKey} />
          {/each}
        </ul>
      </nav>
    </div>
  {/if}
</section>

<style lang="scss">
  @import '../../styles/variables.scss';

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

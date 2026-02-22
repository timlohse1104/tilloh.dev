<script lang="ts">
  // 1. IMPORTS
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Route } from '$lib/types/route';
  import { languageStore } from '$lib/util/stores/store-language';
  import ContentSwitcher from 'carbon-components-svelte/src/ContentSwitcher/ContentSwitcher.svelte';
  import Switch from 'carbon-components-svelte/src/ContentSwitcher/Switch.svelte';
  import { onMount } from 'svelte';

  // 2. PROPS
  let { routes, customClass = '' }: { routes: Route[]; customClass?: string } = $props();

  // 3. DERIVED
  const activeRoutes = $derived(routes.filter((routes) => routes.toggle));
  const routeHalfAmount = $derived(Math.floor(activeRoutes.length / 2));
  const activeRoutesFirstHalf = $derived([...activeRoutes.slice(0, routeHalfAmount)]);
  const activeRoutesSecondHalf = $derived([...activeRoutes.slice(routeHalfAmount)]);
  const routesThirdAmount = $derived(Math.floor(activeRoutes.length / 3));
  const activeRoutesOneThird = $derived([...activeRoutes.slice(0, routesThirdAmount)]);
  const activeRoutesSecondThird = $derived([
    ...activeRoutes.slice(routesThirdAmount, routesThirdAmount * 2),
  ]);
  const activeRoutesThirdThird = $derived([...activeRoutes.slice(routesThirdAmount * 2)]);

  // 4. STATE
  let selectedIndex = $state(0);
  let selectedIndexFirstHalf = $state(0);
  let selectedIndexSecondHalf = $state<number | undefined>(undefined);
  let selectedIndexOneThird = $state(0);
  let selectedIndexSecondThird = $state<number | undefined>(undefined);
  let selectedIndexThirdThird = $state<number | undefined>(undefined);
  let currentWidth = $state<number | undefined>(undefined);

  const locale = $derived($languageStore);

  // 5. LIFECYCLE
  onMount(() => {
    updateWidth();
    updateIndexes();
    window.addEventListener('resize', () => {
      updateWidth();
      updateIndexes();
    });
    return () => {
      window.removeEventListener('resize', () => {
        updateWidth();
        updateIndexes();
      });
    };
  });

  // 6. FUNCTIONS
  const navigatePage = (path: string) => {
    goto(path);
    updateIndexes(path);
  };

  const updateWidth = () => {
    currentWidth = window.innerWidth;
  };

  const resetIndexes = () => {
    selectedIndex = 0;
    selectedIndexFirstHalf = 0;
    selectedIndexSecondHalf = undefined;
    selectedIndexOneThird = 0;
    selectedIndexSecondThird = undefined;
    selectedIndexThirdThird = undefined;
  };

  const updateIndexes = (inputPath?: string) => {
    const path = inputPath || $page.url.pathname;
    resetIndexes();
    if (currentWidth && currentWidth > 1400) {
      selectedIndex = Object.values(activeRoutes).findIndex(
        (route) => route.path === path,
      );
      selectedIndexFirstHalf = 0;
      selectedIndexSecondHalf = undefined;
      selectedIndexOneThird = 0;
      selectedIndexSecondThird = undefined;
      selectedIndexThirdThird = undefined;
    } else if (currentWidth && currentWidth > 850) {
      selectedIndexFirstHalf = Object.values(activeRoutesFirstHalf).findIndex(
        (route) => route.path === path,
      );
      if (selectedIndexFirstHalf === -1) {
        selectedIndexSecondHalf = Object.values(
          activeRoutesSecondHalf,
        ).findIndex((route) => route.path === path);
      } else if (selectedIndexSecondHalf === -1) {
        selectedIndexFirstHalf = 0;
      } else {
        selectedIndexSecondHalf = -1;
      }
      selectedIndex = 0;
      selectedIndexOneThird = 0;
      selectedIndexSecondThird = undefined;
      selectedIndexThirdThird = undefined;
    } else if (currentWidth && currentWidth < 850) {
      selectedIndexOneThird = Object.values(activeRoutesOneThird).findIndex(
        (route) => route.path === path,
      );
      if (selectedIndexOneThird === -1) {
        selectedIndexSecondThird = Object.values(
          activeRoutesSecondThird,
        ).findIndex((route) => route.path === path);
      } else if (selectedIndexSecondThird === -1) {
        selectedIndexThirdThird = Object.values(
          activeRoutesThirdThird,
        ).findIndex((route) => route.path === path);
      } else if (selectedIndexThirdThird === -1) {
        selectedIndexOneThird = 0;
      } else {
        selectedIndexSecondThird = -1;
        selectedIndexThirdThird = -1;
      }
      selectedIndex = 0;
      selectedIndexFirstHalf = 0;
      selectedIndexSecondHalf = undefined;
    }
  };
</script>

<section class={customClass}>
  <ContentSwitcher {selectedIndex}>
    {#each Object.values(activeRoutes) as route}
      <Switch on:click={() => navigatePage(route.path)}>
        <div class="navigation_item_content">
          {#if route?.icon}
            {@const Icon = route.icon}
            <Icon />
          {/if}
          {route.name[locale]}
        </div>
      </Switch>
    {/each}
  </ContentSwitcher>
</section>

<style lang="scss">
  @use '../../styles/variables.scss' as *;

  section {
    width: 100%;

    @media #{$tablet} {
      margin-bottom: 2rem;
    }

    @media #{$phone} {
      margin-bottom: 4rem;
    }
  }

  .navigation_item_content {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>

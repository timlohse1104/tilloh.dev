<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import type { Route } from '$lib/types/route';
  import { languageStore } from '$lib/util/stores/store-language';
  import { ContentSwitcher, Switch } from 'carbon-components-svelte';
  import { onMount } from 'svelte';

  // EXPORT LET
  export let routes: Route[];
  export let customClass = '';

  // CONST
  const activeRoutes = routes.filter((routes) => routes.toggle);
  const routeHalfAmount = Math.floor(activeRoutes.length / 2);
  const activeRoutesFirstHalf = [...activeRoutes.slice(0, routeHalfAmount)];
  const activeRoutesSecondHalf = [...activeRoutes.slice(routeHalfAmount)];
  const routesThirdAmount = Math.floor(activeRoutes.length / 3);
  const activeRoutesOneThird = [...activeRoutes.slice(0, routesThirdAmount)];
  const activeRoutesSecondThird = [
    ...activeRoutes.slice(routesThirdAmount, routesThirdAmount * 2),
  ];
  const activeRoutesThirdThird = [...activeRoutes.slice(routesThirdAmount * 2)];

  // LET
  let selectedIndex = 0;
  let selectedIndexFirstHalf = 0;
  let selectedIndexSecondHalf = undefined;
  let selectedIndexOneThird = 0;
  let selectedIndexSecondThird = undefined;
  let selectedIndexThirdThird = undefined;
  let currentWidth;

  // $
  $: locale = $languageStore;

  // MOUNTING
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

  // FUNCTIONS
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
    if (currentWidth > 1400) {
      selectedIndex = Object.values(activeRoutes).findIndex(
        (route) => route.path === path,
      );
      selectedIndexFirstHalf = 0;
      selectedIndexSecondHalf = undefined;
      selectedIndexOneThird = 0;
      selectedIndexSecondThird = undefined;
      selectedIndexThirdThird = undefined;
    } else if (currentWidth > 850) {
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
    } else if (currentWidth < 850) {
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
      {#await import(
        /* @vite-ignore */
        `/node_modules/carbon-icons-svelte/lib/${route?.icon}.svelte`
        ) then icon}
        <Switch on:click={() => navigatePage(route.path)}>
          <div class="navigation_item_content">
            <svelte:component this={icon.default} />
            {route.name[locale]}
          </div>
        </Switch>
      {/await}
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

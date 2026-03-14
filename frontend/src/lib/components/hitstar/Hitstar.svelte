<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Tab from 'carbon-components-svelte/src/Tabs/Tab.svelte';
  import TabContent from 'carbon-components-svelte/src/Tabs/TabContent.svelte';
  import Tabs from 'carbon-components-svelte/src/Tabs/Tabs.svelte';
  import HitstarClassic from './HitstarClassic.svelte';
  import HitstarRange from './HitstarRange.svelte';

  // 4. STATE
  let selectedTab = $state(0);
  let classicActive = $state(false);
  let rangeActive = $state(false);

  // 5. DERIVED
  const gameActive = $derived(
    (selectedTab === 0 && classicActive) || (selectedTab === 1 && rangeActive),
  );
</script>

{#if $initialized}
  <div class="hitstar-container" class:game-active={gameActive}>
    <Tabs bind:selected={selectedTab}>
      <Tab label={$t('page.hitstar.tabs.classic')} />
      <Tab label={$t('page.hitstar.tabs.range')} />
      <svelte:fragment slot="content">
        <TabContent>
          <HitstarClassic bind:gameActive={classicActive} />
        </TabContent>
        <TabContent>
          <HitstarRange bind:gameActive={rangeActive} />
        </TabContent>
      </svelte:fragment>
    </Tabs>
  </div>
{/if}

<style>
  .hitstar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    box-sizing: border-box;
    width: 100%;
  }

  /* Tabs always visible as horizontal bar, no dropdown */
  .hitstar-container :global(.bx--tabs-trigger) {
    display: none;
  }

  .hitstar-container :global(.bx--tabs__nav--hidden) {
    display: flex !important;
  }

  /* Full-width tab nav */
  .hitstar-container :global(.bx--tabs) {
    width: 100%;
  }

  .hitstar-container :global(.bx--tabs__nav) {
    width: 100%;
  }

  /* TabContent padding */
  .hitstar-container :global(.bx--tab-content) {
    padding: 0;
  }

  /* Hide tabs during active game */
  .game-active :global(.bx--tabs) {
    display: none;
  }
</style>

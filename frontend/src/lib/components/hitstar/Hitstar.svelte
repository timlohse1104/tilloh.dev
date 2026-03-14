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
    flex-direction: row !important;
    max-height: unset !important;
    overflow: visible !important;
    position: static !important;
  }

  /* Full-width tab container, nav centered and only as wide as its items */
  .hitstar-container :global(.bx--tabs) {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .hitstar-container :global(.bx--tabs__nav) {
    width: fit-content;
  }

  .hitstar-container :global(.bx--tabs__nav-item) {
    display: flex !important;
    flex: unset;
  }

  /* Active tab indicator (Carbon hides selected item on mobile by default) */
  .hitstar-container :global(.bx--tabs__nav-item--selected .bx--tabs__nav-link) {
    border-bottom: 2px solid var(--cds-interactive-04, #0f62fe) !important;
    color: var(--cds-text-01, #f4f4f4) !important;
    font-weight: 600;
  }

  /* Remove focus ring on tab links — selection shown by bottom border only */
  .hitstar-container :global(.bx--tabs__nav-link:focus),
  .hitstar-container :global(.bx--tabs__nav-link:active) {
    outline: none;
    box-shadow: none;
  }

  /* Prevent Carbon from resizing tab links on focus/active on mobile
     (Carbon sets width:100%, padding-left:16px, margin:0 which causes visual shift) */
  @media (max-width: 41.9375rem) {
    .hitstar-container :global(.bx--tabs__nav-link:focus),
    .hitstar-container :global(.bx--tabs__nav-link:active) {
      width: calc(100% - 32px) !important;
      padding-left: 0 !important;
      margin: 0 var(--cds-spacing-05, 1rem) !important;
    }
  }

  /* Margin between tab bar and mode content */
  .hitstar-container :global(.bx--tab-content) {
    padding: 0;
    margin-top: calc(2 * var(--default_padding));
  }

  /* Hide tabs during active game */
  .game-active :global(.bx--tabs) {
    display: none;
  }
</style>

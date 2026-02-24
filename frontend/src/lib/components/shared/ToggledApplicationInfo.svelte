<script lang="ts">
  // 1. IMPORTS
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Construction from 'carbon-icons-svelte/lib/Construction.svelte';
  import Home from 'carbon-icons-svelte/lib/Home.svelte';
</script>

{#if $initialized}
  <div class="toggled_application_info_outer">
    <div class="toggled_application_info_inner">
      <Construction size={32} class="mb1" />
      <h2>{$t('page.shared.toggledSiteHeadline')}</h2>
      <p>{$t('page.shared.toggledSiteTryAgainText')}</p>
      <div class="mt2">
        <Button
          iconDescription={$t('page.shared.toggledSiteBackButtonText')}
          kind="tertiary"
          icon={Home}
          href="/"
        >
          {$t('page.shared.toggledSiteBackButtonText')}
        </Button>
      </div>
    </div>
  </div>
{:else}
  <div class="toggled_application_info_outer">Locale initializing...</div>
{/if}

<style lang="scss">
  .toggled_application_info_outer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }

  .toggled_application_info_inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.toggled_application_icon) {
    font-size: 5rem;
  }
</style>

<script lang="ts">
  import type { AdminDashboardPropsDto } from '$lib/types/admin.dto';
  import { initialized, t } from '$lib/util/translations';
  import IconButton from '@smui/icon-button';
  import { createEventDispatcher } from 'svelte';
  import DashboardCard from './DashboardCard.svelte';

  export let metrics: AdminDashboardPropsDto = {
    identifierAmount: 0,
    presetAmounts: 0,
    presetFolderAmount: 0,
    presetLinksAmount: 0,
    jokesAmount: 0,
    chatsAmount: 0,
    apiIsHealthy: false,
    jokesIsHealthy: false,
    mongoIsHealthy: false,
    duplicateJokesAmount: 0,
    duplicateFoldersAmount: 0,
    duplicateLinksAmount: 0,
  };
  const dispatch = createEventDispatcher();
</script>

{#if $initialized}
  <section>
    <div class="dashboard-header">
      <h1>{$t('page.admin.dashboard.title')}</h1>
      <IconButton
        class="material-icons"
        on:click={() => dispatch('updateDashboard')}>refresh</IconButton
      >
    </div>
    <div class="dashboard-content">
      <DashboardCard
        header="TillohAPI"
        description={$t('page.admin.dashboard.tillohApiDescription')}
        status={metrics.apiIsHealthy}
      />
      <DashboardCard
        header="MongoDB"
        description={$t('page.admin.dashboard.mongoDbDescription')}
        status={metrics.mongoIsHealthy}
      />
      <DashboardCard
        header="WitzAPI"
        description={$t('page.admin.dashboard.witzApiDescription')}
        status={metrics.jokesIsHealthy}
      />
      <DashboardCard
        header="Identifiers"
        description={$t('page.admin.dashboard.identifiersDescription')}
        amount={metrics.identifierAmount}
      />
      <DashboardCard
        header="Presets"
        description={$t('page.admin.dashboard.presetsDescription')}
        amount={metrics.presetAmounts}
      />
      <DashboardCard
        header="Folders"
        description={$t('page.admin.dashboard.foldersDescription')}
        amount={metrics.presetFolderAmount}
      />
      <DashboardCard
        header="Duplicate folders"
        description={$t('page.admin.dashboard.duplicateFoldersDescription')}
        amount={metrics.duplicateFoldersAmount}
      />
      <DashboardCard
        header="Links"
        description={$t('page.admin.dashboard.linksDescription')}
        amount={metrics.presetLinksAmount}
      />
      <DashboardCard
        header="Duplicate links"
        description={$t('page.admin.dashboard.duplicateLinksDescription')}
        amount={metrics.duplicateLinksAmount}
      />
      <DashboardCard
        header="Jokes"
        description={$t('page.admin.dashboard.jokesDescription')}
        amount={metrics.jokesAmount}
      />
      <DashboardCard
        header="Duplicate jokes"
        description={$t('page.admin.dashboard.duplicateJokesDescription')}
        amount={metrics.duplicateJokesAmount}
      />
      <DashboardCard
        header="Chats"
        description={$t('page.admin.dashboard.chatsDescription')}
        amount={metrics.chatsAmount}
      />
    </div>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  .dashboard-header {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 1rem;

    h1 {
      margin: 0;
    }
  }

  .dashboard-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    max-width: 90vw;
    flex-wrap: wrap;
    justify-content: start;
  }
</style>

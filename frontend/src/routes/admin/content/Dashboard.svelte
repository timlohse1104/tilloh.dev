<script lang="ts">
  import type { AdminDashboardPropsDto } from '$lib/types/admin.dto';
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
  };
  const dispatch = createEventDispatcher();
</script>

<section>
  <div class="dashboard-header">
    <h1>Dashboard</h1>
    <IconButton
      class="material-icons"
      on:click={() => dispatch('updateDashboard')}>refresh</IconButton
    >
  </div>
  <div class="dashboard-content">
    <DashboardCard
      header="TillohAPI"
      description="tilloh.dev API status"
      status={metrics.apiIsHealthy}
    />
    <DashboardCard
      header="MongoDB"
      description="MongoDB status"
      status={metrics.mongoIsHealthy}
    />
    <DashboardCard
      header="WitzAPI"
      description="Jokes API status"
      status={metrics.jokesIsHealthy}
    />
    <DashboardCard
      header="Identifiers"
      description="People using online storage"
      amount={metrics.identifierAmount}
    />
    <DashboardCard
      header="Presets"
      description="Saved memorandum presets"
      amount={metrics.presetAmounts}
    />
    <DashboardCard
      header="Folders"
      description="Saved memorandum folders"
      amount={metrics.presetFolderAmount}
    />
    <DashboardCard
      header="Links"
      description="Saved memorandum links"
      amount={metrics.presetLinksAmount}
    />
    <DashboardCard
      header="Jokes"
      description="Displayed daily jokes"
      amount={metrics.jokesAmount}
    />
    <DashboardCard
      header="Chats"
      description="Communication channels"
      amount={metrics.chatsAmount}
    />
  </div>
</section>

<style lang="scss">
  .dashboard-header {
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 0;

    h1 {
      margin-top: 0;
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

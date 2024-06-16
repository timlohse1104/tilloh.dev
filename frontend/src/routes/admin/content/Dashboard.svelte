<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { createEventDispatcher } from 'svelte';
  import DashboardCard from './DashboardCard.svelte';

  export let identifierAmount: number;
  export let presetAmounts: number;
  export let presetFolderAmount: number;
  export let presetLinksAmount: number;
  const dispatch = createEventDispatcher();
</script>

<section>
  <div class="dashboard-header">
    <h2>Dashboard</h2>
    <IconButton
      class="material-icons"
      on:click={() => dispatch('updateDashboard')}>refresh</IconButton
    >
  </div>
  <div class="dashboard-content">
    <DashboardCard
      header="Identifiers"
      description="People using online storage"
      amount={identifierAmount}
    />
    <DashboardCard
      header="Presets"
      description="Saved memorandum presets"
      amount={presetAmounts}
    />
    <DashboardCard
      header="Folders"
      description="Saved memorandum folders"
      amount={presetFolderAmount}
    />
    <DashboardCard
      header="Links"
      description="Saved memorandum folders"
      amount={presetLinksAmount}
    />
  </div>
</section>

<style lang="scss">
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .dashboard-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    max-width: 90vw;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

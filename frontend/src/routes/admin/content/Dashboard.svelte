<script lang="ts">
  import DashboardCard from './DashboardCard.svelte';
  export let identifierAmount: number;
  export let presetAmounts: number;
  export let presetFolderAmount: number;
  export let presetLinksAmount: number;
</script>

<section>
  <h2>Dashboard</h2>
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
  .dashboard-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    max-width: 90vw;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

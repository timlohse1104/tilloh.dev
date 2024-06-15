<script lang="ts">
  import Card, { Content } from '@smui/card';
  export let identifierAmount: number;
  export let presetAmounts: number;
</script>

<section>
  <h2>Dashboard</h2>
  <div class="dashboard-content">
    <Card class="admin-dashboard-card">
      <Content>
        <div class="card-headline">
          <h2>Identifiers</h2>
          <p>People using online storage</p>
        </div>
        <p class="card-amount">{identifierAmount}</p></Content
      >
    </Card>
    <Card class="admin-dashboard-card">
      <Content>
        <div class="card-headline">
          <h2>Memorandum</h2>
          <p>Saved link presets</p>
        </div>
        <p class="card-amount">{presetAmounts}</p></Content
      >
    </Card>
  </div>
</section>

<style lang="scss">
  :global(.admin-dashboard-card) {
    width: 100%;
    min-width: 200px;
    min-height: 200px;
    background-color: var(--color-bg-2);
  }
  .dashboard-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
  }

  .card-headline {
    p {
      font-size: 0.8rem;
    }
  }
  .card-amount {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0;
  }
</style>

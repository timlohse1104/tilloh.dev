<script lang="ts">
  import Card, { Content } from '@smui/card';
  export let identifierAmount: number;
  export let presetAmounts: number;
</script>

<section>
  <h2>Dashboard</h2>
  <div class="dashboard-content">
    <Card style="background-color:var(--color-bg-2);">
      <Content>
        <div class="card-headline">
          <h3>Identifiers</h3>
          <p>People using online storage</p>
        </div>
        <p class="card-amount">{identifierAmount}</p></Content
      >
    </Card>
    <Card style="background-color:var(--color-bg-2);">
      <Content>
        <div class="card-headline">
          <h3>Memorandum</h3>
          <p>Saved link presets</p>
        </div>
        <p class="card-amount">{presetAmounts}</p></Content
      >
    </Card>
  </div>
</section>

<style lang="scss">
  .dashboard-content {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
  }

  .card-headline {
    h3 {
      margin-bottom: 0;
    }
    p {
      margin-top: 0;
      font-size: 0.8rem;
    }
  }
  .card-amount {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
</style>

<script lang="ts">
  import Card, { Content } from '@smui/card';

  export let header: string;
  export let description: string;
  export let amount: number = undefined;
  export let status: boolean = undefined;
</script>

<Card class="admin-dashboard-card">
  <Content class="admin-dashboard-card-content">
    <div class="card-headline">
      <h2>{header}</h2>
      <p>{description}</p>
    </div>
    {#if amount === undefined}
      <p class="card-value">{!!status ? '🟢' : '🔴'}</p>
    {:else}
      <p class="card-value">{amount}</p>
    {/if}
  </Content>
</Card>

<style lang="scss">
  :global(.admin-dashboard-card) {
    width: 11rem;
    height: 11rem;
    background-color: var(--color-bg-2);
    display: flex;
  }

  :global(.admin-dashboard-card-content) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .card-headline {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 9;
    // border-bottom: 1px solid var(--color-bg-1);

    h2 {
      font-size: 1.25rem;
      margin: 0;
    }

    p {
      font-size: 0.65rem;
      margin: 0;
    }
  }

  .card-headline::after {
    content: '';
    position: relative;
    left: 25%;
    bottom: -1rem;
    width: 50%;
    height: 1px;
    background-color: var(--color-bg-1);
    transform: translateX(-50%);
  }

  .card-value {
    font-size: 2.25rem;
    margin: 1rem;
    flex-grow: 1;
  }
</style>

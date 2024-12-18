<script lang="ts">
  import Card, { Content } from '@smui/card';

  export let header: string;
  export let description: string;
  export let amount: number = undefined;
  export let status: boolean = undefined;
</script>

<Card class="admin_dashboard_card">
  <Content class="admin_dashboard_card_content">
    <div class="card_headline">
      <h2>{header}</h2>
      <p>{description}</p>
    </div>
    {#if amount === undefined}
      <p class="card_value">{!!status ? '🟢' : '🔴'}</p>
    {:else}
      <p class="card_value">{amount}</p>
    {/if}
  </Content>
</Card>

<style lang="scss">
  :global(.admin_dashboard_card) {
    width: 11rem;
    height: 11rem;
    background-color: var(--color-bg-2);
    display: flex;
  }

  :global(.admin_dashboard_card_content) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .card_headline {
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

  .card_headline::after {
    content: '';
    position: relative;
    left: 25%;
    bottom: -1rem;
    width: 50%;
    height: 1px;
    background-color: var(--color-bg-1);
    transform: translateX(-50%);
  }

  .card_value {
    font-size: 2.25rem;
    margin: 1rem;
    flex-grow: 1;
  }
</style>

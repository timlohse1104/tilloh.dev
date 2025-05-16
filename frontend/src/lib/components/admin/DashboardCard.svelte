<script lang="ts">
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';

  export let header: string;
  export let description: string;
  export let amount: number = undefined;
  export let status: boolean = undefined;
</script>

<Tile class="admin_dashboard_card">
  <div class="admin_dashboard_card_content">
    <div class="card_headline">
      <h2>{header}</h2>
      <p>{description}</p>
    </div>
    {#if amount !== undefined}
      <p class="card_value">{amount}</p>
    {:else if status !== undefined}
      <p class="card_value">{!!status ? '🟢' : '🔴'}</p>
    {:else}
      <div class="card_slot">
        <slot></slot>
      </div>
    {/if}
  </div>
</Tile>

<style lang="scss">
  :global(.admin_dashboard_card) {
    width: 9rem;
    height: 9rem;
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

    h2 {
      text-align: center;
      font-size: 1rem;
      margin-bottom: 0.25rem;
      margin-top: 0.5rem;
    }

    p {
      text-align: center;
      font-size: 0.5rem;
      margin: 0;
    }
  }

  .card_headline::after {
    position: relative;
    left: 25%;
    bottom: -1rem;
    width: 50%;
    height: 1px;
    transform: translateX(-50%);
  }

  .card_value {
    font-size: 2.25rem;
    margin: 0.5rem;
    flex-grow: 1;
    text-align: center;
  }

  .card_slot {
    display: flex;
    justify-content: center;
  }
</style>

<script lang="ts">
  // 1. IMPORTS
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import Exit from 'carbon-icons-svelte/lib/Exit.svelte';

  // 2. PROPS
  let {
    headline,
    abortLabel,
    onAbort,
  }: { headline: string; abortLabel: string; onAbort: () => void } = $props();
</script>

<div class="game-top-bar">
  <h2 class="game-question">{headline}</h2>
  <Button
    kind="danger"
    size="small"
    icon={Exit}
    iconDescription={abortLabel}
    tooltipPosition="left"
    on:click={onAbort}
  />
</div>

<style>
  .game-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 0.75rem;
  }

  .game-question {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    flex: 1;
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    .game-question {
      font-size: 0.9rem;
    }
  }
</style>

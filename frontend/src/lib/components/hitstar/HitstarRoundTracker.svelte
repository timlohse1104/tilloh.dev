<script lang="ts">
  // 1. IMPORTS
  import type { HitstarRoundResult } from '$lib/types/spotify.dto';

  // 2. PROPS
  let { totalRounds, roundResults }: { totalRounds: number; roundResults: HitstarRoundResult[] } =
    $props();
</script>

<div class="round-tracker">
  {#each { length: totalRounds } as _, i}
    {@const roundNum = i + 1}
    {@const result = roundResults.find((r) => r.round === roundNum)}
    <div
      class="round-dot"
      class:correct={result?.correct === true}
      class:wrong={result?.correct === false}
    ></div>
  {/each}
</div>

<style>
  .round-tracker {
    display: flex;
    gap: 5px;
    width: 100%;
  }

  .round-dot {
    flex: 1;
    height: 10px;
    border-radius: 3px;
    background: var(--cds-layer-02, #393939);
    border: 1px solid var(--cds-border-subtle-01, #525252);
    transition:
      background 0.3s,
      border-color 0.3s;
  }

  .round-dot.correct {
    background: var(--cds-support-success, #24a148);
    border-color: var(--cds-support-success, #24a148);
  }

  .round-dot.wrong {
    background: var(--cds-support-error, #da1e28);
    border-color: var(--cds-support-error, #da1e28);
  }

  @media (max-width: 480px) {
    .round-dot {
      height: 6px;
    }
  }
</style>

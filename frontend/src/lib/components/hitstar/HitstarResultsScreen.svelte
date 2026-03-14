<script lang="ts">
  // 1. IMPORTS
  import type { Snippet } from 'svelte';
  import type { HitstarRoundResult } from '$lib/types/spotify.dto';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import { t } from '$lib/util/translations';

  // 2. PROPS
  let {
    score,
    maxScore,
    isNewBestScore,
    roundResults,
    onPlayAgain,
    guessDisplay,
  }: {
    score: number;
    maxScore: number;
    isNewBestScore: boolean;
    roundResults: HitstarRoundResult[];
    onPlayAgain: () => void;
    guessDisplay: Snippet<[HitstarRoundResult]>;
  } = $props();
</script>

<div class="results-screen">
  <div class="results-top-section">
    <h1>{$t('page.hitstar.results.headline')}</h1>
    <p class="score-summary">{score} / {maxScore}</p>
    {#if isNewBestScore && score > 0}
      <InlineNotification
        kind="success"
        title={$t('page.hitstar.results.newRecord')}
        hideCloseButton
      />
    {/if}
  </div>

  <div class="results-middle-section">
    <div class="results-table">
      {#each roundResults as result}
        <Tile class="result-tile {result.correct ? 'correct' : 'wrong'}">
          <div class="result-row">
            <div
              class="result-indicator"
              class:indicator-correct={result.correct}
              class:indicator-wrong={!result.correct}
            ></div>
            <div class="result-content">
              <span class="result-round"
                >{$t('page.hitstar.results.round', {
                  round: String(result.round),
                })}</span
              >
              <span class="result-track">{result.track.name} – {result.track.artist}</span>
            </div>
          </div>
          <div class="result-years">
            {@render guessDisplay(result)}
            <span
              >{$t('page.hitstar.results.correctYear', {
                year: String(result.track.releaseYear),
              })}</span
            >
          </div>
        </Tile>
      {/each}
    </div>
  </div>

  <div class="bottom-action">
    <Button on:click={onPlayAgain}>{$t('page.hitstar.results.playAgain')}</Button>
  </div>
</div>

<style>
  .results-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
  }

  .results-top-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding-bottom: 0.75rem;
  }

  .score-summary {
    font-size: 1.4rem;
    font-weight: bold;
    margin: 0;
    color: var(--cds-text-primary);
  }

  .results-middle-section {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding-right: 2px;
  }

  .results-table {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  :global(.result-tile.correct) {
    border-left: 4px solid #24a148 !important;
  }

  :global(.result-tile.wrong) {
    border-left: 4px solid #da1e28 !important;
  }

  .result-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .result-indicator {
    width: 14px;
    height: 14px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .indicator-correct {
    background: #24a148;
  }

  .indicator-wrong {
    background: #da1e28;
  }

  .result-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  .result-round {
    font-weight: bold;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .result-track {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9rem;
    color: var(--cds-text-secondary);
  }

  .result-years {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--cds-text-secondary);
    margin-top: 0.25rem;
    padding-left: 1.75rem;
    flex-wrap: wrap;
  }

  .bottom-action {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>

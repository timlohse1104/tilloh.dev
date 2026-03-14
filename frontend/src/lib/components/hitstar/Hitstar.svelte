<script lang="ts">
  // 1. IMPORTS
  import { getRandomTrack } from '$lib/api/spotify.api';
  import type {
    HitstarBestRound,
    HitstarRoundResult,
    SpotifyTrackDto,
  } from '$lib/types/spotify.dto';
  import {
    hitstarBestRoundStore,
    hitstarGameStateStore,
  } from '$lib/util/stores/store-hitstar';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { initialized, t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  import ProgressBar from 'carbon-components-svelte/src/ProgressBar/ProgressBar.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import ContinueFilled from 'carbon-icons-svelte/lib/ContinueFilled.svelte';
  import Exit from 'carbon-icons-svelte/lib/Exit.svelte';
  import { onMount } from 'svelte';
  import HitstarCard from './HitstarCard.svelte';

  // 3. CONST
  type GameState = 'MENU' | 'LOADING' | 'GUESSING' | 'REVEAL' | 'RESULTS';
  const TOTAL_ROUNDS = 10;
  const roundIndices = Array(TOTAL_ROUNDS).fill(0);

  // 4. STATE
  let gameState = $state<GameState>('MENU');
  let currentRound = $state(1);
  let score = $state(0);
  let currentTrack = $state<SpotifyTrackDto | null>(null);
  let guessedYear = $state<number>(2000);
  let roundResults = $state<HitstarRoundResult[]>([]);
  let isCorrect = $state(false);
  let isCardFlipped = $state(false);
  let errorMessage = $state('');
  let isShaking = $state(false);

  // 5. DERIVED
  const bestRound = $derived($hitstarBestRoundStore);
  const isNewBestScore = $derived(!bestRound || score > bestRound.score);
  const savedGameState = $derived($hitstarGameStateStore);

  // 7. LIFECYCLE
  onMount(() => {
    // Restore game state if available (e.g. browser was closed mid-game)
    if (savedGameState) {
      currentRound = savedGameState.currentRound;
      score = savedGameState.score;
      currentTrack = savedGameState.currentTrack;
      roundResults = savedGameState.roundResults;
      // Resume at GUESSING if there's a current track, otherwise MENU
      if (currentTrack) {
        isCardFlipped = false;
        gameState = 'GUESSING';
      }
    }
  });

  // 8. FUNCTIONS
  const persistGameState = () => {
    hitstarGameStateStore.set({
      currentRound,
      score,
      currentTrack,
      roundResults,
    });
  };

  const clearPersistedGameState = () => {
    hitstarGameStateStore.set(null);
  };

  const startGame = () => {
    gameState = 'LOADING';
    currentRound = 1;
    score = 0;
    roundResults = [];
    guessedYear = 2000;
    errorMessage = '';
    isCardFlipped = false;
    currentTrack = null;
    fetchNextTrack();
  };

  const fetchNextTrack = async () => {
    gameState = 'LOADING';
    errorMessage = '';
    try {
      currentTrack = await getRandomTrack();
      isCardFlipped = false;
      persistGameState();
      gameState = 'GUESSING';
    } catch {
      errorMessage = 'Failed to load track. Please try again.';
      gameState = 'MENU';
    }
  };

  const submitGuess = () => {
    if (!currentTrack) return;

    const correct = guessedYear === currentTrack.releaseYear;
    isCorrect = correct;

    if (correct) {
      score += 1;
      celebrate();
    } else {
      isShaking = true;
      setTimeout(() => {
        isShaking = false;
      }, 500);
    }

    roundResults = [
      ...roundResults,
      {
        round: currentRound,
        track: currentTrack,
        guessedYear,
        correct,
      },
    ];

    isCardFlipped = true;
    gameState = 'REVEAL';
  };

  const nextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      currentRound += 1;
      guessedYear = 2000;
      fetchNextTrack();
    } else {
      updateBestRound();
      clearPersistedGameState();
      gameState = 'RESULTS';
    }
  };

  const updateBestRound = () => {
    if (isNewBestScore && score > 0) {
      const newBest: HitstarBestRound = {
        score,
        date: new Date().toLocaleDateString('de-DE'),
      };
      hitstarBestRoundStore.set(newBest);
    }
  };

  const goToMenu = () => {
    clearPersistedGameState();
    gameState = 'MENU';
    currentTrack = null;
    isCardFlipped = false;
    roundResults = [];
    score = 0;
    currentRound = 1;
  };
</script>

{#if $initialized}
  <div class="hitstar-container">
    <!-- MENU STATE -->
    {#if gameState === 'MENU'}
      <div class="menu-screen">
        <h1 class="headline">{$t('page.hitstar.menu.headline')}</h1>
        <p class="description">{$t('page.hitstar.menu.description')}</p>

        <Tile class="best-score-tile">
          <p class="best-score-label">{$t('page.hitstar.menu.bestScore')}</p>
          {#if bestRound}
            <p class="best-score-value">
              {$t('page.hitstar.menu.bestScoreValue', {
                score: String(bestRound.score),
                date: bestRound.date,
              })}
            </p>
          {:else}
            <p class="best-score-empty">{$t('page.hitstar.menu.noScore')}</p>
          {/if}
        </Tile>

        {#if errorMessage}
          <InlineNotification
            kind="error"
            title={errorMessage}
            hideCloseButton
          />
        {/if}

        {#if savedGameState}
          <InlineNotification
            kind="info"
            title={$t('page.hitstar.menu.resumeInfo')}
            hideCloseButton
          />
          <Button on:click={startGame} kind="secondary">
            {$t('page.hitstar.menu.startGame')}
          </Button>
        {:else}
          <Button on:click={startGame}
            >{$t('page.hitstar.menu.startGame')}</Button
          >
        {/if}
      </div>

      <!-- LOADING STATE -->
    {:else if gameState === 'LOADING'}
      <div class="loading-screen">
        <p>{$t('page.hitstar.loading.headline')}</p>
        <ProgressBar helperText="" />
      </div>

      <!-- GUESSING STATE -->
    {:else if gameState === 'GUESSING'}
      <div class="guessing-screen">
        <!-- TOP: Headline + Exit + Round tracker -->
        <div class="game-top-section">
          <div class="game-top-bar">
            <h2 class="game-question">
              {$t('page.hitstar.guessing.cardHint')}
            </h2>
            <Button
              kind="danger"
              size="small"
              icon={Exit}
              iconDescription={$t('page.hitstar.abort')}
              tooltipPosition="left"
              on:click={goToMenu}
            />
          </div>
          <div class="round-tracker">
            {#each roundIndices as _, i}
              {@const roundNum = i + 1}
              {@const result = roundResults.find((r) => r.round === roundNum)}
              <div
                class="round-dot"
                class:correct={result?.correct === true}
                class:wrong={result?.correct === false}
              ></div>
            {/each}
          </div>
        </div>

        <!-- MIDDLE: Card + Audio (centered vertically) -->
        <div class="game-middle-section">
          <HitstarCard flipped={false} track={null} />
          {#if currentTrack?.previewUrl}
            <audio
              controls
              autoplay
              src={currentTrack.previewUrl}
              class="audio-player"
              aria-label={$t('page.hitstar.guessing.listeningHint')}
            ></audio>
          {/if}
        </div>

        <!-- BOTTOM: Year input + Submit -->
        <div class="input-submit-row">
          <div class="input-wrapper">
            <NumberInput
              labelText={$t('page.hitstar.guessing.yearLabel')}
              placeholder={$t('page.hitstar.guessing.yearPlaceholder')}
              bind:value={guessedYear}
              min={1950}
              max={2026}
            />
          </div>
          <Button
            icon={ContinueFilled}
            iconDescription={$t('page.hitstar.guessing.submitButton')}
            tooltipPosition="top"
            on:click={submitGuess}
            disabled={!guessedYear}
          />
        </div>
      </div>

      <!-- REVEAL STATE -->
    {:else if gameState === 'REVEAL'}
      <div class="reveal-screen">
        <!-- TOP: Headline + Exit + Round tracker -->
        <div class="game-top-section">
          <div class="game-top-bar">
            <h2 class="game-question">
              {$t('page.hitstar.guessing.headline', {
                round: String(currentRound),
              })}
            </h2>
            <Button
              kind="danger"
              size="small"
              icon={Exit}
              iconDescription={$t('page.hitstar.abort')}
              tooltipPosition="left"
              on:click={goToMenu}
            />
          </div>
          <div class="round-tracker">
            {#each roundIndices as _, i}
              {@const roundNum = i + 1}
              {@const result = roundResults.find((r) => r.round === roundNum)}
              <div
                class="round-dot"
                class:correct={result?.correct === true}
                class:wrong={result?.correct === false}
              ></div>
            {/each}
          </div>
        </div>

        <!-- MIDDLE: Card + Audio (centered vertically) -->
        <div class="game-middle-section">
          <div class:shake={isShaking}>
            <HitstarCard flipped={isCardFlipped} track={currentTrack} correct={isCorrect} />
          </div>

          {#if currentTrack?.previewUrl}
            <audio
              controls
              src={currentTrack.previewUrl}
              class="audio-player"
              aria-label="Song preview"
            ></audio>
          {/if}
        </div>

        <!-- BOTTOM: Next Round button -->
        <div class="bottom-action">
          <Button on:click={nextRound}>
            {currentRound < TOTAL_ROUNDS
              ? $t('page.hitstar.reveal.nextRound')
              : $t('page.hitstar.reveal.seeResults')}
          </Button>
        </div>
      </div>

      <!-- RESULTS STATE -->
    {:else if gameState === 'RESULTS'}
      <div class="results-screen">
        <!-- TOP: Headline + optional new-record -->
        <div class="results-top-section">
          <h1>{$t('page.hitstar.results.headline')}</h1>
          {#if isNewBestScore && score > 0}
            <InlineNotification
              kind="success"
              title={$t('page.hitstar.results.newRecord')}
              hideCloseButton
            />
          {/if}
        </div>

        <!-- MIDDLE: Round results -->
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
                    <span class="result-track"
                      >{result.track.name} – {result.track.artist}</span
                    >
                  </div>
                </div>
                <div class="result-years">
                  <span
                    >{$t('page.hitstar.results.yourGuess', {
                      year: String(result.guessedYear),
                    })}</span
                  >
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

        <!-- BOTTOM: Play Again -->
        <div class="bottom-action">
          <Button on:click={goToMenu}
            >{$t('page.hitstar.results.playAgain')}</Button
          >
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .hitstar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
    gap: 1.5rem;
    flex: 1;
    box-sizing: border-box;
  }

  .menu-screen,
  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

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

  .results-middle-section {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding-right: 2px;
  }

  .guessing-screen,
  .reveal-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex: 1;
  }

  /* ── Section layout within game screens ───────────────── */
  .game-top-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .game-middle-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--default_padding);
    width: 100%;
  }

  .bottom-action {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  /* ── Top bar: headline + exit button ─────────────────── */
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

  /* ── Round progress tracker ───────────────────────────── */
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

  /* ── Year input + submit inline ───────────────────────── */
  .input-submit-row {
    display: flex;
    align-items: flex-end;
    width: 100%;
    max-width: 360px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .input-wrapper {
    flex: 1;
    min-width: 0;
  }

  /* Force submit button to match NumberInput height (40px) and center icon */
  .input-submit-row :global(button) {
    height: 2.5rem;
    width: 2.5rem;
    min-height: unset;
    margin-left: 0;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .input-submit-row :global(button svg) {
    margin: 0;
    position: static;
  }

  /* ── Menu styles ──────────────────────────────────────── */
  .headline {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin: 0;
  }

  .description {
    text-align: center;
    color: var(--cds-text-secondary);
    margin: 0;
    max-width: 480px;
  }

  .best-score-label {
    font-size: 0.85rem;
    color: var(--cds-text-secondary);
    margin: 0 0 0.3rem;
  }

  .best-score-value,
  .best-score-empty {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0;
  }

  .best-score-empty {
    color: var(--cds-text-secondary);
  }

  /* ── Audio ────────────────────────────────────────────── */
  .audio-player {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
  }

  /* ── Results ──────────────────────────────────────────── */
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
  }

  /* ── Shake animation ──────────────────────────────────── */
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-5px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(5px);
    }
  }

  .shake {
    animation: shake 0.5s ease-in-out;
  }

  /* ── Mobile adjustments ───────────────────────────────── */
  @media (max-width: 480px) {
    .hitstar-container {
      padding: 0.5rem 0.75rem;
      gap: 0;
    }

    .game-top-section {
      gap: 0.5rem;
      padding-bottom: 0.25rem;
    }

    .game-question {
      font-size: 0.9rem;
    }

    .input-submit-row {
      max-width: 100%;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .bottom-action {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }

    .round-dot {
      height: 6px;
    }

    .audio-player {
      max-height: 40px;
    }
  }
</style>

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
  import { onMount } from 'svelte';
  import HitstarCard from './HitstarCard.svelte';

  // 3. CONST
  type GameState = 'MENU' | 'LOADING' | 'GUESSING' | 'REVEAL' | 'RESULTS';
  const TOTAL_ROUNDS = 10;

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
      <div class="guessing-screen" class:shake={isShaking}>
        <h2>
          {$t('page.hitstar.guessing.headline', {
            round: String(currentRound),
          })}
        </h2>
        <p class="score-display">
          {$t('page.hitstar.reveal.score', { score: String(score) })}
        </p>

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

        <p class="card-hint">{$t('page.hitstar.guessing.cardHint')}</p>

        <div class="year-input-row">
          <NumberInput
            labelText={$t('page.hitstar.guessing.yearLabel')}
            placeholder={$t('page.hitstar.guessing.yearPlaceholder')}
            bind:value={guessedYear}
            min={1950}
            max={2026}
          />
        </div>

        <Button on:click={submitGuess} disabled={!guessedYear}>
          {$t('page.hitstar.guessing.submitButton')}
        </Button>
        <Button kind="danger" on:click={goToMenu}>
          {$t('page.hitstar.abort')}
        </Button>
      </div>

      <!-- REVEAL STATE -->
    {:else if gameState === 'REVEAL'}
      <div class="reveal-screen">
        <h2>
          {$t('page.hitstar.guessing.headline', {
            round: String(currentRound),
          })}
        </h2>
        <p class="score-display">
          {$t('page.hitstar.reveal.score', { score: String(score) })}
        </p>

        <HitstarCard flipped={isCardFlipped} track={currentTrack} />

        {#if isCorrect}
          <InlineNotification
            kind="success"
            title={$t('page.hitstar.reveal.correct', {
              year: String(currentTrack?.releaseYear ?? ''),
            })}
            hideCloseButton
          />
        {:else}
          <InlineNotification
            kind="error"
            title={$t('page.hitstar.reveal.wrong', {
              year: String(currentTrack?.releaseYear ?? ''),
            })}
            hideCloseButton
          />
        {/if}

        {#if currentTrack?.previewUrl}
          <audio
            controls
            src={currentTrack.previewUrl}
            class="audio-player"
            aria-label="Song preview"
          ></audio>
        {/if}

        {#if currentTrack}
          <div class="track-links">
            <a
              href="https://open.spotify.com/search/{encodeURIComponent(`${currentTrack.name} ${currentTrack.artist}`)}"
              target="_blank"
              rel="noopener noreferrer"
              class="track-link"
            >{$t('page.hitstar.reveal.openSpotify')}</a>
            <a
              href={currentTrack.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="track-link"
            >{$t('page.hitstar.reveal.openAppleMusic')}</a>
          </div>
        {/if}

        <Button on:click={nextRound}>
          {currentRound < TOTAL_ROUNDS
            ? $t('page.hitstar.reveal.nextRound')
            : $t('page.hitstar.reveal.seeResults')}
        </Button>
        <Button kind="ghost" on:click={goToMenu}>
          {$t('page.hitstar.abort')}
        </Button>
      </div>

      <!-- RESULTS STATE -->
    {:else if gameState === 'RESULTS'}
      <div class="results-screen">
        <h1>{$t('page.hitstar.results.headline')}</h1>
        <h2>{$t('page.hitstar.results.score', { score: String(score) })}</h2>

        {#if isNewBestScore && score > 0}
          <InlineNotification
            kind="success"
            title={$t('page.hitstar.results.newRecord')}
            hideCloseButton
          />
        {/if}

        <div class="results-table">
          {#each roundResults as result}
            <Tile class="result-tile {result.correct ? 'correct' : 'wrong'}">
              <div class="result-row">
                <span class="result-round"
                  >{$t('page.hitstar.results.round', {
                    round: String(result.round),
                  })}</span
                >
                <span class="result-track"
                  >{result.track.name} – {result.track.artist}</span
                >
                <span class="result-status">
                  {result.correct
                    ? $t('page.hitstar.results.correct')
                    : $t('page.hitstar.results.wrong')}
                </span>
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

        <Button on:click={goToMenu}
          >{$t('page.hitstar.results.playAgain')}</Button
        >
      </div>
    {/if}
  </div>
{/if}

<style>
  .hitstar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
    min-height: 80vh;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    gap: 1.5rem;
  }

  .menu-screen,
  .loading-screen,
  .guessing-screen,
  .reveal-screen,
  .results-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

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

  .score-display {
    font-size: 1rem;
    color: var(--cds-text-secondary);
    margin: 0;
  }

  .card-hint {
    text-align: center;
    color: var(--cds-text-secondary);
    margin: 0;
  }

  .audio-player {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
  }

  .track-links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .track-link {
    font-size: 0.85rem;
    color: var(--cds-link-primary);
    text-decoration: underline;
  }

  .year-input-row {
    width: 100%;
    max-width: 300px;
  }


  .results-table {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .result-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .result-round {
    font-weight: bold;
    min-width: 70px;
  }

  .result-track {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .result-status {
    font-weight: bold;
  }

  .result-years {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--cds-text-secondary);
    margin-top: 0.3rem;
  }

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
</style>

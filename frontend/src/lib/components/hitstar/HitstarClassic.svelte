<script lang="ts">
  // 1. IMPORTS
  import { getRandomTrack } from '$lib/api/spotify.api';
  import type { HitstarBestRound, HitstarRoundResult, SpotifyTrackDto } from '$lib/types/spotify.dto';
  import {
    hitstarClassicBestRoundStore,
    hitstarClassicGameStateStore,
  } from '$lib/util/stores/store-hitstar';
  import { celebrate } from '$lib/util/stores/stores-global';
  import { t } from '$lib/util/translations';
  import Button from 'carbon-components-svelte/src/Button/Button.svelte';
  import InlineNotification from 'carbon-components-svelte/src/Notification/InlineNotification.svelte';
  import NumberInput from 'carbon-components-svelte/src/NumberInput/NumberInput.svelte';
  import Tile from 'carbon-components-svelte/src/Tile/Tile.svelte';
  import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
  import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
  import ContinueFilled from 'carbon-icons-svelte/lib/ContinueFilled.svelte';
  import Headphones from 'carbon-icons-svelte/lib/Headphones.svelte';
  import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
  import Trophy from 'carbon-icons-svelte/lib/Trophy.svelte';
  import { onMount } from 'svelte';
  import HitstarCard from './HitstarCard.svelte';
  import HitstarGameTopBar from './HitstarGameTopBar.svelte';
  import HitstarLoadingScreen from './HitstarLoadingScreen.svelte';
  import HitstarResultsScreen from './HitstarResultsScreen.svelte';
  import HitstarRoundTracker from './HitstarRoundTracker.svelte';
  import HitstarSpotifyEmbed from './HitstarSpotifyEmbed.svelte';

  // 2. PROPS
  let { gameActive = $bindable(false) } = $props();

  // 3. CONST
  type GameState = 'MENU' | 'LOADING' | 'GUESSING' | 'REVEAL' | 'RESULTS';
  const TOTAL_ROUNDS = 10;
  const STEP_COUNT = 5;
  const STEPS = [
    { icon: Headphones },
    { icon: Calendar },
    { icon: CheckmarkFilled },
    { icon: Repeat },
    { icon: Trophy },
  ];

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
  let currentStepIndex = $state(0);
  let isNewBestScore = $state(false);

  // 5. DERIVED
  const bestRound = $derived($hitstarClassicBestRoundStore);
  const savedGameState = $derived($hitstarClassicGameStateStore);

  // 6. EFFECTS
  $effect(() => {
    const interval = setInterval(() => {
      currentStepIndex = (currentStepIndex + 1) % STEP_COUNT;
    }, 2000);
    return () => clearInterval(interval);
  });

  $effect(() => {
    gameActive = gameState !== 'MENU';
  });

  // 7. LIFECYCLE
  onMount(() => {
    if (savedGameState) {
      currentRound = savedGameState.currentRound;
      score = savedGameState.score;
      currentTrack = savedGameState.currentTrack;
      roundResults = savedGameState.roundResults;
      isCardFlipped = false;
    }
  });

  // 8. FUNCTIONS
  const persistGameState = () => {
    hitstarClassicGameStateStore.set({ currentRound, score, currentTrack, roundResults });
  };

  const clearPersistedGameState = () => {
    hitstarClassicGameStateStore.set(null);
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
      { round: currentRound, track: currentTrack, guessedYear, correct },
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
      isNewBestScore = !bestRound || score > bestRound.score;
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
      hitstarClassicBestRoundStore.set(newBest);
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

<!-- MENU STATE -->
{#if gameState === 'MENU'}
  <div class="menu-screen">
    <h1 class="headline">{$t('page.hitstar.menu.headline')}</h1>
    <p class="description">{$t('page.hitstar.menu.description')}</p>

    <div class="step-cards">
      {#each STEPS as step, i}
        {@const StepIcon = step.icon}
        <div class="step-card" class:active={i === currentStepIndex}>
          <StepIcon size={24} />
          <span class="step-label">{$t(`page.hitstar.menu.step${i + 1}`)}</span>
        </div>
      {/each}
    </div>

    {#if bestRound}
      <Tile class="best-score-tile">
        <p class="best-score-label">{$t('page.hitstar.menu.bestScore')}</p>
        <p class="best-score-value">
          {$t('page.hitstar.menu.bestScoreValue', {
            score: String(bestRound.score),
            date: bestRound.date,
          })}
        </p>
      </Tile>
    {/if}

    {#if errorMessage}
      <InlineNotification kind="error" title={errorMessage} hideCloseButton />
    {/if}

    {#if savedGameState}
      <InlineNotification
        kind="info"
        title={$t('page.hitstar.menu.resumeInfo')}
        hideCloseButton
      />
      <Button on:click={() => { gameState = 'GUESSING'; }} kind="secondary">{$t('page.hitstar.menu.startGame')}</Button>
    {:else}
      <Button on:click={startGame}>{$t('page.hitstar.menu.startGame')}</Button>
    {/if}
  </div>

  <!-- LOADING STATE -->
{:else if gameState === 'LOADING'}
  <HitstarLoadingScreen headline={$t('page.hitstar.loading.headline')} />

  <!-- GUESSING STATE -->
{:else if gameState === 'GUESSING'}
  <div class="guessing-screen">
    <div class="game-top-section">
      <HitstarGameTopBar
        headline={$t('page.hitstar.guessing.cardHint')}
        abortLabel={$t('page.hitstar.abort')}
        onAbort={goToMenu}
      />
      <HitstarRoundTracker totalRounds={TOTAL_ROUNDS} {roundResults} />
    </div>

    <div class="game-middle-section">
      <HitstarCard flipped={false} track={null} correct={false} />
      <HitstarSpotifyEmbed trackId={currentTrack?.id ?? ''} masked={true} />
    </div>

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
    <div class="game-top-section">
      <HitstarGameTopBar
        headline={$t('page.hitstar.guessing.headline', { round: String(currentRound) })}
        abortLabel={$t('page.hitstar.abort')}
        onAbort={goToMenu}
      />
      <HitstarRoundTracker totalRounds={TOTAL_ROUNDS} {roundResults} />
    </div>

    <div class="game-middle-section">
      <div class:shake={isShaking}>
        <HitstarCard flipped={isCardFlipped} track={currentTrack} correct={isCorrect} />
      </div>
    </div>

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
  <HitstarResultsScreen
    {score}
    maxScore={10}
    {isNewBestScore}
    {roundResults}
    onPlayAgain={goToMenu}
  >
    {#snippet guessDisplay(result)}
      <span
        >{$t('page.hitstar.results.yourGuess', { year: String(result.guessedYear) })}</span
      >
    {/snippet}
  </HitstarResultsScreen>
{/if}

<style>
  .menu-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
  }

  .guessing-screen,
  .reveal-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .game-top-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .game-middle-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--default_padding);
    width: 100%;
    padding: 1.5rem 0;
  }

  .bottom-action {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    width: 100%;
    display: flex;
    justify-content: center;
  }

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

  .step-cards {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    max-width: 520px;
    justify-content: center;
  }

  .step-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.25rem;
    border-radius: 6px;
    border: 2px solid var(--cds-border-subtle-01, #525252);
    background: var(--cds-layer-02, #393939);
    flex: 1;
    min-width: 0;
    transition:
      border-color 0.3s,
      background 0.3s,
      transform 0.3s,
      opacity 0.3s;
    opacity: 0.45;
  }

  .step-card.active {
    border-color: var(--cds-interactive, #0f62fe);
    background: var(--cds-layer-selected-01, #4c4c4c);
    opacity: 1;
    transform: scale(1.1);
  }

  .step-label {
    font-size: 0.7rem;
    text-align: center;
    color: var(--cds-text-secondary);
    line-height: 1.2;
  }

  .step-card.active .step-label {
    color: var(--cds-text-primary);
    font-weight: 500;
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

  .best-score-value {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0;
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

  @media (max-width: 480px) {
    .game-top-section {
      gap: 0.5rem;
      padding-bottom: 0.25rem;
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

  }
</style>

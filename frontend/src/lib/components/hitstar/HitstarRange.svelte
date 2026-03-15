<script lang="ts">
  // 1. IMPORTS
  import { getRandomTrack } from '$lib/api/spotify.api';
  import type { HitstarBestRound, HitstarRoundResult, SpotifyTrackDto } from '$lib/types/spotify.dto';
  import {
    hitstarRangeBestRoundStore,
    hitstarRangeGameStateStore,
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
  let rangeFrom = $state<number>(2000);
  let rangeTo = $state<number>(2000);
  let roundResults = $state<HitstarRoundResult[]>([]);
  let isCorrect = $state(false);
  let isCardFlipped = $state(false);
  let errorMessage = $state('');
  let validationError = $state('');
  let isShaking = $state(false);
  let currentStepIndex = $state(0);
  let isNewBestScore = $state(false);

  // 5. DERIVED
  const bestRound = $derived($hitstarRangeBestRoundStore);
  const savedGameState = $derived($hitstarRangeGameStateStore);
  const rangeSize = $derived(rangeTo - rangeFrom + 1);
  const potentialPoints = $derived(rangeSize >= 1 && rangeSize <= 5 ? 6 - rangeSize : 0);

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
    hitstarRangeGameStateStore.set({ currentRound, score, currentTrack, roundResults });
  };

  const clearPersistedGameState = () => {
    hitstarRangeGameStateStore.set(null);
  };

  const startGame = () => {
    gameState = 'LOADING';
    currentRound = 1;
    score = 0;
    roundResults = [];
    rangeFrom = 2000;
    rangeTo = 2000;
    errorMessage = '';
    validationError = '';
    isCardFlipped = false;
    currentTrack = null;
    fetchNextTrack();
  };

  const fetchNextTrack = async () => {
    gameState = 'LOADING';
    errorMessage = '';
    validationError = '';
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

    if (rangeTo < rangeFrom) {
      validationError = $t('page.hitstar.range.guessing.errorFromTo');
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);
      return;
    }

    const size = rangeTo - rangeFrom + 1;
    if (size < 1 || size > 5) {
      validationError = $t('page.hitstar.range.guessing.errorRangeSize');
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);
      return;
    }

    validationError = '';
    const correct =
      rangeFrom <= currentTrack.releaseYear && currentTrack.releaseYear <= rangeTo;
    const pointsEarned = correct ? 6 - size : 0;
    isCorrect = correct;

    if (correct) {
      score += pointsEarned;
      celebrate();
    } else {
      isShaking = true;
      setTimeout(() => (isShaking = false), 500);
    }

    roundResults = [
      ...roundResults,
      {
        round: currentRound,
        track: currentTrack,
        guessedYear: rangeFrom,
        correct,
        rangeFrom,
        rangeTo,
        pointsEarned,
      },
    ];

    isCardFlipped = true;
    gameState = 'REVEAL';
  };

  const nextRound = () => {
    if (currentRound < TOTAL_ROUNDS) {
      currentRound += 1;
      rangeFrom = 2000;
      rangeTo = 2000;
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
      hitstarRangeBestRoundStore.set(newBest);
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
    <h1 class="headline">{$t('page.hitstar.range.menu.headline')}</h1>
    <p class="description">{$t('page.hitstar.range.menu.description')}</p>

    <div class="step-cards">
      {#each STEPS as step, i}
        {@const StepIcon = step.icon}
        <div class="step-card" class:active={i === currentStepIndex}>
          <StepIcon size={24} />
          <span class="step-label">
            {#if i === 1}
              {$t('page.hitstar.range.menu.step2')}
            {:else}
              {$t(`page.hitstar.menu.step${i + 1}`)}
            {/if}
          </span>
        </div>
      {/each}
    </div>

    {#if bestRound}
      <Tile class="best-score-tile">
        <p class="best-score-label">{$t('page.hitstar.menu.bestScore')}</p>
        <p class="best-score-value">
          {$t('page.hitstar.range.menu.bestScoreValue', {
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
        headline={$t('page.hitstar.range.guessing.cardHint')}
        abortLabel={$t('page.hitstar.abort')}
        onAbort={goToMenu}
      />
      <HitstarRoundTracker totalRounds={TOTAL_ROUNDS} {roundResults} />
    </div>

    <div class="game-middle-section">
      <HitstarCard flipped={false} track={null} correct={false} />
      <HitstarSpotifyEmbed trackId={currentTrack?.id ?? ''} masked={true} />
    </div>

    <div class="range-input-section">
      <div class="range-input-row">
        <div class="input-wrapper">
          <NumberInput
            labelText={$t('page.hitstar.range.guessing.fromLabel')}
            bind:value={rangeFrom}
            min={1950}
            max={2026}
          />
        </div>
        <div class="input-wrapper">
          <NumberInput
            labelText={$t('page.hitstar.range.guessing.toLabel')}
            bind:value={rangeTo}
            min={1950}
            max={2026}
          />
        </div>
        <Button
          icon={ContinueFilled}
          iconDescription={$t('page.hitstar.guessing.submitButton')}
          tooltipPosition="top"
          on:click={submitGuess}
        />
      </div>
      {#if validationError}
        <p class="validation-error">{validationError}</p>
      {:else if potentialPoints > 0}
        <p class="potential-points">
          {$t('page.hitstar.range.guessing.potentialPoints', {
            points: String(potentialPoints),
          })}
        </p>
      {/if}
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
    maxScore={50}
    {isNewBestScore}
    {roundResults}
    onPlayAgain={goToMenu}
  >
    {#snippet guessDisplay(result)}
      <span>
        {$t('page.hitstar.range.results.yourGuess', {
          fromYear: String(result.rangeFrom ?? result.guessedYear),
          toYear: String(result.rangeTo ?? result.guessedYear),
        })}
      </span>
      {#if result.pointsEarned && result.pointsEarned > 0}
        <span class="points-badge">
          {$t('page.hitstar.range.results.points', { points: String(result.pointsEarned) })}
        </span>
      {/if}
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

  .range-input-section {
    width: 100%;
    max-width: 420px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .range-input-row {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    width: 100%;
  }

  .input-wrapper {
    flex: 1;
    min-width: 0;
  }

  /* Carbon sets padding-right: 8rem (128px) for NumberInput controls — too large when inputs
     are side-by-side. Override to ~4.5rem to accommodate the 2×2rem stepper buttons. */
  .range-input-row :global(.bx--number input[type='number']) {
    padding-right: 4.5rem;
  }

  /* Target only the Carbon submit Button (.bx--btn), not the NumberInput steppers (.bx--number__control-btn) */
  .range-input-row :global(button.bx--btn) {
    height: 2.5rem;
    width: 2.5rem;
    min-height: unset;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .range-input-row :global(button.bx--btn svg) {
    margin: 0;
    position: static;
  }

  .potential-points {
    font-size: 0.85rem;
    color: var(--cds-support-success, #24a148);
    margin: 0;
  }

  .validation-error {
    font-size: 0.85rem;
    color: var(--cds-support-error, #da1e28);
    margin: 0;
  }

  .points-badge {
    color: var(--cds-support-success, #24a148);
    font-weight: 600;
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

    .range-input-section {
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

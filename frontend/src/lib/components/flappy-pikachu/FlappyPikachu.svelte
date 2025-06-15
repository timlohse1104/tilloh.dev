<script lang="ts">
  import EndScreen from './EndScreen.svelte';
  import Game from './Game.svelte';
  import StartScreen from './StartScreen.svelte';

  type GameState = 'start' | 'playing' | 'end';

  let gameState: GameState = 'start';
  let score: number = 0;
  let time: number = 0;
  let bestScore: { score: number; time: number } | null = null;

  // Laden des besten Scores aus dem LocalStorage
  function loadBestScore(): void {
    const savedScore = localStorage.getItem('flappy-pikachu-best-score');
    if (savedScore) {
      bestScore = JSON.parse(savedScore);
    }
  }

  // Speichern des besten Scores im LocalStorage
  function saveBestScore(score: number, time: number): void {
    if (
      !bestScore ||
      score > bestScore.score ||
      (score === bestScore.score && time < bestScore.time)
    ) {
      bestScore = { score, time };
      localStorage.setItem(
        'flappy-pikachu-best-score',
        JSON.stringify(bestScore),
      );
    }
  }

  // Spiel starten
  function startGame(): void {
    gameState = 'playing';
    score = 0;
    time = 0;
  }

  // Spiel beenden
  function endGame(currentScore: number, currentTime: number): void {
    gameState = 'end';
    score = currentScore;
    time = currentTime;
    saveBestScore(currentScore, currentTime);
  }

  // Neustart des Spiels
  function restartGame(): void {
    gameState = 'playing';
    score = 0;
    time = 0;
  }

  // Initialer Laden des besten Scores
  loadBestScore();
</script>

<section>
  {#if gameState === 'start'}
    <StartScreen {bestScore} onStart={startGame} />
  {:else if gameState === 'playing'}
    <Game onEnd={endGame} />
  {:else if gameState === 'end'}
    <EndScreen {score} {time} {bestScore} onRestart={restartGame} />
  {/if}
</section>

<style>
  section {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--cds-ui-background);
  }
</style>

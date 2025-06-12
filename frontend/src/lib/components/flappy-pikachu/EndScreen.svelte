<script lang="ts">
  import { onMount } from 'svelte';

  export let score: number;
  export let time: number;
  export let bestScore: { score: number; time: number } | null;
  export let onRestart: () => void;

  let isNewBest: boolean = false;
  let hasScore: boolean = false;

  // Überprüfen, ob der aktuelle Score ein neuer Bestscore ist
  $: {
    if (bestScore) {
      hasScore = true;
      if (
        score > bestScore.score ||
        (score === bestScore.score && time < bestScore.time)
      ) {
        isNewBest = true;
      } else {
        isNewBest = false;
      }
    } else {
      hasScore = false;
      isNewBest = true; // Wenn es noch keinen Bestscore gibt, ist der aktuelle Score automatisch der Beste
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onRestart();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="end-screen" class:new-best={isNewBest} class:no-score={!hasScore}>
  <h1>Game Over</h1>
  <div class="score-container">
    <div class="score-box">
      <h3>Your Score</h3>
      <p class="big-number">{score}</p>
    </div>
    <div class="score-box">
      <h3>Time</h3>
      <p class="big-number">{time.toFixed(2)}s</p>
    </div>
  </div>

  {#if bestScore}
    <div class="best-score">
      <h3>Best Score</h3>
      <p>{bestScore.score} in {bestScore.time.toFixed(2)} seconds</p>
    </div>
  {/if}

  {#if isNewBest && hasScore}
    <div class="congrats">
      <p>🎉 Congratulations! New High Score! 🎉</p>
    </div>
  {:else if !hasScore}
    <div class="first-score">
      <p>🏆 First Score! Well done! 🏆</p>
    </div>
  {/if}

  <button class="restart-button" on:click={onRestart}> Play Again </button>
  <div class="instruction">Press Enter to restart</div>
</div>

<style>
  .end-screen {
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
    padding: 40px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 100%);
    border-radius: 20px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    color: var(--text-color);
    font-family: 'Roboto', sans-serif;
  }

  .new-best {
    border-top: 5px solid #4caf50;
  }

  .no-score {
    border-top: 5px solid #2196f3;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .score-container {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 30px;
  }

  .score-box {
    background: white;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    min-width: 150px;
  }

  .score-box h3 {
    color: #777;
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .big-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--primary-color);
    margin: 0;
  }

  .best-score {
    background: rgba(255, 255, 255, 0.7);
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .best-score h3 {
    color: #777;
    font-size: 1rem;
    margin-bottom: 5px;
  }

  .congrats,
  .first-score {
    background: rgba(76, 175, 80, 0.1);
    padding: 15px;
    border-radius: 10px;
    margin: 20px 0;
    display: inline-block;
  }

  .first-score {
    background: rgba(33, 150, 243, 0.1);
  }

  .restart-button {
    background: linear-gradient(to right, #ff6b6b, #ff8e53);
    color: white;
    border: none;
    padding: 15px 40px;
    font-size: 1.2rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  }

  .restart-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
    background: linear-gradient(to right, #ff7e7e, #ff9e66);
  }

  .restart-button:active {
    transform: translateY(1px);
  }

  .instruction {
    margin-top: 20px;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }
</style>

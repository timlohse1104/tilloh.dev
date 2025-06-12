<script lang="ts">
  import { onMount } from 'svelte';

  export let bestScore: { score: number; time: number } | null;
  export let onStart: () => void;

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onStart();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div class="start-screen">
  <h1>Flappy Pikachu</h1>
  <div class="score-display">
    {#if bestScore}
      <p>
        Best Score: <span class="highlight">{bestScore.score}</span> in
        <span class="highlight">{bestScore.time.toFixed(2)} seconds</span>
      </p>
    {:else}
      <p>No best score yet</p>
    {/if}
  </div>
  <button class="start-button" on:click={onStart}> Start Game </button>
  <div class="instruction">Press Enter to start</div>
</div>

<style>
  .start-screen {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
    padding: 40px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    color: var(--text-color);
    font-family: 'Roboto', sans-serif;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }

  .score-display {
    background: rgba(255, 255, 255, 0.7);
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }

  .highlight {
    font-weight: bold;
    color: var(--primary-color);
  }

  .start-button {
    background: linear-gradient(to right, #ffcc00, #ff9900);
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 1.2rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    margin: 20px 0;
  }

  .start-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
    background: linear-gradient(to right, #ffdd33, #ffaa33);
  }

  .start-button:active {
    transform: translateY(1px);
  }

  .instruction {
    margin-top: 20px;
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }
</style>

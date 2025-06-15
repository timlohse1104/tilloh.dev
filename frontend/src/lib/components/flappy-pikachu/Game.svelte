<script lang="ts">
  import { onMount } from 'svelte';

  export let onEnd: (score: number, time: number) => void;

  let score: number = 0;
  let time: number = 0;
  let gameTime: number = 0;
  let gameInterval: number;
  let gameStartTime: number;
  let pikachuY: number;
  let velocity: number = 0;
  let baseGravity: number = 0.25;
  let gravity: number = 0.25;
  let baseJumpHeight: number = -5;
  let jumpHeight: number = -5;
  let pipes: Array<{
    x: number;
    topHeight: number;
    gap: number;
    passed: boolean;
  }> = [];
  let gameWidth: number;
  let gameHeight: number;
  let pipeWidth: number = 50;
  let pipeGap: number = 300;
  let pipeFrequency: number = 2250;
  let lastPipeTime: number = 0;
  let gameActive: boolean = true;
  let gameFrozen: boolean = false;
  let showCollisionFrame: boolean = false;
  let pipeSpeed: number = 2;
  let lastJumpTime: number = 0;
  let doubleJumpBoost: number = 1;
  let gravityIncreaseFactor: number = 1;
  let speedPercentage: number = 0;

  const pikachuX = 50;
  const pikachuWidth = 60;
  const pikachuHeight = 60;
  const doubleJumpThreshold = 300;
  const jumpBoostDuration = 1000;
  const gravityIncreaseThreshold = 2000;
  const gravityIncreaseInterval = 1000;

  function updateDimensions() {
    gameWidth = window.innerWidth * 0.9;
    gameHeight = window.innerHeight * 0.9;
    pikachuY = gameHeight / 2 - pikachuHeight / 2;
  }

  function resetJumpBoost() {
    jumpHeight = baseJumpHeight;
    doubleJumpBoost = 1;
  }

  function applyJumpBoost() {
    doubleJumpBoost *= 1.5;
    jumpHeight = baseJumpHeight * doubleJumpBoost;
    gravity = baseGravity;
    gravityIncreaseFactor = 1;
    setTimeout(resetJumpBoost, jumpBoostDuration);
  }

  function updateGravity() {
    const now = Date.now();
    const timeSinceLastJump = now - lastJumpTime;

    if (timeSinceLastJump > gravityIncreaseThreshold) {
      const increaseCount = Math.floor(
        (timeSinceLastJump - gravityIncreaseThreshold) /
          gravityIncreaseInterval,
      );
      if (increaseCount > gravityIncreaseFactor - 1) {
        gravityIncreaseFactor = increaseCount + 1;
        gravity = baseGravity * gravityIncreaseFactor;
      }
    } else {
      gravity = baseGravity;
      gravityIncreaseFactor = 1;
    }
  }

  function handleClickOrTouch() {
    if (gameFrozen) return;
    jump();
  }

  function jump() {
    if (gameFrozen) return;

    const now = Date.now();
    if (now - lastJumpTime < doubleJumpThreshold) {
      applyJumpBoost();
    }
    lastJumpTime = now;
    velocity = jumpHeight;
  }

  onMount(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    gameStartTime = Date.now();
    gameInterval = window.setInterval(updateGame, 16);
    lastJumpTime = Date.now();

    // Event-Listener für verschiedene Eingabemethoden hinzufügen
    document.addEventListener('click', handleClickOrTouch);
    document.addEventListener('touchstart', handleClickOrTouch);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('resize', updateDimensions);
      document.removeEventListener('click', handleClickOrTouch);
      document.removeEventListener('touchstart', handleClickOrTouch);
    };
  });

  function updateGame() {
    if (!gameActive || gameFrozen) return;

    const currentTime = Date.now();
    gameTime = (currentTime - gameStartTime) / 1000;

    updateGravity();

    velocity += gravity;
    pikachuY += velocity;

    speedPercentage = ((pipeSpeed - 2) / 2) * 100;

    if (pikachuY <= 0 || pikachuY >= gameHeight - pikachuHeight) {
      handleCollision();
      return;
    }

    if (pikachuY > gameHeight) {
      pikachuY = gameHeight;
      velocity = 0;
      handleCollision();
    }
    if (pikachuY < 0) {
      pikachuY = 0;
      velocity = 0;
      handleCollision();
    }

    const now = Date.now();
    if (now - lastPipeTime > pipeFrequency) {
      pipes.push({
        x: gameWidth,
        topHeight: Math.random() * (gameHeight - pipeGap - 50) + 25,
        gap: pipeGap,
        passed: false,
      });
      lastPipeTime = now;
    }

    pipes.forEach((pipe) => {
      pipe.x -= pipeSpeed;
    });

    pipes = pipes.filter((pipe) => pipe.x > -pipeWidth);

    for (const pipe of pipes) {
      const pikachuTop = gameHeight - pikachuY - pikachuHeight;

      if (pipe.x < pikachuX + pikachuWidth && pipe.x + pipeWidth > pikachuX) {
        if (pikachuTop < pipe.topHeight) {
          handleCollision();
          return;
        }
        if (pikachuTop + pikachuHeight > pipe.topHeight + pipe.gap) {
          handleCollision();
          return;
        }
      }

      if (pipe.x + pipeWidth < pikachuX && !pipe.passed) {
        pipe.passed = true;
        score++;
        pipeSpeed *= 1.01;
      }
    }
  }

  function handleCollision() {
    gameFrozen = true;
    showCollisionFrame = true;

    setTimeout(() => {
      gameFrozen = false;
      gameOver();
    }, 3000);
  }

  function gameOver() {
    gameActive = false;
    showCollisionFrame = false;
    clearInterval(gameInterval);
    onEnd(score, gameTime);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && !gameFrozen) {
      jump();
    }
  }

  window.addEventListener('keydown', handleKeyDown);

  onMount(() => {
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });
</script>

<div
  class="game-container"
  style={`width: ${gameWidth}px; height: ${gameHeight}px;`}
>
  <div class="score">Score: {score}</div>
  <div class="speed-display">Speed: {speedPercentage.toFixed(0)}%</div>
  <div class="time">Time: {gameTime.toFixed(2)}</div>
  <div
    class="game-area"
    style={`width: ${gameWidth}px; height: ${gameHeight}px;`}
  >
    <div
      class="pikachu"
      class:collision={showCollisionFrame}
      style={`bottom: ${pikachuY}px;`}
    ></div>

    {#each pipes as pipe}
      <div
        class="pipe-top"
        style={`left: ${pipe.x}px; height: ${pipe.topHeight}px;`}
      ></div>
      <div
        class="pipe-bottom"
        style={`left: ${pipe.x}px; height: ${gameHeight - pipe.topHeight - pipe.gap}px; top: ${pipe.topHeight + pipe.gap}px;`}
      ></div>
    {/each}
  </div>
</div>

<style>
  .game-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--cds-ui-background);
    overflow: hidden;
    border: 2px solid var(--cds-text-01);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }

  .score {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 20px;
    color: var(--cds-text-01);
    z-index: 10;
  }

  .speed-display {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
    color: var(--cds-text-01);
    z-index: 10;
  }

  .time {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    color: var(--cds-text-01);
    z-index: 10;
  }

  .game-area {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .pikachu {
    position: absolute;
    width: 60px;
    height: 60px;
    background-image: url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
    background-size: contain;
    left: 50px;
    bottom: 0;
    transition: border 0.1s ease;
    z-index: 5;
    pointer-events: none;
  }

  .pikachu.collision {
    border: 3px solid red;
    border-radius: 5px;
    box-shadow: 0 0 10px var(--cds-danger-01);
  }

  .pipe-top,
  .pipe-bottom {
    position: absolute;
    width: 50px;
    background-color: green;
    left: 0;
    z-index: 1;
    pointer-events: none;
  }

  .pipe-top {
    top: 0;
  }

  .pipe-bottom {
    bottom: 0;
  }
</style>

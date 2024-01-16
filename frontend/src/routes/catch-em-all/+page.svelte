<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { onMount } from 'svelte';
  import Game from './game.js';

  let gameCanvas;
  let ctx;

  const GAME_WIDTH = 500;
  const GAME_HEIGHT = 1000;

  onMount(() => {
    gameCanvas = document.getElementById('gameScreen');
    ctx = gameCanvas.getContext('2d');

    // init canvas
    gameCanvas.setAttribute('width', GAME_WIDTH);
    gameCanvas.setAttribute('height', GAME_HEIGHT);

    // init game
    let game = new Game(GAME_WIDTH, GAME_HEIGHT);

    let lastTime = 0;

    // runs every frame
    function gameLoop(timestamp) {
      let deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // clear canvas
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      game.update(deltaTime);
      game.draw(ctx);

      requestAnimationFrame(gameLoop);
    }

    // game start
    requestAnimationFrame(gameLoop);
  });
</script>

<svelte:head>
  <title>Catch-em-all</title>
  <meta name="description" content="Catch-em-all" />
  <meta name="ssr" content="false" />
</svelte:head>

<div class="text-column">
  <h1>Catch-em-all</h1>
</div>

<canvas id="gameScreen"></canvas>

<style>
  #gameScreen {
    border: 1px solid grey;
    box-shadow: 1px 5px 10px;
    margin: 0 auto;
  }
</style>

<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import { onMount } from 'svelte';
  import Game from './game.js';

  const { 'catch-em-all': catchEmAllRoute } = applicationRoutes;

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
  <title>{catchEmAllRoute.name}</title>
  <meta name={catchEmAllRoute.name} content="tilloh.dev" />
  <meta name="ssr" content="false" />
</svelte:head>

{#if catchEmAllRoute.toggle}
  <canvas id="gameScreen"></canvas>

  <div class="mobileMessage">
    <img src="/images/catch-em-all/LookAway.png" alt="Pikachu looks away." />
    <h1>Oh nein...</h1>
    <h2>
      Dieses Spiel ist aktuell nicht für Smartphone und Tablet Auflösungen
      optimiert.
    </h2>
  </div>
{:else}
  <ToggledApplicationInfo />
{/if}

<style lang="scss">
  @import '../../lib/styles/variables.scss';

  #gameScreen {
    border: 1px solid grey;
    box-shadow: 1px 5px 10px;
    height: 100%;
    margin: 3rem auto 0 auto;

    @media #{$tablet} {
      display: none;
    }

    @media #{$phone} {
      display: none;
    }
  }

  .mobileMessage {
    display: none;
    text-align: center;
    color: var(--light80);

    img {
      width: 50vw;
      height: auto;
      margin-top: 8em;
    }

    @media #{$tablet} {
      display: block;
    }

    @media #{$phone} {
      display: block;
    }
  }
</style>

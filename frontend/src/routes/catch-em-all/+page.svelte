<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-nocheck

  import { onMount } from 'svelte';
  import Game from './game.js';
  import { getLocalHighscore, isLocalHighscorePresent } from './statistics.js';

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

      function updateVisualHighscore() {
        let highscoreContainer = document.getElementById('highscoreContainer');
        let nolocalHighscoreText = document.getElementById('nolocalHighscore');

        if (!isLocalHighscorePresent()) {
          highscoreContainer.style.display = 'none';
          nolocalHighscoreText.style.display = 'block';
        } else {
          highscoreContainer.style.display = 'block';
          nolocalHighscoreText.style.display = 'none';
          let highestLevel = document.getElementById('highestLevel');
          let highestCaught = document.getElementById('highestCaught');
          let highestKeptUp = document.getElementById('highestKeptUp');
          let highestLifes = document.getElementById('highestLifes');
          let localHighscore = getLocalHighscore();

          highestLevel.innerText = localHighscore.level;
          highestCaught.innerText = localHighscore.caught;
          highestKeptUp.innerText = localHighscore.keptUp;
          highestLifes.innerText = localHighscore.lifes;
        }
      }

      // update visual highscore
      updateVisualHighscore();

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

<div id="gameStatistics">
  <p id="statisticsHeadline">Moin. <br /> Dein lokaler Highscore:</p>

  <div id="highscoreContainer">
    <div id="leftColumn">
      <p class="levelArea">Höchstes Level:</p>
      <p class="caughtArea">Max. gefangende Pokémon:</p>
      <p class="keptUpArea">Max. Ball hochgehalten:</p>
      <p class="lifesArea">Max. restliche Versuche:</p>
    </div>

    <div id="rightColumn">
      <p class="levelArea" id="highestLevel">0</p>
      <p class="caughtArea" id="highestCaught">0</p>
      <p class="keptUpArea" id="highestKeptUp">0</p>
      <p class="lifesArea" id="highestLifes">0</p>
    </div>
  </div>

  <span id="nolocalHighscore">Kein lokaler Highscore gefunden.</span>
</div>

<canvas id="gameScreen"></canvas>

<style>
  #gameScreen {
    border: 1px solid grey;
    box-shadow: 1px 5px 10px;
    margin: 0 auto;
  }

  #gameStatistics {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 12px;
    margin-right: 10px;
    font: 16px Arial;
    color: white;
    position: absolute;
    top: 25%;
    left: 10px;
    box-shadow: 1px 5px 10px;
  }

  #statisticsHeadline {
    font-size: 20px;
    font-weight: bold;
  }

  #highscoreContainer {
    display: flex;
    justify-content: space-between;
  }

  #leftColumn {
    display: inline-block;
  }

  #rightColumn {
    display: inline-block;
  }

  #nolocalHighscore {
    display: none;
  }
</style>

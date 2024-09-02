<script lang="ts">
  import ToggledApplicationInfo from '$lib/components/shared/ToggledApplicationInfo.svelte';
  import { applicationRoutes } from '$lib/config/applications';
  import Game from '$lib/util/catch-em-all/game';
  import { initialized, t } from '$lib/util/translations';
  import { onMount } from 'svelte';

  const { 'catch-em-all': catchEmAllRoute } = applicationRoutes;
  const locale = navigator.language || 'de';
  const GAME_WIDTH = 500;
  const GAME_HEIGHT = 1000;
  let gameCanvas;
  let ctx;

  onMount(() => {
    gameCanvas = document.getElementById('gameScreen');
    ctx = gameCanvas.getContext('2d');

    // init canvas
    gameCanvas.setAttribute('width', GAME_WIDTH);
    gameCanvas.setAttribute('height', GAME_HEIGHT);

    // init game
    let game = new Game(GAME_WIDTH, GAME_HEIGHT, {
      newGameQuestion: $t('page.catchEmAll.newGameQuestion'),
      pressSpacebar: $t('page.catchEmAll.pressSpacebar'),
      paused: $t('page.catchEmAll.paused'),
      stage: $t('page.catchEmAll.stage'),
      currentRound: $t('page.catchEmAll.currentRound'),
      caught: $t('page.catchEmAll.caught'),
      ballsThrown: $t('page.catchEmAll.ballsThrown'),
      lifesLeft: $t('page.catchEmAll.lifesLeft'),
      timesThrown: $t('page.catchEmAll.timesThrown'),
      lost: $t('page.catchEmAll.lost'),
      pressEnter: $t('page.catchEmAll.pressEnter'),
      statistics: $t('page.catchEmAll.statistics'),
      won: $t('page.catchEmAll.won'),
      localHighscore: $t('page.catchEmAll.localHighscore'),
      noHighscore: $t('page.catchEmAll.noHighscore'),
      startFirstGame: $t('page.catchEmAll.startFirstGame'),
      controlsTitle: $t('page.catchEmAll.controls.title'),
      controlsSpace: $t('page.catchEmAll.controls.space'),
      controlsUp: $t('page.catchEmAll.controls.up'),
      controlsLeft: $t('page.catchEmAll.controls.left'),
      controlsRight: $t('page.catchEmAll.controls.right'),
      controlsEsc: $t('page.catchEmAll.controls.esc'),
      controlsEnter: $t('page.catchEmAll.controls.enter'),
    });

    let lastTime = 0;

    // runs every frame
    const gameLoop = (timestamp) => {
      let deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      // clear canvas
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      game.update(deltaTime);
      game.draw(ctx);

      requestAnimationFrame(gameLoop);
    };

    // game start
    requestAnimationFrame(gameLoop);
  });
</script>

<svelte:head>
  <title>{catchEmAllRoute.name[locale]}</title>
  <meta name={catchEmAllRoute.name[locale]} content="tilloh.dev" />
  <meta name="ssr" content="false" />
</svelte:head>

{#if catchEmAllRoute.toggle}
  {#if $initialized}
    <canvas id="gameScreen"></canvas>

    <div class="mobileMessage">
      <img src="/images/catch-em-all/LookAway.png" alt="Pikachu looks away." />
      <h1>{$t('page.catchEmAll.mobileMessageTitle')}</h1>
      <h2>{$t('page.catchEmAll.mobileMessage')}</h2>
    </div>
  {:else}
    Locale initializing...
  {/if}
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

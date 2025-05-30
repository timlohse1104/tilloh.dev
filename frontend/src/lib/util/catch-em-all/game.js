import { celebrate } from '../stores/stores-global.js';
import Ball from './ball.js';
import InputHandler from './input.js';
import {
  buildLevel,
  level1,
  level10,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
} from './levels.js';
import Paddle from './paddle.js';
import {
  getLocalHighscore,
  isLocalHighscorePresent,
  setLocalHighscore,
} from './statistics.js';

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  SUCCESS: 5,
};

const GAMECONFIG = {
  startLifes: 3,
  startLevel: 0,
};

export default class Game {
  constructor(gameWidth, gameHeight, i18nTexts) {
    // init images
    this.successImage = new Image();
    this.successImage.src = '/images/catch-em-all/Gotcha.png';
    this.gameoverImage = new Image();
    this.gameoverImage.src = '/images/catch-em-all/LookAway.png';
    this.welcomeImage = new Image();
    this.welcomeImage.src = '/images/catch-em-all/Welcome.png';

    // init objects
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);
    this.gameObjects = [];
    this.bricks = [];
    this.lifes = GAMECONFIG.startLifes;
    this.levels = [
      level1,
      level2,
      level3,
      level4,
      level5,
      level6,
      level7,
      level8,
      level9,
      level10,
    ];
    this.currentLevel = 0;
    new InputHandler(this.paddle, this, this.ball);

    // measures
    this.centerMeasure = this.gameWidth / 2;
    this.leftMeasure = this.gameWidth / 7;

    // i18n
    this.i18n = i18nTexts;
  }

  start() {
    // only menu can trigger start of game
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL
    )
      return;

    // load bricks of level
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];

    this.gamestate = GAMESTATE.RUNNING;
  }

  restart() {
    if (
      this.gamestate !== GAMESTATE.SUCCESS &&
      this.gamestate !== GAMESTATE.GAMEOVER
    )
      return;

    this.currentLevel = GAMECONFIG.startLevel;
    this.lifes = GAMECONFIG.startLifes;
    this.ball.collisions.paddle = 0;
    this.ball.collisions.bricks = 0;
    this.ball.reset();
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.gameObjects = [this.ball, this.paddle];
    this.gamestate = GAMESTATE.RUNNING;
  }

  update(deltaTime) {
    // 0 lifes => death
    if (this.lifes === 0) {
      this.gamestate = GAMESTATE.GAMEOVER;
      this.updateHighscore();
    }

    // dont update if. . .
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.SUCCESS
    )
      return;

    // update all objects
    [...this.gameObjects, ...this.bricks].forEach((object) =>
      object.update(deltaTime),
    );
    this.bricks = this.bricks.filter((brick) => !brick.markedForDeletion);

    // all bricks deleted => next level
    if (this.bricks.length === 0) {
      if (this.currentLevel + 2 > this.levels.length) {
        this.gamestate = GAMESTATE.SUCCESS;
        this.updateHighscore();
      } else {
        this.gamestate = GAMESTATE.NEWLEVEL;
      }
      this.currentLevel++;
      this.start();
    }
  }

  draw(ctx) {
    // draw new numbers to canvas
    [...this.gameObjects, ...this.bricks].forEach((object) => object.draw(ctx));

    // menu
    if (this.gamestate === GAMESTATE.MENU) {
      this.drawMenu(ctx);
    }

    // pause screen
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.drawPauseScreen(ctx);
    }

    // game ui
    if (this.gamestate === GAMESTATE.RUNNING) {
      this.drawUI(ctx);
    }

    // game over screen
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      this.drawGameoverScreen(ctx);
    }
    // game success screen
    if (this.gamestate === GAMESTATE.SUCCESS) {
      this.drawSuccessScreen(ctx);
    }
  }

  drawMenu(ctx) {
    ctx.rect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.drawImage(
      this.welcomeImage,
      this.centerMeasure - this.gameWidth / 3,
      this.gameHeight / 6,
      this.gameWidth / 1.5,
      this.gameWidth / 4,
    );

    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';
    ctx.font = '22px Arial';
    ctx.fillText(
      this.i18n.newGameQuestion,
      this.centerMeasure,
      this.gameHeight / 2,
    );
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(
      this.i18n.pressSpacebar,
      this.centerMeasure,
      this.gameHeight / 2 + 40,
    );

    // highscore
    this.drawLocalHighscore(ctx);

    // controls
    this.drawControls(ctx);
  }

  drawPauseScreen(ctx) {
    ctx.rect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();

    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.i18n.paused, this.centerMeasure, this.gameHeight / 3);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'crimson';
    ctx.fillText(
      `${this.i18n.stage} ${this.currentLevel + 1}`,
      this.centerMeasure,
      this.gameHeight / 3 + 50,
    );

    // current round statistics
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'lightgray';
    ctx.fillText(
      `${this.i18n.currentRound}:`,
      this.leftMeasure,
      this.gameHeight / 2 + 40,
    );
    ctx.font = '14px Arial';
    ctx.fillText(
      `${this.i18n.caught}: ${this.ball.collisions.bricks}`,
      this.leftMeasure,
      this.gameHeight / 2 + 70,
    );
    ctx.fillText(
      `${this.i18n.ballsThrown}: ${this.ball.collisions.paddle}`,
      this.leftMeasure,
      this.gameHeight / 2 + 90,
    );
    ctx.fillText(
      `${this.i18n.lifesLeft}: ${this.lifes}`,
      this.leftMeasure,
      this.gameHeight / 2 + 110,
    );

    // highscore
    this.drawLocalHighscore(ctx);

    // controls
    this.drawControls(ctx);
  }

  drawUI(ctx) {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`${this.ball.collisions.bricks} ${this.i18n.caught}`, 10, 14);
    ctx.fillText(
      `${this.i18n.stage} ${this.currentLevel + 1} / ${this.levels.length}`,
      this.centerMeasure - 20,
      14,
    );
    ctx.fillText(
      `${this.ball.collisions.paddle}${this.i18n.timesThrown}`,
      this.gameWidth - 95,
      14,
    );
  }

  drawGameoverScreen(ctx) {
    ctx.rect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.drawImage(
      this.gameoverImage,
      this.centerMeasure - this.gameWidth / 4,
      this.gameHeight / 7,
      this.centerMeasure,
      this.gameHeight / 5,
    );

    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.i18n.lost, this.centerMeasure, this.gameHeight / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(
      this.i18n.newGameQuestion,
      this.centerMeasure,
      this.gameHeight / 2 + 50,
    );
    ctx.fillText(
      this.i18n.pressEnter,
      this.centerMeasure,
      this.gameHeight / 2 + 90,
    );

    // statistics
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${this.i18n.statistics}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 200,
    );
    ctx.font = '14px Arial';
    ctx.fillText(
      `${this.i18n.caught}: ${this.ball.collisions.bricks}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 230,
    );
    ctx.fillText(
      `${this.i18n.ballsThrown}:    ${this.ball.collisions.paddle}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 250,
    );
    ctx.fillText(
      `${this.i18n.lifesLeft}:              ${this.lifes}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 270,
    );
  }

  drawSuccessScreen(ctx) {
    ctx.rect(0, 0, this.gameWidth, this.gameHeight);
    ctx.fillStyle = 'green';
    ctx.fill();

    ctx.drawImage(
      this.successImage,
      this.centerMeasure - this.gameWidth / 4,
      this.gameHeight / 6,
      this.centerMeasure,
      this.gameWidth / 3,
    );

    ctx.font = '40px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(this.i18n.won, this.centerMeasure, this.gameHeight / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(
      this.i18n.newGameQuestion,
      this.centerMeasure,
      this.gameHeight / 2 + 50,
    );
    ctx.fillText(
      this.i18n.pressEnter,
      this.centerMeasure,
      this.gameHeight / 2 + 90,
    );

    // statistics
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(
      `${this.i18n.statistics}:`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 200,
    );
    ctx.font = '14px Arial';
    ctx.fillText(
      `${this.i18n.caught}: ${this.ball.collisions.bricks}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 230,
    );
    ctx.fillText(
      `${this.i18n.ballsThrown}:    ${this.ball.collisions.paddle}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 250,
    );
    ctx.fillText(
      `${this.i18n.lifesLeft}:              ${this.lifes}`,
      this.gameWidth / 3.5,
      this.gameHeight / 2 + 270,
    );

    celebrate();
  }

  togglePause() {
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else if (this.gamestate === GAMESTATE.RUNNING) {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }

  updateHighscore() {
    let currentHighscore = {
      level: this.currentLevel + 1,
      caught: this.ball.collisions.bricks,
      keptUp: this.ball.collisions.paddle,
      lifes: this.lifes,
    };
    if (isLocalHighscorePresent()) {
      let localHighscore = getLocalHighscore();

      if (currentHighscore.level > localHighscore.level) {
        setLocalHighscore(currentHighscore);
      } else if (
        currentHighscore.level === localHighscore.level &&
        currentHighscore.caught > localHighscore.caught
      ) {
        setLocalHighscore(currentHighscore);
      } else if (
        currentHighscore.level === localHighscore.level &&
        currentHighscore.caught === localHighscore.caught &&
        currentHighscore.keptUp > localHighscore.keptUp
      ) {
        setLocalHighscore(currentHighscore);
      } else if (
        currentHighscore.level === localHighscore.level &&
        currentHighscore.caught === localHighscore.caught &&
        currentHighscore.keptUp === localHighscore.keptUp &&
        currentHighscore.lifes === localHighscore.lifes
      ) {
        setLocalHighscore(currentHighscore);
      }
    } else {
      setLocalHighscore(currentHighscore);
    }
  }

  drawLocalHighscore(ctx) {
    if (isLocalHighscorePresent()) {
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'lightgray';
      ctx.fillText(
        `${this.i18n.localHighscore}:`,
        this.leftMeasure,
        this.gameHeight / 2 + 160,
      );
      ctx.font = '14px Arial';
      ctx.fillText(
        `${this.i18n.stage}: ${getLocalHighscore().level}`,
        this.leftMeasure,
        this.gameHeight / 2 + 190,
      );
      ctx.fillText(
        `${this.i18n.caught}: ${getLocalHighscore().caught}`,
        this.leftMeasure,
        this.gameHeight / 2 + 210,
      );
      ctx.fillText(
        `${this.i18n.ballsThrown}: ${getLocalHighscore().keptUp}`,
        this.leftMeasure,
        this.gameHeight / 2 + 230,
      );
      ctx.fillText(
        `${this.i18n.lifesLeft}: ${getLocalHighscore().lifes}`,
        this.leftMeasure,
        this.gameHeight / 2 + 250,
      );
    } else {
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'gray';
      ctx.fillText(
        this.i18n.noHighscore,
        this.leftMeasure,
        this.gameHeight / 2 + 160,
      );
      ctx.font = '14px Arial';
      ctx.fillText(
        this.i18n.startFirstGame,
        this.leftMeasure,
        this.gameHeight / 2 + 190,
      );
    }
  }

  drawControls(ctx) {
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'lightgray';
    ctx.fillText(
      `${this.i18n.controlsTitle}:`,
      this.leftMeasure,
      this.gameHeight / 2 + 300,
    );
    ctx.font = '14px Arial';
    ctx.fillText(
      this.i18n.controlsSpace,
      this.leftMeasure,
      this.gameHeight / 2 + 330,
    );
    ctx.fillText(
      this.i18n.controlsUp,
      this.leftMeasure,
      this.gameHeight / 2 + 350,
    );
    ctx.fillText(
      this.i18n.controlsLeft,
      this.leftMeasure,
      this.gameHeight / 2 + 370,
    );
    ctx.fillText(
      this.i18n.controlsRight,
      this.leftMeasure,
      this.gameHeight / 2 + 390,
    );
    ctx.fillText(
      this.i18n.controlsEsc,
      this.leftMeasure,
      this.gameHeight / 2 + 410,
    );
    ctx.fillText(
      this.i18n.controlsEnter,
      this.leftMeasure,
      this.gameHeight / 2 + 430,
    );
  }
}

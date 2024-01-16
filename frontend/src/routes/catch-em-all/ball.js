// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { detectCollision } from './collisionDetection.js';
import { getRandomPokeball } from './pokeballs.js';
import { getRandomNumberBetween } from './util.js';

const BALLSTATE = {
  INITIAL: 0,
  RUNNING: 1,
};

export default class Ball {
  constructor(game) {
    this.image = new Image();
    this.image.src = getRandomPokeball();
    this.game = game;
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;

    this.size = 20;
    this.startPosition = {
      x: game.gameWidth / 2 - this.size / 2,
      y: game.gameHeight - 70,
    };
    this.collisions = { paddle: 0, bricks: 0 };
    this.ballstate = BALLSTATE.INITIAL;
    this.reset();
  }

  reset() {
    this.position = {
      x: this.startPosition.x,
      y: this.startPosition.y,
    };
    this.speed = { x: 0, y: 0 };
    this.ballstate = BALLSTATE.INITIAL;
    this.image.src = getRandomPokeball();
  }

  toss() {
    if (this.ballstate === BALLSTATE.INITIAL) {
      let randomSpeed = getRandomNumberBetween(-4, 4);
      this.speed.x = randomSpeed !== 0 ? randomSpeed : 1;
      this.speed.y = getRandomNumberBetween(-4, -1);
      this.ballstate = BALLSTATE.RUNNING;
    }
  }

  update() {
    // update position
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    // check collision left and right wall
    if (this.position.x < 0 || this.position.x + this.size > this.gameWidth)
      this.speed.x = -this.speed.x;

    // check collision top wall
    if (this.position.y < 0) this.speed.y = -this.speed.y;

    // check collision bottom
    if (this.position.y + this.size > this.gameHeight) {
      this.game.lifes--;
      this.reset();
    }

    if (detectCollision(this, this.game.paddle)) {
      this.speed.y = -this.speed.y;
      this.position.y = this.game.paddle.position.y - this.size;
      this.collisions.paddle++;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size,
      this.size
    );
  }
}

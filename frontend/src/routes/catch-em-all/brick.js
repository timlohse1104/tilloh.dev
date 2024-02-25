import { detectCollision } from './collisionDetection.js';
import { getRandomPokemon } from './pokemons.js';

const BRICK_WIDTH = 50,
  BRICK_HEIGHT = 50;

export default class Brick {
  constructor(game, position) {
    this.image = new Image();
    this.image.src = getRandomPokemon();

    this.game = game;

    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;

    this.position = position;

    this.markedForDeletion = false;
  }

  update() {
    if (detectCollision(this.game.ball, this)) {
      this.game.ball.speed.y = -this.game.ball.speed.y;
      this.markedForDeletion = true;
      this.game.ball.collisions.bricks++;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  static get BRICK_WIDTH() {
    return BRICK_WIDTH;
  }

  static get BRICK_HEIGHT() {
    return BRICK_HEIGHT;
  }
}

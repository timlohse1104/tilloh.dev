export default class Paddle {
  constructor(game) {
    this.game = game;
    this.gameWidth = game.gameWidth;
    this.width = 75;
    this.height = 20;

    this.maxSpeed = 50;
    this.speed = 0;

    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10,
    };
  }

  draw(ctx) {
    ctx.fillStyle = 'grey';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${this.game.lifes} Versuche`,
      this.position.x + this.width / 2,
      this.position.y + this.height - 5,
    );
  }

  update(deltaTime) {
    this.position.x += this.speed / deltaTime;

    // control overflow of paddle left and right
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
  }

  moveLeft() {
    this.speed = -this.maxSpeed;
  }

  moveRight() {
    this.speed = this.maxSpeed;
  }

  stop() {
    this.speed = 0;
  }
}

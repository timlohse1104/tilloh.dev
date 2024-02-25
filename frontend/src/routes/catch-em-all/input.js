export default class InputHandler {
  constructor(paddle, game, ball) {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowLeft':
          paddle.moveLeft();
          break;
        case 'ArrowRight':
          paddle.moveRight();
          break;
        case 'Escape':
          game.togglePause();
          break;
        case 'Space':
          game.start();
          break;
        case 'ArrowUp':
          ball.toss();
          break;
        case 'Enter':
          game.restart();
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'ArrowLeft':
          if (paddle.speed < 0) paddle.stop();
          break;
        case 'ArrowRight':
          if (paddle.speed > 0) paddle.stop();
          break;
      }
    });
  }
}

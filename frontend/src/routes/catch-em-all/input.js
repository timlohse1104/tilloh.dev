// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export default class InputHandler {
  constructor(paddle, game, ball) {
    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
          paddle.moveLeft();
          break;
        case 39:
          paddle.moveRight();
          break;
        case 27:
          game.togglePause();
          break;
        case 32:
          game.start();
          break;
        case 38:
          ball.toss();
          break;
        case 13:
          game.restart();
          break;
      }
      // DEBUG to check keyCode
      // alert(event.keyCode);
    });

    document.addEventListener('keyup', (event) => {
      switch (event.keyCode) {
        case 37:
          if (paddle.speed < 0) paddle.stop();
          break;
        case 39:
          if (paddle.speed > 0) paddle.stop();
          break;
      }
    });
  }
}

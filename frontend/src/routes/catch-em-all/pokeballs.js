// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { getRandomNumberBetween } from './util.js';

export const pokeballs = [
  '/images/catch-em-all/pokeballs/pokeball.png',
  '/images/catch-em-all/pokeballs/super_ball.png',
  '/images/catch-em-all/pokeballs/ultra_ball.png',
  '/images/catch-em-all/pokeballs/master_ball.png',
];

export function getRandomPokeball() {
  return pokeballs[getRandomNumberBetween(0, pokeballs.length - 1)];
}

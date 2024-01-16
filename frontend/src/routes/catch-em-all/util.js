// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export function getRandomNumberBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

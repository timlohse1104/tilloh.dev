// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser } from '$app/environment';

export function isLocalHighscorePresent() {
  const highscore = browser
    ? window.localStorage.getItem('localHighscore')
    : '';
  return highscore ? true : false;
}

export function getLocalHighscore() {
  // return JSON.parse(localStorage.getItem('localHighscore'));
  return browser
    ? JSON.parse(window.localStorage.getItem('localHighscore')) ?? ''
    : '';
}

export function setLocalHighscore(newHighscore) {
  // localStorage.setItem('localHighscore', JSON.stringify(newHighscore));
  if (browser) {
    window.localStorage.setItem('localHighscore', JSON.stringify(newHighscore));
  }
}

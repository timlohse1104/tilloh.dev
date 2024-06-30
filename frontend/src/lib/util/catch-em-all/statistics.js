import { browser } from '$app/environment';

export const isLocalHighscorePresent = () => {
  const highscore = browser
    ? window.localStorage.getItem('localHighscore')
    : '';
  return highscore ? true : false;
};

export const getLocalHighscore = () => {
  // return JSON.parse(localStorage.getItem('localHighscore'));
  return browser
    ? JSON.parse(window.localStorage.getItem('localHighscore')) ?? ''
    : '';
};

export const setLocalHighscore = (newHighscore) => {
  // localStorage.setItem('localHighscore', JSON.stringify(newHighscore));
  if (browser) {
    window.localStorage.setItem('localHighscore', JSON.stringify(newHighscore));
  }
};

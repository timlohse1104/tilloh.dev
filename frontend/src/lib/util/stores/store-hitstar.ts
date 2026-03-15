import { browser } from '$app/environment';
import type { HitstarBestRound, HitstarGameState } from '$lib/types/spotify.dto';
import { writable } from 'svelte/store';

const classicBestRoundKey = 'hitstar.classic.bestRound';
const classicGameStateKey = 'hitstar.classic.gameState';
const rangeBestRoundKey = 'hitstar.range.bestRound';
const rangeGameStateKey = 'hitstar.range.gameState';

// Migration: alte Keys auf neue Keys
if (browser) {
  const oldBestRound = localStorage.getItem('hitstar.bestRound');
  if (oldBestRound) {
    localStorage.setItem(classicBestRoundKey, oldBestRound);
    localStorage.removeItem('hitstar.bestRound');
  }
  const oldGameState = localStorage.getItem('hitstar.gameState');
  if (oldGameState) {
    localStorage.setItem(classicGameStateKey, oldGameState);
    localStorage.removeItem('hitstar.gameState');
  }
}

const getInitialBestRound = (key: string): HitstarBestRound | null => {
  if (!browser) return null;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as HitstarBestRound;
  } catch {
    return null;
  }
};

const getInitialGameState = (key: string): HitstarGameState | null => {
  if (!browser) return null;
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as HitstarGameState;
  } catch {
    return null;
  }
};

export const hitstarClassicBestRoundStore = writable<HitstarBestRound | null>(
  getInitialBestRound(classicBestRoundKey),
);

export const hitstarClassicGameStateStore = writable<HitstarGameState | null>(
  getInitialGameState(classicGameStateKey),
);

export const hitstarRangeBestRoundStore = writable<HitstarBestRound | null>(
  getInitialBestRound(rangeBestRoundKey),
);

export const hitstarRangeGameStateStore = writable<HitstarGameState | null>(
  getInitialGameState(rangeGameStateKey),
);

if (browser) {
  hitstarClassicBestRoundStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(classicBestRoundKey);
    } else {
      localStorage.setItem(classicBestRoundKey, JSON.stringify(val));
    }
  });

  hitstarClassicGameStateStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(classicGameStateKey);
    } else {
      localStorage.setItem(classicGameStateKey, JSON.stringify(val));
    }
  });

  hitstarRangeBestRoundStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(rangeBestRoundKey);
    } else {
      localStorage.setItem(rangeBestRoundKey, JSON.stringify(val));
    }
  });

  hitstarRangeGameStateStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(rangeGameStateKey);
    } else {
      localStorage.setItem(rangeGameStateKey, JSON.stringify(val));
    }
  });
}

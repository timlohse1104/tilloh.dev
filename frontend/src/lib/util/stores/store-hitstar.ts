import { browser } from '$app/environment';
import type { HitstarBestRound, HitstarGameState } from '$lib/types/spotify.dto';
import { writable } from 'svelte/store';

const hitstarBestRoundKey = 'hitstar.bestRound';
const hitstarGameStateKey = 'hitstar.gameState';

const getInitialBestRound = (): HitstarBestRound | null => {
  if (!browser) return null;
  const stored = localStorage.getItem(hitstarBestRoundKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as HitstarBestRound;
  } catch {
    return null;
  }
};

const getInitialGameState = (): HitstarGameState | null => {
  if (!browser) return null;
  const stored = localStorage.getItem(hitstarGameStateKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as HitstarGameState;
  } catch {
    return null;
  }
};

export const hitstarBestRoundStore = writable<HitstarBestRound | null>(
  getInitialBestRound(),
);

export const hitstarGameStateStore = writable<HitstarGameState | null>(
  getInitialGameState(),
);

if (browser) {
  hitstarBestRoundStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(hitstarBestRoundKey);
    } else {
      localStorage.setItem(hitstarBestRoundKey, JSON.stringify(val));
    }
  });

  hitstarGameStateStore.subscribe((val) => {
    if (val === null) {
      localStorage.removeItem(hitstarGameStateKey);
    } else {
      localStorage.setItem(hitstarGameStateKey, JSON.stringify(val));
    }
  });
}

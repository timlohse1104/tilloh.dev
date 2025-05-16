import { writable } from 'svelte/store';

export const confettiDuration = 3000;
export const confettiAmount = 500;

export const isConfettiVisibleStore = writable(false);

export const resetConfettiStore = () => {
  setTimeout(() => {
    isConfettiVisibleStore.set(false);
  }, confettiDuration);
};

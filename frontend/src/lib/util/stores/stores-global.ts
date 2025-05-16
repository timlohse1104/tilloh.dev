import { writable } from 'svelte/store';

export const confettiDuration = 3000;
export const confettiAmount = 500;
export const confettiGravity = 0.1;

export const isConfettiVisibleStore = writable(false);

export const celebrate = () => {
  isConfettiVisibleStore.set(true);
  setTimeout(() => {
    isConfettiVisibleStore.set(false);
  }, confettiDuration);
};

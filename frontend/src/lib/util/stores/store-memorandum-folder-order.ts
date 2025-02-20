import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let folderOrderDefault = 'fixed';
const folderOrderKey = 'memorandum.folder-order';

if (browser) {
  if (!localStorage.getItem(folderOrderKey)) {
    localStorage.setItem(folderOrderKey, folderOrderDefault);
  }

  folderOrderDefault =
    localStorage.getItem(folderOrderKey) || folderOrderDefault;
}

export const folderOrderFolder = writable(folderOrderDefault);

if (browser) {
  folderOrderFolder.subscribe((val) =>
    localStorage.setItem(folderOrderKey, val),
  );
}

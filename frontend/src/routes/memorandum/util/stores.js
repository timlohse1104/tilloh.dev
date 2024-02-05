// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import { defaultColor } from './constants';

// Helper functions
function ensureFolderBackgroundColor(linkPreset) {
  const preset = JSON.parse(linkPreset);
  const folders = preset.Folders;

  for (let i = 0; i < folders.length; i++) {
    if (!folders[i].customBackgroundColor) {
      folders[i].customBackgroundColor = defaultColor;
    }
  }

  return JSON.stringify(preset);
}

// Localstorage stores

// Link preset

let linkPresetDefault = '{"Folders": []}';

if (browser) {
  if (!localStorage.getItem('linkPreset')) {
    localStorage.setItem('linkPreset', linkPresetDefault);
  }

  const linkPreset = localStorage.getItem('linkPreset') || linkPresetDefault;

  linkPresetDefault = ensureFolderBackgroundColor(linkPreset);
}

export const localPreset = writable(JSON.parse(linkPresetDefault));

if (browser) {
  localPreset.subscribe((val) =>
    localStorage.setItem('linkPreset', JSON.stringify(val))
  );
}

// Folder order
let folderOrderDefault = 'fixed';

if (browser) {
  if (!localStorage.getItem('folderOrder')) {
    localStorage.setItem('folderOrder', folderOrderDefault);
  }

  folderOrderDefault =
    localStorage.getItem('folderOrder') || folderOrderDefault;
}

export const folderOrder = writable(folderOrderDefault);

if (browser) {
  folderOrder.subscribe((val) => localStorage.setItem('folderOrder', val));
}

// Normal stores
export const presetOverlayOptions = writable({
  showOverlay: false,
});

export const folderOverlayOptions = writable({
  showOverlay: false,
  currentFolderId: undefined,
  currentFolderName: undefined,
  currentFolderBackgroundColor: undefined,
});

export const linkOverlayOptions = writable({
  showOverlay: false,
  currentFolderId: undefined,
  currentFolder: undefined,
  currLinkId: undefined,
  currLinkName: undefined,
  currLinkUrl: undefined,
});

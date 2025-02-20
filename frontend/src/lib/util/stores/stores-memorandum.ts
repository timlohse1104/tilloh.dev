import { writable } from 'svelte/store';

export const presetOverlayOptionsStore = writable({
  showOverlay: false,
});

export const folderOverlayOptionsStore = writable({
  showOverlay: false,
  currentFolderId: undefined,
  currentFolderName: undefined,
  currentFolderBackgroundColor: undefined,
});

export const linkOverlayOptionsStore = writable({
  showOverlay: false,
  currentFolderId: undefined,
  currentFolder: undefined,
  currLinkId: undefined,
  currLinkName: undefined,
  currLinkUrl: undefined,
});

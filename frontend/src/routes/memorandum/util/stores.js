// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser } from '$app/environment';
import { writable } from 'svelte/store';

let linkPresetDefault = '{"Folders": []}';

if (browser) {
  if (!localStorage.getItem('linkPreset')) {
    localStorage.setItem('linkPreset', linkPresetDefault);
  }

  linkPresetDefault = localStorage.getItem('linkPreset') || linkPresetDefault;
}

export const localPreset = writable(JSON.parse(linkPresetDefault));

if (browser) {
  localPreset.subscribe((val) =>
    localStorage.setItem('linkPreset', JSON.stringify(val))
  );
}

export const linkOverlayOptions = writable({
  showOverlay: false,
  currentFolderId: undefined,
  currentFolder: undefined,
  currLinkId: undefined,
  currLinkName: undefined,
  currLinkUrl: undefined,
});

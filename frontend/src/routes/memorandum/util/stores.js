// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { browser, dev } from '$app/environment';
import { environment } from '$lib/util/environment';
import { sharedIdentifierStore } from '$lib/util/stores';
import { writable } from 'svelte/store';
import { defaultColor } from './constants';

console.log('dev', dev);

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

let linkPresetDefault = '{"Folders": []}';
const linkPresetKey = 'memorandum.link-preset';

export let localPresetStore = writable(JSON.parse(linkPresetDefault));

// Helper functions
function ensureFolderBackgroundColor(linkPreset) {
  console.log('linkPreset', linkPreset, typeof linkPreset);
  // const preset = JSON.parse(linkPreset);
  // console.log('preset', preset, typeof preset);
  const folders = linkPreset.Folders;
  console.log('folders', folders);

  for (let i = 0; i < folders.length; i++) {
    if (!folders[i].customBackgroundColor) {
      folders[i].customBackgroundColor = defaultColor;
    }
  }

  console.log('color ensured linkPreset', JSON.stringify(linkPreset));

  return linkPreset;
}

export async function refreshPresetStore() {
  console.log('refreshing...');
  let linkPreset;

  // If user activated a shared preset, get it from the server
  if (sharedIdentifier.id && sharedIdentifier.name) {
    console.log('sharedIdentifier', sharedIdentifier);
    const remotePresetResponse = await getRemotePreset(
      sharedIdentifier.id,
      linkPresetKey
    );
    console.log('existingRemotePreset', remotePresetResponse);

    let remotePreset;
    if (remotePresetResponse.statusCode === 404) {
      // If the shared preset does not exist, create it
      const newRemotePresetResponse = await createRemotePreset(
        sharedIdentifier.id,
        linkPresetKey,
        linkPresetDefault
      );
      console.log('newRemotePreset', newRemotePresetResponse);
      remotePreset = JSON.parse(newRemotePresetResponse.value);
    } else {
      remotePreset = JSON.parse(remotePresetResponse.value);
    }

    console.log('remotePreset', remotePreset);

    linkPreset = remotePreset;
  } else {
    // If user did not activate a shared preset, get the local preset
    if (!localStorage.getItem(linkPresetKey)) {
      localStorage.setItem(linkPresetKey, linkPresetDefault);
    }

    linkPreset = JSON.parse(localStorage.getItem(linkPresetKey));
  }

  console.log('linkPreset', linkPreset);
  localPresetStore.set(ensureFolderBackgroundColor(linkPreset));
  console.log('refreshed');
}

// Online preset
function getRemotePreset(identifier, key) {
  return fetch(`${apiURL}/keystore/${identifier}/${key}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

function createRemotePreset(identifier, key, value) {
  return fetch(`${apiURL}/keystore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, key, value }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

function updateRemotePreset(identifier, key, value) {
  return fetch(`${apiURL}/keystore/${identifier}/${key}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
}

// Link preset store
let sharedIdentifier;
sharedIdentifierStore.subscribe((val) => (sharedIdentifier = val));

if (browser) {
  await refreshPresetStore();
}

if (browser) {
  localPresetStore.subscribe(async (val) => {
    console.log('localPresetStore update', val);
    if (sharedIdentifier.id && sharedIdentifier.name) {
      console.log();
      await updateRemotePreset(
        sharedIdentifier.id,
        linkPresetKey,
        JSON.stringify(val)
      );
    }
    localStorage.setItem(linkPresetKey, JSON.stringify(val));
  });
}

// Folder order store
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
    localStorage.setItem(folderOrderKey, val)
  );
}

// Other stores
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

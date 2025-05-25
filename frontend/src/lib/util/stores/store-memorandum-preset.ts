import { browser } from '$app/environment';
import { environment } from '$lib/util/environment';
import { sharedIdentifierStore } from '$lib/util/stores/store-other';
import { writable } from 'svelte/store';
import { defaultColor } from '../memorandum/constants';
import { ensureFolderUUID } from '../uuid';

const apiURL = environment.apiBaseUrl;
const linkPresetDefault = '{"Folders": []}';
const linkPresetKey = 'memorandum.link-preset';

export const localPresetStore = writable(JSON.parse(linkPresetDefault));

// Helper functions
const ensureFolderBackgroundColor = (linkPreset) => {
  const folders = linkPreset.Folders;

  for (let i = 0; i < folders.length; i++) {
    if (!folders[i].customBackgroundColor) {
      folders[i].customBackgroundColor = defaultColor;
    }
  }

  return linkPreset;
};

export const refreshPresetStore = async () => {
  let linkPreset;

  // If user activated a shared preset, get it from the server
  if (sharedIdentifier.id && sharedIdentifier.name) {
    const remotePresetResponse = await getRemotePreset(
      sharedIdentifier.id,
      linkPresetKey,
    );

    let remotePreset;
    if (remotePresetResponse.statusCode === 404) {
      // If the shared preset does not exist, create it
      const newRemotePresetResponse = await createRemotePreset(
        sharedIdentifier.id,
        linkPresetKey,
        linkPresetDefault,
      );
      remotePreset = JSON.parse(newRemotePresetResponse.value);
    } else {
      remotePreset = JSON.parse(remotePresetResponse.value);
    }

    linkPreset = remotePreset;
  } else {
    // If user did not activate a shared preset, get the local preset
    if (!localStorage.getItem(linkPresetKey)) {
      localStorage.setItem(linkPresetKey, linkPresetDefault);
    }

    linkPreset = JSON.parse(localStorage.getItem(linkPresetKey));
  }

  const backwardsCompatiblePreset = ensureFolderUUID(
    ensureFolderBackgroundColor(linkPreset),
  );

  // Update remote preset backwards compatible if needed
  if (sharedIdentifier.id && sharedIdentifier.name) {
    await updateRemotePreset(
      sharedIdentifier.id,
      linkPresetKey,
      JSON.stringify(backwardsCompatiblePreset),
    );
  }

  localPresetStore.set(backwardsCompatiblePreset);
};

// Online preset
const getRemotePreset = (identifier, key) => {
  return fetch(`${apiURL}/keystore/${identifier}/${key}`)
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

const createRemotePreset = (identifier, key, value) => {
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
};

const updateRemotePreset = (identifier, key, value) => {
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
};

// Link preset store
let sharedIdentifier;
sharedIdentifierStore.subscribe((val) => (sharedIdentifier = val));

if (browser) {
  await refreshPresetStore();
}

if (browser) {
  localPresetStore.subscribe(async (val) => {
    if (sharedIdentifier.id && sharedIdentifier.name) {
      await updateRemotePreset(
        sharedIdentifier.id,
        linkPresetKey,
        JSON.stringify(val),
      );
    }
    localStorage.setItem(linkPresetKey, JSON.stringify(val));
  });
}

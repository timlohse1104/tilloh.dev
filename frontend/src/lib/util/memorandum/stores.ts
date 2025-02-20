import { browser, dev } from '$app/environment';
import type { LinkDto, MemorandumDto } from '$lib/types/memorandum.dto';
import { environment } from '$lib/util/environment';
import { sharedIdentifierStore } from '$lib/util/stores/store-other';
import { writable } from 'svelte/store';
import { defaultColor } from './constants';

const apiURL = dev
  ? environment.localApiBaseUrl
  : environment.productionApiBaseUrl;

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

function isUUID(str) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

const ensureLinkUUID = (links: LinkDto[]): LinkDto[] => {
  links.forEach((link) => {
    if (!isUUID(link.id)) {
      link.id = crypto.randomUUID();
    }
  });
  return links;
};

const ensureFolderUUID = (linkPreset: MemorandumDto) => {
  const folders = linkPreset.Folders;
  folders.forEach((folder) => {
    if (!isUUID(folder.id)) {
      folder.id = crypto.randomUUID();
      folder.links = ensureLinkUUID(folder.links);
    }
  });
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

// Folder order store

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

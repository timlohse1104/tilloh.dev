import { getIdentifiers } from '$lib/api/identifiers.api';
import { getJokes } from '$lib/api/jokes.api';
import { getKeystore } from '$lib/api/keystore.api';
import type { IdentifierDto } from '$lib/types/identifiers.dto';
import type { JokeDto } from '$lib/types/jokes.dto';
import type { KeystoreKeyDto } from '$lib/types/keystore.dto';
import type { FolderDto } from '$lib/types/memorandum.dto';
import { writable, type Writable } from 'svelte/store';

export const adminLinkPresetStore: Writable<KeystoreKeyDto[]> = writable([]);
export const updateLinkPresets = async (token: string) => {
  const keystoreResponse = await getKeystore(token);
  const linkPresetKey = 'memorandum.link-preset';
  adminLinkPresetStore.set(
    keystoreResponse.filter((preset) => preset.key === linkPresetKey),
  );
  adminLinkPresetStore.subscribe((value) =>
    console.log({ adminLinkPresetStore: value }, 'Link presets reloaded.'),
  );

  loadPresetFolders();
};

export const allPresetFoldersStore: Writable<FolderDto[]> = writable([]);
const loadPresetFolders = () => {
  if (adminLinkPresetStore.subscribe((value) => value.length === 0)) return;

  adminLinkPresetStore.subscribe((value) =>
    allPresetFoldersStore.set(
      value.map((preset) => JSON.parse(preset.value).Folders).flat(),
    ),
  );
  allPresetFoldersStore.subscribe((value) =>
    console.log({ presetFolders: value }, 'Preset folders initialized.'),
  );
};

export const adminIdentifiersStore: Writable<IdentifierDto[]> = writable([]);
export const updateIdentifiers = async (token: string) => {
  adminIdentifiersStore.set(await getIdentifiers(token));
  adminIdentifiersStore.subscribe((value) =>
    console.log({ adminIdentifiersStore: value }, 'Identifiers reloaded.'),
  );
};

export const adminTogglesStore: Writable<KeystoreKeyDto[]> = writable([]);

export const adminJokesStore: Writable<JokeDto[]> = writable([]);

export const updateJokes = async (token: string) => {
  adminJokesStore.set(await getJokes(token));
  adminJokesStore.subscribe((value) =>
    console.log({ allJokes: value }, 'Jokes reloaded.'),
  );
};

export const adminTokenStore = writable('');

export const confirmDeleteIdentifierOpenOverlayStore = writable(false);

export const confirmDeleteIdentifierActionStore = writable();

export const confirmDeletePresetOpenOverlayStore = writable(false);

export const confirmDeletePresetActionStore = writable();

export const confirmDeleteJokeOpenOverlayStore = writable(false);

export const confirmDeleteJokeActionStore = writable();

export const confirmDeleteToggleOpenOverlayStore = writable(false);

export const confirmDeleteToggleActionStore = writable();

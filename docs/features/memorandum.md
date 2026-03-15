# Memorandum

> Bookmark and link manager — per-user folder hierarchy stored in the Keystore (MongoDB).

## Architecture Pattern

Memorandum stores bookmarks and folder structures as Keystore entries scoped to a user's identifier UUID. There is no separate Memorandum MongoDB collection — all data is stored in the shared Keystore. User identity is managed via the Identifiers service.

---

## Backend

**NX Library**: `backend/libs/memorandum/`
**Path alias**: `@backend/memorandum`

The Memorandum module does not define its own services — it re-exports the shared `KeystoreMongoDbService` and `IdentifiersService` via two controllers.

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/memorandum.module.ts` | NestJS module (imports KeystorePersistence + Identifiers) |
| `src/lib/keystore.controller.ts` | Exposes Keystore CRUD at `/keystore` |
| `src/lib/identifiers.controller.ts` | Exposes Identifiers CRUD at `/identifiers` |

### API Endpoints — Keystore (`/keystore`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/keystore` | Bearer | List all keys (admin) |
| GET | `/v1/keystore/:identifier/:key` | Public | Get a single key |
| POST | `/v1/keystore` | Public | Create a key |
| PUT | `/v1/keystore/:identifier/:key` | Public | Update a key's value |
| DELETE | `/v1/keystore/:identifier/:key` | Bearer | Delete a key |

### API Endpoints — Identifiers (`/identifiers`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/identifiers` | Bearer | List all identifiers |
| GET | `/v1/identifiers/:id` | Public | Get by ID |
| POST | `/v1/identifiers` | Bearer | Create new |
| PUT | `/v1/identifiers/:id` | Public | Update name |
| DELETE | `/v1/identifiers/:id` | Bearer | Delete |

---

## Frontend

**Route**: `/memorandum`
**Route files**: `frontend/src/routes/memorandum/+page.svelte`, `+page.ts`

### API Clients

- `frontend/src/lib/api/keystore.api.ts` — CRUD for bookmark/folder data
- `frontend/src/lib/api/identifiers.api.ts` — user identity management

### Types

| Type file | Description |
|-----------|-------------|
| `memorandum.dto.ts` | Link/bookmark DTOs |
| `memorandum-folder.ts` | Folder structure types |
| `keystore.dto.ts` | Keystore entry types |
| `identifiers.dto.ts` | Identifier types |

### i18n Key Prefix

Keys under `memorandum.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_MEMORANDUM` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.memorandum` |
| Route config | `applicationRoutes.memorandum` |

---

## Shared Infrastructure Dependencies

- [keystore-persistence.md](../shared/keystore-persistence.md) — data storage
- [identifiers.md](../shared/identifiers.md) — user namespacing
- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [auth-guard.md](../shared/auth-guard.md)

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `frontend/src/lib/components/memorandum/FolderArea.svelte` | Main folder grid; FAB always visible |
| `frontend/src/lib/components/memorandum/FolderOverlay.svelte` | Dual-mode Carbon Modal: **create** (FAB) and **edit** (context menu) |
| `frontend/src/lib/components/memorandum/LinkOverlay.svelte` | Modal for creating/editing links |
| `frontend/src/lib/components/memorandum/Startup.svelte` | Zero-state screen with "create folder" CTA |

### Folder Create/Edit Pattern

`FolderOverlay.svelte` handles both modes via `type = $derived(currentFolderId ? 'edit' : 'new')`:

- **Create** (FAB in `FolderArea.svelte`): `bind:open={createFolderModalOpen}`, no `currentFolderId` → pre-fills default name, resets color sliders, pushes new `FolderClass` to `$localPresetStore`, calls `celebrate()`.
- **Edit** (context menu in `Folder.svelte`): `bind:open={$folderOverlayOptionsStore.showOverlay}` in `+page.svelte`, `currentFolderId` is set → loads persisted name and background color.

The FAB is **always visible** (not gated on `Folders.length > 0`). The zero-state screen also opens the create modal via its CTA button.

---

## Key Implementation Notes

- Memorandum has **no dedicated MongoDB schema** — all data lives in the shared Keystore collection.
- Each user's data is scoped by their identifier UUID as the `identifier` field in Keystore entries.
- The user's identifier UUID is stored in localStorage and sent with every Keystore request.
- Folder structure and bookmark list are stored as separate Keystore keys under the same identifier.

# Keystore Persistence

> Generic key-value store backed by MongoDB. Used for feature toggles, memorandum links/folders, and settings.

## Overview

The Keystore is a generic `{ identifier, key, value }` store. Any part of the system can use it by choosing a unique `identifier` namespace. The same MongoDB collection stores all keys from all features.

---

## Backend Service

**File**: `backend/libs/shared/provider/keystore-persistence/src/lib/keystore-mongodb.service.ts`
**Path alias**: `@backend/shared-keystore-persistence`

### Schema

```ts
{
  _id: string;        // randomUUID()
  identifier: string; // namespace (e.g. 'tilloh-toggles', user identifier ID)
  key: string;        // the key name
  value: string;      // the value (always stored as string)
  created: Date;
  updated: Date;
}
```

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `findAll` | `(filter?) → KeystoreDto[]` | List all keys, optionally filtered |
| `findOne` | `(identifier, key) → KeystoreDto` | Get a single key (throws 404 if missing) |
| `create` | `(identifier, key, value) → KeystoreDto` | Create a new key |
| `update` | `(identifier, key, body) → KeystoreDto` | Update value (throws 404 if missing) |
| `remove` | `(identifier, key) → KeystoreDto` | Delete a key (throws 404 if missing) |

---

## HTTP API (via MemorandumModule)

The Keystore endpoints are exposed under `/keystore` by the `KeystoreController` in `backend/libs/memorandum/`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/keystore` | Bearer | List all keys (filterable by query params) |
| GET | `/v1/keystore/:identifier/:key` | Public | Get a single key |
| POST | `/v1/keystore` | Public | Create a key |
| PUT | `/v1/keystore/:identifier/:key` | Public | Update a key's value |
| DELETE | `/v1/keystore/:identifier/:key` | Bearer | Delete a key |

---

## Frontend API Client

**File**: `frontend/src/lib/api/keystore.api.ts`

Key functions:
- `getKeystoreEntry(identifier, key)` — used by `getToggleValue()`
- `updateKeystoreEntry(identifier, key, value)` — used by admin toggle UI

---

## Known Identifiers / Namespaces

| Identifier | Used by | Description |
|------------|---------|-------------|
| `tilloh-toggles` | Toggle system | All feature toggle flags |
| `<user-identifier-id>` | Memorandum | Per-user links and folder structure |

---

## Related

- [toggle-system.md](toggle-system.md) — toggle lifecycle built on top of Keystore
- [identifiers.md](identifiers.md) — user identity provider (provides the `identifier` values for Memorandum)

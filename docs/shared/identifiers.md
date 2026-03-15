# Identifiers

> User identity provider — named UUIDs stored in MongoDB, used as namespaces in the Keystore.

## Overview

An "identifier" is a named, persistent UUID that represents a user or a logical namespace. The Memorandum feature uses identifiers to scope bookmarks/links per user. The Admin feature uses identifiers for verification.

---

## Backend

**NX Library**: `backend/libs/shared/provider/identifiers/`
**Path alias**: `@backend/shared-identifiers`

### Files

| File | Purpose |
|------|---------|
| `src/lib/identifier.service.ts` | Business logic (listIdentifiers, createIdentifier, ...) |
| `src/lib/identifiers-mongodb.service.ts` | MongoDB CRUD layer |
| `src/lib/schema/identifiers.schema.ts` | Mongoose schema |

### Schema

```ts
{
  _id: string;   // UUID
  name: string;  // human-readable name
  created: Date;
  updated: Date;
}
```

### Service Methods

| Method | Description |
|--------|-------------|
| `listIdentifiers(filter?)` | Get all identifiers |
| `getIdentifier({ id })` | Get by ID (throws 404) |
| `createIdentifier({ name })` | Create new identifier |
| `updateIdentifier(id, dto)` | Update name |
| `deleteIdentifier(id)` | Delete (throws 404) |

---

## HTTP API (via MemorandumModule)

Endpoints exposed under `/identifiers` by `IdentifiersController` in `backend/libs/memorandum/`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/identifiers` | Bearer | List all identifiers |
| GET | `/v1/identifiers/:id` | Public | Get by ID |
| POST | `/v1/identifiers` | Bearer | Create new |
| PUT | `/v1/identifiers/:id` | Public | Update name |
| DELETE | `/v1/identifiers/:id` | Bearer | Delete |

---

## Frontend API Client

**File**: `frontend/src/lib/api/identifiers.api.ts`

**Type**: `frontend/src/lib/types/identifiers.dto.ts`

---

## Usage Pattern

1. Admin creates an identifier (gives it a name, gets back UUID).
2. UUID is stored in localStorage on the user's device.
3. All Keystore calls for that user use their UUID as the `identifier` parameter.
4. Admin verification: `POST /v1/admin/verify` checks if a submitted UUID exists as an identifier.

---

## Related

- [keystore-persistence.md](keystore-persistence.md) — uses identifier UUIDs as namespaces
- [auth-guard.md](auth-guard.md) — admin verify endpoint

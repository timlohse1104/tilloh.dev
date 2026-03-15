# Todo

> Shared, collaborative todo lists with real-time optimistic locking — persisted in MongoDB.

## Architecture Pattern

Todo lists are stored in MongoDB and exposed via REST. The frontend supports both local lists (localStorage only) and shared lists (synced to backend). Updates use optimistic locking via a `version` field to prevent concurrent-write data loss.

---

## Backend

**NX Library** (3-tier): `backend/libs/todo/`
**Path aliases**:
- `@backend/todo-controller` → `libs/todo/todo-controller/`
- `@backend/todo-provider` → `libs/todo/todo-provider/`
- `@backend/todo-persistence` → `libs/todo/todo-persistence/`

### Module Structure

| File | Purpose |
|------|---------|
| `todo-controller/src/lib/todo.controller.ts` | HTTP endpoints |
| `todo-provider/src/lib/todo-provider.service.ts` | Business logic |
| `todo-persistence/src/lib/todo-persistence.service.ts` | MongoDB layer (optimistic locking) |
| `todo-persistence/src/lib/schema/todo.schema.ts` | Mongoose schema (`SharedTodoList`) |

### Schema

```ts
SharedTodoList {
  name: string;
  emoji: string;
  todos: Todo[];        // { id, title, done?, category? }
  history: HistoryEntry[]; // { title, category }
  categories: string[];
  version: number;      // incremented on every update
  created: Date;
  updated: Date;
}
```

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/shared-todo-lists` | Bearer | List all shared lists |
| GET | `/v1/shared-todo-lists/:id` | Public | Get a single list |
| POST | `/v1/shared-todo-lists` | Public | Create new list |
| PUT | `/v1/shared-todo-lists/:id` | Public | Update list (version required) |
| DELETE | `/v1/shared-todo-lists/:id` | Public | Delete list |

### Optimistic Locking

`PUT /v1/shared-todo-lists/:id` requires `version` in the body. The persistence layer uses an atomic MongoDB `findOneAndUpdate` with `{ _id: id, version: currentVersion }` as the filter. If no document is updated:
- If the document doesn't exist → 404 `NotFoundException`
- If it exists but version differs → 409 `ConflictException`

---

## Frontend

**Route**: `/todo`
**Route files**: `frontend/src/routes/todo/+page.svelte`, `+page.ts`

### API Client

`frontend/src/lib/api/todo.api.ts`

| Function | Description |
|----------|-------------|
| `getSharedTodoList(id)` | Fetch a shared list by ID |
| `createSharedTodoList(name, emoji)` | Create new shared list |
| `updateSharedTodoList(id, data)` | Update list (includes `version`) |
| `deleteSharedTodoList(id)` | Delete shared list |

### Types

`frontend/src/lib/types/todo.ts`

| Type | Description |
|------|-------------|
| `Todo` | `{ id, title, done?, category? }` |
| `TodoList` | Frontend local list (includes `isShared`, `sharedId`, `version`) |
| `SharedTodoListResponse` | Backend response shape (includes `_id`, `version`, timestamps) |
| `HistoryEntry` | `{ title, category }` — completed item history |

### i18n Key Prefix

Keys under `todo.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_TODO` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.todo` |
| Route config | `applicationRoutes.todo` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [auth-guard.md](../shared/auth-guard.md)
- [nx-library-scaffold.md](../shared/nx-library-scaffold.md)

---

## Key Implementation Notes

- Local lists are stored in localStorage only and never hit the backend.
- Shared lists are identified by a `sharedId` (MongoDB `_id`) stored in localStorage alongside the local list.
- The version conflict (409) must be handled on the frontend — typically by re-fetching and re-applying changes.
- The 3-tier split (controller / provider / persistence) is unique to Todo; simpler features use a single library.

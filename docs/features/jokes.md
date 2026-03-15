# Jokes

> Daily joke display with automatic nightly fetch from external API and MongoDB persistence.

## Architecture Pattern

Jokes are fetched from `witzapi.de` (German joke API) every night at 03:00 via a cron job, stored in MongoDB, and served to the frontend. The frontend shows one joke at a time (daily or random).

---

## Backend

**NX Library**: `backend/libs/jokes/`
**Path alias**: `@backend/jokes`

This is the **reference library** for NX scaffold (see [nx-library-scaffold.md](../shared/nx-library-scaffold.md)).

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/jokes.module.ts` | NestJS module |
| `src/lib/jokes.controller.ts` | HTTP endpoints |
| `src/lib/jokes.service.ts` | Business logic + cron jobs |
| `src/lib/jokes-mongodb.service.ts` | MongoDB CRUD layer |
| `src/lib/schema/jokes.schema.ts` | Mongoose schema |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/jokes/random` | Public | Random verified joke |
| GET | `/v1/jokes/daily` | Public | Today's joke (rotated nightly) |
| GET | `/v1/jokes` | Bearer | List all jokes (filterable) |
| GET | `/v1/jokes/:id` | Bearer | Get joke by ID |
| POST | `/v1/jokes` | Public | Create new joke |
| PUT | `/v1/jokes/:id` | Bearer | Update joke |
| DELETE | `/v1/jokes/:id` | Bearer | Delete joke |

### Cron Jobs

| Schedule | Timezone | Method | Description |
|----------|----------|--------|-------------|
| `0 3 * * *` | Europe/Berlin | `persistDailyJoke()` | Fetch + store joke from `witzapi.de` |
| `30 3 * * *` | Europe/Berlin | `cleanupDuplicateJokes()` | Remove duplicate jokes |

External API: `https://witzapi.de/api/joke/?limit=1&language=de`

Uses `@nestjs/axios` + `firstValueFrom` RxJS pattern.

### DTOs

- `JokeDto` — full joke object
- `ModifyJokeDto` — create/update payload

---

## Frontend

**Route**: `/jokes`
**Route files**: `frontend/src/routes/jokes/+page.svelte`, `+page.ts`

### API Client

`frontend/src/lib/api/jokes.api.ts`

### Types

`frontend/src/lib/types/jokes.dto.ts`

### Toggle for Random Joke

There is a separate toggle `TOGGLE_RANDOM_JOKE` (distinct from the nav toggle `TOGGLE_NAV_JOKES`) that controls whether a random joke appears on the home page.

### i18n Key Prefix

Keys under `jokes.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Nav toggle key | `TOGGLE_NAV_JOKES` |
| Random joke toggle | `TOGGLE_RANDOM_JOKE` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.jokes` / `TogglesEnum.randomJoke` |
| Route config | `applicationRoutes.jokes` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [auth-guard.md](../shared/auth-guard.md)
- [nx-library-scaffold.md](../shared/nx-library-scaffold.md)

---

## Frontend Components

| Component | Description |
|-----------|-------------|
| `frontend/src/lib/components/jokes/Jokes.svelte` | Main page component — shows random joke area only |
| `frontend/src/lib/components/jokes/CreateJokeOverlay.svelte` | Carbon Modal for creating a new joke (FAB-triggered) |

### Create Joke Pattern

Joke creation uses a FAB (fixed primary button, bottom-right) that opens a Carbon Modal (`CreateJokeOverlay.svelte`). The modal contains a `TextArea` for the joke text and a `Select` for language (`de`/`en`). On success: `celebrate()` + `InlineNotification` + auto-close after ~1.5 s. The inline form that was previously embedded directly on the page has been removed.

---

## Key Implementation Notes

- `persistDailyJoke()` sets `verified: true` on all auto-fetched jokes.
- The POST endpoint is `@Public()` to allow admin tools to submit jokes manually without auth.
- `findJokeOfTheDay()` in the MongoDB service retrieves the most recent verified joke (implementation detail in schema query).

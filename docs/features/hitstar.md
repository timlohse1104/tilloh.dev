# Hitstar

> Music guessing game — players hear a Spotify track and guess its release year (Classic or Range mode).

## Architecture Pattern

The backend fetches a random track from the Spotify API using Client Credentials flow (token cached in memory). The frontend drives a state machine (MENU → LOADING → GUESSING → REVEAL → RESULTS) with 3D flip card UI. Game state and best scores are persisted per game mode in localStorage.

---

## Backend

**NX Library**: `backend/libs/hitstar/`
**Path alias**: `@backend/hitstar`

### Module Structure

| File | Purpose |
|------|---------|
| `src/lib/hitstar.module.ts` | NestJS module |
| `src/lib/hitstar.controller.ts` | HTTP endpoints |
| `src/lib/hitstar.service.ts` | Spotify API integration + token caching |

### API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/v1/hitstar/random-track` | Public | Returns a random Spotify track |

### Random Track Logic

1. Pick a random year (1955–2025) and offset (0–99).
2. Search Spotify: `q=* year:<year> genre:pop&type=track&market=DE&limit=10&offset=<offset>`
3. Filter tracks that have an `album.release_date`.
4. Return a random valid track as `SpotifyTrackDto`.
5. Retry up to 10 times if no valid tracks found.

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPOTIFY_CLIENT_ID` | Yes | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Yes | Spotify app client secret |

### Token Caching

Access token is cached in-memory on the service instance. Refreshed automatically 60 seconds before expiry using Spotify's Client Credentials flow (`POST https://accounts.spotify.com/api/token`).

---

## Frontend

**Route**: `/hitstar`
**Route files**: `frontend/src/routes/hitstar/+page.svelte`, `+page.ts`

### Game Modes

| Mode | Description |
|------|-------------|
| **Classic** | Guess the exact year of the track |
| **Range** | Guess a year range (e.g., 1990–2000) |

### State Machine

```
MENU → LOADING → GUESSING → REVEAL → RESULTS
         ↑__________________________|
                (next round)
```

- **MENU**: Start screen, select mode
- **LOADING**: Fetching random track from backend
- **GUESSING**: Player inputs year/range; Spotify embed available
- **REVEAL**: Show actual year, animate 3D flip card
- **RESULTS**: Show all round results after final round

### API Client

`frontend/src/lib/api/spotify.api.ts`

| Function | Description |
|----------|-------------|
| `getRandomTrack()` | Fetch random track from `/v1/hitstar/random-track` |

### Types

`frontend/src/lib/types/spotify.dto.ts`

| Type | Description |
|------|-------------|
| `SpotifyTrackDto` | `{ id, name, artist, album, albumCover, releaseYear, spotifyUrl, previewUrl }` |
| `HitstarRoundResult` | Per-round result including guess, actual year, points |
| `HitstarBestRound` | `{ score, date }` — persisted best score |
| `HitstarGameState` | `{ currentRound, score, currentTrack, roundResults }` — full in-progress state |

### Stores

`frontend/src/lib/util/stores/store-hitstar.ts`

| Store | localStorage key | Description |
|-------|-----------------|-------------|
| `hitstarClassicBestRoundStore` | `hitstar.classic.bestRound` | Best score for Classic mode |
| `hitstarClassicGameStateStore` | `hitstar.classic.gameState` | Saved Classic game state |
| `hitstarRangeBestRoundStore` | `hitstar.range.bestRound` | Best score for Range mode |
| `hitstarRangeGameStateStore` | `hitstar.range.gameState` | Saved Range game state |

### i18n Key Prefix

Keys under `hitstar.*` in translation files.

---

## Toggle Configuration

| Property | Value |
|----------|-------|
| Toggle key | `TOGGLE_NAV_HITSTAR` |
| Seed default | `'true'` |
| Frontend enum | `TogglesEnum.hitstar` |
| Route config | `applicationRoutes.hitstar` |

---

## Shared Infrastructure Dependencies

- [toggle-system.md](../shared/toggle-system.md)
- [route-page-pattern.md](../shared/route-page-pattern.md)
- [stores.md](../shared/stores.md) — localStorage pattern for game state
- [nx-library-scaffold.md](../shared/nx-library-scaffold.md)

---

## Key Implementation Notes

- Game state is intentionally NOT auto-resumed on mount — user must click "New Game" to start.
- The `previewUrl` can be `null` (Spotify doesn't provide previews for all tracks). The UI must handle this gracefully.
- localStorage keys were migrated in 2026-03: `hitstar.bestRound` → `hitstar.classic.bestRound`. Migration code in `store-hitstar.ts`.
- The Spotify search uses `genre:pop` filter to surface more recognizable tracks, and randomizes the year per request for variety.
- CSS 3D flip card + shake animation used in REVEAL state.
- `celebrate()` from `stores-global` triggers confetti on high scores.

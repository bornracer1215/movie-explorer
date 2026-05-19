# Movie Explorer

A small Next.js app to search movies (via TMDB), view details, and save favorites with a personal 1–5 rating and note.

## Setup

1. Install deps:
   ```bash
   npm install
   ```
2. Create `.env.local` in the project root with **one** of:
   ```
   TMDB_BEARER_TOKEN=your_v4_read_access_token
   # or
   TMDB_API_KEY=your_v3_api_key
   ```
   Get a token at https://www.themoviedb.org/settings/api.
3. Run dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Hosted app

_TODO: add Vercel URL after deploy._

## Features

- Search movies by title (server-side proxy to TMDB)
- Details view (modal): poster, overview, year, runtime, genres, tagline
- Favorites with 1–5 star rating + optional note, persisted to LocalStorage
- Empty / loading / error states for search and details
- Saved indicator on result cards

## Technical decisions & tradeoffs

- **API proxy.** The TMDB token never reaches the browser — all calls go through `/api/search` and `/api/movie/[id]` (Next.js route handlers in `src/app/api/`). The shared `tmdbFetch` helper in `src/lib/tmdb.ts` reads `TMDB_BEARER_TOKEN` or `TMDB_API_KEY` from the server env and surfaces TMDB error messages with status codes.
- **State management.** Plain React state in a single client component (`src/app/page.tsx`) plus a `useFavorites` hook. No Redux/Zustand — overkill for one screen.
- **Persistence.** LocalStorage only (key `movie-explorer:favorites:v1`). Chosen over a DB to stay in the 3-hour scope; favorites are per-browser. The shape is versioned in the key so a future migration is straightforward.
- **Details view.** Modal rather than a separate route. Simpler navigation, keeps the search results on screen, fewer files. Tradeoff: details aren't deep-linkable.
- **Images.** TMDB image host is allowed in `next.config.mjs`. `next/image` is used with `unoptimized` to avoid Vercel image-optimization quotas on the free tier.
- **Styling.** Tailwind, no component library — keeps the bundle small and the markup readable.

## Known limitations / what I'd improve with more time

- No pagination on search results (TMDB returns 20 per page; we only show page 1).
- No debounced live search — submit-driven.
- No server-side persistence; favorites don't sync across devices. A `/api/favorites` route backed by SQLite/Postgres would be the next step.
- No tests. Would add a small Vitest suite for `useFavorites` and a Playwright smoke test for search → details → save.
- Accessibility is basic (labels, ESC-to-close); modal could trap focus and restore it on close.
- No theming toggle; relies on system dark mode.
- Details modal could show cast, trailer, and external ratings (a second TMDB call to `/movie/{id}?append_to_response=credits,videos`).

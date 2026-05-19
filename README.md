# Movie Explorer

Small Next.js app to search movies, look at details, and save favorites with a rating and note.

Live: https://movie-explorer-ten-alpha.vercel.app/

## Running it locally

```bash
npm install
```

Then create a `.env.local` in this folder with a TMDB credential. You only need one of these:

```
TMDB_BEARER_TOKEN=your_v4_read_access_token
# or
TMDB_API_KEY=your_v3_api_key
```

You can grab either one from https://www.themoviedb.org/settings/api (free, takes a minute).

```bash
npm run dev
```

App is on http://localhost:3000.

## What it does

- Search a title, see results (poster, title, year, short overview)
- Click a card to open a details modal with runtime, genres, tagline
- Save to favorites with a 1-5 star rating and an optional note
- Favorites stick around between refreshes (LocalStorage)
- Handles empty results, network errors, and bad input

## Decisions I made

**Key stays on the server.** The TMDB token is read inside `src/lib/tmdb.ts` and only ever runs in API routes (`/api/search`, `/api/movie/[id]`). The browser only talks to my own routes. If you open DevTools > Network you won't see any call to themoviedb.org.

**No state library.** It's basically one page. A `useFavorites` hook for the LocalStorage side and `useState` for everything else was enough. Adding Zustand or Redux here felt like overkill.

**LocalStorage, not a database.** Spec says server-side persistence is optional and to not overbuild for a 3-hour scope, so I skipped it. The storage key (`movie-explorer:favorites:v1`) is versioned so swapping in a real backend later wouldn't need a migration headache.

**Modal for details, not a separate page.** Keeps you in the search results, fewer files. The downside is details aren't shareable by URL - if I wanted that I'd move it to `/movie/[id]`.

**Tailwind, no UI library.** Faster to ship for something this small.

**`next/image` with `unoptimized`.** TMDB posters work fine and I didn't want to burn Vercel's image optimization quota on a free deploy.

## Things I'd add next

- **Server-side favorites + simple auth** so the list syncs across devices. Probably SQLite via Prisma, or just Vercel Postgres + a magic-link login.
- **Watchlist** as a separate list from rated favorites. "Saved to watch later" is different from "I watched it and here's what I thought."
- **Recommendations.** TMDB has a `/movie/{id}/recommendations` endpoint - would be cool to show "because you liked X" on the home screen.
- **Trailers in the modal** using TMDB's videos endpoint.
- **Filters and sort** on favorites (by rating, date added, year).
- **Search filters** (genre, year range).
- Pagination on search results - right now I only show TMDB's first page.

## Stuff I know is rough

- No tests. Would write a few for `useFavorites` and a Playwright run-through of search > save > refresh.
- Modal doesn't trap focus or restore it on close - accessibility is basic.
- No debounced live search. Submit-driven for now.
- Dark mode follows the OS, no manual toggle.
- Search only hits page 1 of TMDB results.

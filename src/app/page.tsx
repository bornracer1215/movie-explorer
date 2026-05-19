"use client";

import { useCallback, useState } from "react";
import type { TmdbMovie, TmdbSearchResponse } from "@/types/tmdb";
import type { Favorite } from "@/types/favorite";
import { useFavorites } from "@/lib/favorites";
import { SearchBar } from "@/components/SearchBar";
import { MovieCard } from "@/components/MovieCard";
import { MovieModal } from "@/components/MovieModal";
import { FavoritesPanel } from "@/components/FavoritesPanel";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const {
    favorites,
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    updateFavorite,
  } = useFavorites();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selected, setSelected] = useState<TmdbMovie | null>(null);

  const runSearch = useCallback(async (q: string) => {
    setQuery(q);
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Search failed (${res.status})`);
      }
      const data = (await res.json()) as TmdbSearchResponse;
      setResults(data.results ?? []);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setResults([]);
      setStatus("error");
    }
  }, []);

  function openMovie(movie: TmdbMovie) {
    setSelected(movie);
  }

  function openFromFavorite(fav: Favorite) {
    setSelected({
      id: fav.id,
      title: fav.title,
      poster_path: fav.posterPath,
      backdrop_path: null,
      release_date: fav.releaseDate,
      overview: "",
      vote_average: 0,
    });
  }

  function quickToggleFavorite(movie: TmdbMovie) {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        rating: 0,
        note: "",
      });
    }
  }

  function saveFromModal(movie: TmdbMovie, rating: number, note: string) {
    if (isFavorite(movie.id)) {
      updateFavorite(movie.id, { rating, note });
    } else {
      addFavorite({
        id: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
        rating,
        note,
      });
    }
    setSelected(null);
  }

  function removeFromModal(id: number) {
    removeFavorite(id);
    setSelected(null);
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Movie Explorer</h1>
        <p className="text-sm text-neutral-500">
          Search movies, view details, save favorites with a rating and note.
        </p>
      </header>

      <div className="mb-6">
        <SearchBar onSearch={runSearch} loading={status === "loading"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <section aria-label="Search results">
          {status === "idle" && (
            <p className="text-sm text-neutral-500">
              Try searching for a movie title above.
            </p>
          )}
          {status === "loading" && (
            <p className="text-sm text-neutral-500">Loading…</p>
          )}
          {status === "error" && (
            <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
              {errorMsg ?? "Something went wrong."}
            </div>
          )}
          {status === "success" && results.length === 0 && (
            <p className="text-sm text-neutral-500">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}
          {status === "success" && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  isFavorite={isFavorite(m.id)}
                  onOpen={openMovie}
                  onToggleFavorite={quickToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>

        <aside aria-label="Favorites" className="lg:sticky lg:top-4 lg:self-start">
          <h2 className="text-lg font-semibold mb-2">
            Favorites{" "}
            <span className="text-sm text-neutral-500">({favorites.length})</span>
          </h2>
          <FavoritesPanel
            favorites={favorites}
            onOpen={openFromFavorite}
            onRemove={removeFavorite}
          />
        </aside>
      </div>

      {selected && (
        <MovieModal
          movie={selected}
          favorite={getFavorite(selected.id)}
          onClose={() => setSelected(null)}
          onSave={saveFromModal}
          onRemove={removeFromModal}
        />
      )}
    </div>
  );
}

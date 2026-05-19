"use client";

import { useEffect, useState } from "react";
import type { TmdbMovie, TmdbMovieDetails } from "@/types/tmdb";
import type { Favorite } from "@/types/favorite";
import { Poster } from "./Poster";
import { RatingStars } from "./RatingStars";

type Props = {
  movie: TmdbMovie;
  favorite: Favorite | undefined;
  onClose: () => void;
  onSave: (movie: TmdbMovie, rating: number, note: string) => void;
  onRemove: (id: number) => void;
};

export function MovieModal({ movie, favorite, onClose, onSave, onRemove }: Props) {
  const [details, setDetails] = useState<TmdbMovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(favorite?.rating ?? 0);
  const [note, setNote] = useState(favorite?.note ?? "");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/movie/${movie.id}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          throw new Error(body.error || `Request failed (${r.status})`);
        }
        return r.json() as Promise<TmdbMovieDetails>;
      })
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const isSaved = Boolean(favorite);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  function handleSave() {
    onSave(movie, rating, note);
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold">{movie.title}</h2>
            <p className="text-sm text-neutral-500">
              {year}
              {details?.runtime ? ` · ${details.runtime} min` : ""}
              {details?.genres?.length
                ? ` · ${details.genres.map((g) => g.name).join(", ")}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none px-2 hover:opacity-70"
          >
            ×
          </button>
        </div>

        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <Poster
            path={movie.poster_path}
            alt={movie.title}
            size="w342"
            className="w-full sm:w-48 aspect-[2/3] object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            {details?.tagline && (
              <p className="italic text-sm text-neutral-500 mb-2">
                {details.tagline}
              </p>
            )}
            {loading && <p className="text-sm text-neutral-500">Loading details…</p>}
            {error && (
              <p className="text-sm text-red-600">Couldn’t load details: {error}</p>
            )}
            <p className="text-sm leading-relaxed">
              {movie.overview || "No description available."}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Your rating</label>
            <RatingStars value={rating} onChange={setRating} />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-1">
              Note (optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you think?"
            />
          </div>
          <div className="flex gap-2 justify-end">
            {isSaved && (
              <button
                type="button"
                onClick={() => onRemove(movie.id)}
                className="px-4 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                Remove
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              {isSaved ? "Update" : "Save to favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

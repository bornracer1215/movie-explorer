"use client";

import type { TmdbMovie } from "@/types/tmdb";
import { Poster } from "./Poster";

type Props = {
  movie: TmdbMovie;
  isFavorite: boolean;
  onOpen: (movie: TmdbMovie) => void;
  onToggleFavorite: (movie: TmdbMovie) => void;
};

export function MovieCard({ movie, isFavorite, onOpen, onToggleFavorite }: Props) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "-";
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:shadow-md transition">
      <button
        type="button"
        onClick={() => onOpen(movie)}
        className="text-left"
        aria-label={`Open details for ${movie.title}`}
      >
        <Poster
          path={movie.poster_path}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover bg-neutral-100"
        />
      </button>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-semibold leading-snug line-clamp-2">{movie.title}</h3>
          <p className="text-xs text-neutral-500">{year}</p>
        </div>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-3">
          {movie.overview || "No overview."}
        </p>
        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpen(movie)}
            className="flex-1 text-sm px-3 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(movie)}
            className={`text-sm px-3 py-1.5 rounded-md font-medium ${
              isFavorite
                ? "bg-yellow-400 text-black hover:bg-yellow-500"
                : "bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90"
            }`}
          >
            {isFavorite ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

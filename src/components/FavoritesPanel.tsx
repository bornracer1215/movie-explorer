"use client";

import type { Favorite } from "@/types/favorite";
import { Poster } from "./Poster";
import { RatingStars } from "./RatingStars";

type Props = {
  favorites: Favorite[];
  onOpen: (favorite: Favorite) => void;
  onRemove: (id: number) => void;
};

export function FavoritesPanel({ favorites, onOpen, onRemove }: Props) {
  if (favorites.length === 0) {
    return (
      <p className="text-sm text-neutral-500">
        Nothing saved yet.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {favorites.map((f) => (
        <li
          key={f.id}
          className="flex gap-3 p-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        >
          <button
            type="button"
            onClick={() => onOpen(f)}
            className="flex-shrink-0"
            aria-label={`Open ${f.title}`}
          >
            <Poster
              path={f.posterPath}
              alt={f.title}
              size="w185"
              className="w-16 aspect-[2/3] object-cover rounded"
            />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpen(f)}
                className="font-medium text-left truncate hover:underline"
              >
                {f.title}
              </button>
              <button
                type="button"
                onClick={() => onRemove(f.id)}
                aria-label={`Remove ${f.title}`}
                className="text-neutral-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              {f.releaseDate ? f.releaseDate.slice(0, 4) : "-"}
            </p>
            <div className="mt-1">
              <RatingStars value={f.rating} size="sm" readOnly />
            </div>
            {f.note && (
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                {f.note}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

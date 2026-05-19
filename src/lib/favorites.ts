"use client";

import { useCallback, useEffect, useState } from "react";
import type { Favorite } from "@/types/favorite";

// bump the version if the Favorite shape changes
const STORAGE_KEY = "movie-explorer:favorites:v1";

function read(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Favorite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(favs: Favorite[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // load once on mount, then mirror state to localStorage on every change
  useEffect(() => {
    setFavorites(read());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) write(favorites);
  }, [favorites, hydrated]);

  // TODO: listen for `storage` events so two open tabs stay in sync

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const getFavorite = useCallback(
    (id: number) => favorites.find((f) => f.id === id),
    [favorites]
  );

  const addFavorite = useCallback((fav: Omit<Favorite, "addedAt">) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === fav.id)) return prev;
      return [{ ...fav, addedAt: Date.now() }, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateFavorite = useCallback(
    (id: number, patch: Partial<Pick<Favorite, "rating" | "note">>) => {
      setFavorites((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f))
      );
    },
    []
  );

  return {
    favorites,
    hydrated,
    isFavorite,
    getFavorite,
    addFavorite,
    removeFavorite,
    updateFavorite,
  };
}

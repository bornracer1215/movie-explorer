"use client";

import { FormEvent, useState } from "react";

type Props = {
  initialValue?: string;
  onSearch: (query: string) => void;
  loading?: boolean;
};

export function SearchBar({ initialValue = "", onSearch, loading }: Props) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSearch(q);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search movies (e.g. Inception)"
        className="flex-1 px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search movies"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium disabled:opacity-50 hover:bg-blue-700"
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

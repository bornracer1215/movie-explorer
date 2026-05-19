const TMDB_BASE = "https://api.themoviedb.org/3";

export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export class TmdbError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const bearer = process.env.TMDB_BEARER_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!bearer && !apiKey) {
    throw new TmdbError(
      "TMDB credentials missing. Set TMDB_BEARER_TOKEN or TMDB_API_KEY in .env.local",
      500
    );
  }

  const url = new URL(TMDB_BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  if (!bearer && apiKey) url.searchParams.set("api_key", apiKey);

  const headers: Record<string, string> = { accept: "application/json" };
  if (bearer) headers.authorization = `Bearer ${bearer}`;

  const res = await fetch(url, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { status_message?: string };
      detail = body.status_message ?? "";
    } catch {
      // ignore
    }
    throw new TmdbError(
      detail || `TMDB request failed (${res.status})`,
      res.status
    );
  }

  return (await res.json()) as T;
}

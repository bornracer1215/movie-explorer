import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import type { TmdbMovieDetails } from "@/types/tmdb";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }

  try {
    const data = await tmdbFetch<TmdbMovieDetails>(`/movie/${id}`);
    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}

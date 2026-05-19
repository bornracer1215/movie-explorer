import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch, TmdbError } from "@/lib/tmdb";
import type { TmdbSearchResponse } from "@/types/tmdb";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const pageParam = req.nextUrl.searchParams.get("page");
  const page = pageParam ? Math.max(1, Number(pageParam) || 1) : 1;

  if (!q) {
    return NextResponse.json(
      { error: "Missing 'q' query parameter" },
      { status: 400 }
    );
  }

  try {
    const data = await tmdbFetch<TmdbSearchResponse>("/search/movie", {
      query: q,
      page,
      include_adult: "false",
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err instanceof TmdbError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status });
  }
}

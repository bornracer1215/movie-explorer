export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

export type TmdbSearchResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type TmdbMovieDetails = TmdbMovie & {
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string | null;
  status: string;
};

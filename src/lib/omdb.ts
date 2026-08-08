/**
 * Film posters from OMDb. The one source that needs a key: a free one comes
 * from https://omdbapi.com/apikey.aspx and goes in OMDB_API_KEY. Without it the
 * Movies section still lists your films, just without posters.
 *
 * OMDb answers HTTP 200 to everything and reports failure in the body as
 * `Response: "False"`, and writes missing fields as the string "N/A".
 */

import type { MovieRef } from "@/content/interests";
import { COVER_TTL, type Cover, mapWithLimit, unresolved } from "@/lib/media";

const API = "https://www.omdbapi.com/";

type OmdbResponse = {
  Response?: "True" | "False";
  Error?: string;
  Title?: string;
  Year?: string;
  Poster?: string;
  imdbID?: string;
};

function value(field: string | undefined): string | null {
  return !field || field === "N/A" ? null : field;
}

export function isOmdbConfigured(): boolean {
  return Boolean(process.env.OMDB_API_KEY);
}

async function lookup(ref: MovieRef): Promise<Cover> {
  const key = process.env.OMDB_API_KEY;
  if (!key) return unresolved(ref.title);

  try {
    const params = new URLSearchParams({ apikey: key, t: ref.title, type: "movie" });

    const response = await fetch(`${API}?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: COVER_TTL },
    });

    if (!response.ok) {
      console.warn(`[omdb] "${ref.title}": ${response.status} ${response.statusText}`);
      return unresolved(ref.title);
    }

    const json = (await response.json()) as OmdbResponse;
    if (json.Response !== "True") {
      console.warn(`[omdb] "${ref.title}": ${json.Error ?? "not found"}`);
      return unresolved(ref.title);
    }

    const id = value(json.imdbID);

    return {
      id: id ?? ref.title,
      title: value(json.Title) ?? ref.title,
      meta: value(json.Year),
      image: value(json.Poster),
      url: id ? `https://www.imdb.com/title/${id}/` : null,
    };
  } catch (error) {
    console.warn(`[omdb] "${ref.title}" unavailable:`, error);
    return unresolved(ref.title);
  }
}

export async function getMovies(refs: MovieRef[]): Promise<Cover[]> {
  return mapWithLimit(refs, 4, lookup);
}

// Mangadex API Configuration

import type { MangaRef } from "@/content/interests";
import {
  COVER_TTL,
  type Cover,
  mapWithLimit,
  normalise,
  unresolved,
} from "@/lib/media";

const API = "https://api.mangadex.org/manga";
const UPLOADS = "https://uploads.mangadex.org/covers";
const RATINGS = ["safe", "suggestive", "erotica" ]; // If you are reading is and judging that why is there erotica, its just for berserk to come up don't judge me :(

type Manga = {
  id: string;
  attributes?: {
    title?: Record<string, string>;
    altTitles?: Record<string, string>[];
    year?: number | null;
  };
  relationships?: { type: string; attributes?: { fileName?: string } }[];
};

function displayTitle(manga: Manga): string | null {
  const title = manga.attributes?.title;
  return title ? (title.en ?? Object.values(title)[0] ?? null) : null;
}

function rank(manga: Manga, ref: MangaRef): number {
  const want = normalise(ref.title);
  const primary = displayTitle(manga);
  const year = manga.attributes?.year;
  const altTitles = (manga.attributes?.altTitles ?? []).flatMap((alt) => Object.values(alt));

  const score = (ref.year && year === Number(ref.year) ? 100 : 0) + (typeof year === "number" ? 1 : 0);

  if (primary && normalise(primary) === want) return score + 10;
  if (altTitles.some((title) => normalise(title) === want)) return score + 5;
  return score;
}

async function lookup(ref: MangaRef): Promise<Cover> {
  try {
    const params = new URLSearchParams({
      title: ref.title,
      limit: "10",
      "order[relevance]": "desc",
      "includes[]": "cover_art",
    });
    for (const rating of RATINGS) params.append("contentRating[]", rating);

    const response = await fetch(`${API}?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: COVER_TTL },
    });

    if (!response.ok) {
      console.warn(`[mangadex] "${ref.title}": ${response.status} ${response.statusText}`);
      return unresolved(ref.title);
    }

    const json = (await response.json()) as { data?: Manga[] };
    const candidates = json.data ?? [];
    if (candidates.length === 0) return unresolved(ref.title);

    const manga = candidates.reduce((best, candidate) =>
      rank(candidate, ref) > rank(best, ref) ? candidate : best,
    );

    const file = manga.relationships?.find((rel) => rel.type === "cover_art")?.attributes?.fileName;
    const year = manga.attributes?.year;

    return {
      id: manga.id,
      title: displayTitle(manga) ?? ref.title,
      meta: year ? String(year) : null,
      image: file ? `${UPLOADS}/${manga.id}/${file}.512.jpg` : null,
      url: `https://mangadex.org/title/${manga.id}`,
    };
  } catch (error) {
    console.warn(`[mangadex] "${ref.title}" unavailable:`, error);
    return unresolved(ref.title);
  }
}

export async function getManga(refs: MangaRef[]): Promise<Cover[]> {
  return mapWithLimit(refs, 3, lookup);
}

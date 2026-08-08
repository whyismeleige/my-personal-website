// Open Library API Configuration

import type { BookRef } from "@/content/interests";
import {
  COVER_TTL,
  type Cover,
  mapWithLimit,
  normalise,
  unresolved,
} from "@/lib/media";

const SEARCH = "https://openlibrary.org/search.json";
const COVERS = "https://covers.openlibrary.org/b/id";
const FIELDS = "key,title,author_name,first_publish_year,cover_i,edition_count";

type Doc = {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  edition_count?: number;
};

function best(docs: Doc[], title: string): Doc | null {
  const withCover = docs.filter((doc) => typeof doc.cover_i === "number");
  if (withCover.length === 0) return null;

  const exact = withCover.filter((doc) => normalise(doc.title ?? "") === normalise(title));
  const pool = exact.length > 0 ? exact : withCover;

  return pool.reduce((a, b) => ((b.edition_count ?? 0) > (a.edition_count ?? 0) ? b : a));
}

async function lookup(ref: BookRef): Promise<Cover> {
  try {
    const params = new URLSearchParams({ title: ref.title, limit: "10", fields: FIELDS });
    if (ref.author) params.set("author", ref.author);

    const response = await fetch(`${SEARCH}?${params}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: COVER_TTL },
    });

    if (!response.ok) {
      console.warn(`[openlibrary] "${ref.title}": ${response.status} ${response.statusText}`);
      return unresolved(ref.title, ref.author ?? null);
    }

    const json = (await response.json()) as { docs?: Doc[] };
    const doc = best(json.docs ?? [], ref.title);
    if (!doc) return unresolved(ref.title, ref.author ?? null);

    return {
      id: doc.key ?? ref.title,
      title: doc.title ?? ref.title,
      // Prefer the author you wrote: `author_name` mixes in translators and
      // editors in no reliable order, and romanises nothing.
      meta: ref.author ?? doc.author_name?.[0] ?? null,
      // `default=false` makes a missing cover 404 rather than redirect to a
      // placeholder, which would render as an empty grey rectangle.
      image: `${COVERS}/${doc.cover_i}-L.jpg?default=false`,
      url: doc.key ? `https://openlibrary.org${doc.key}` : null,
    };
  } catch (error) {
    console.warn(`[openlibrary] "${ref.title}" unavailable:`, error);
    return unresolved(ref.title, ref.author ?? null);
  }
}

export async function getBooks(refs: BookRef[]): Promise<Cover[]> {
  return mapWithLimit(refs, 4, lookup);
}

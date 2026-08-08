/**
 * Shared vocabulary for the artwork grids on the Interests page.
 *
 * throws and never drops an item: failures produce a `Cover` with `image: null`
 * so the card still renders with the title you wrote.
 */

export type Cover = {
  id: string;
  title: string;
  meta: string | null;
  image: string | null;
  url: string | null;
};

/** Cover art for a published work does not change. */
export const COVER_TTL = 60 * 60 * 24 * 7;

export function normalise(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A card with the title you supplied and nothing the API could add. */
export function unresolved(title: string, meta: string | null = null): Cover {
  const id = normalise(title).replace(/ /g, "-") || "untitled";
  return { id, title, meta, image: null, url: null };
}

/** Runs lookups a few at a time; these APIs rate-limit a whole list fired at once. */
export async function mapWithLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await fn(items[index]);
      }
    },
  );

  await Promise.all(workers);
  return results;
}

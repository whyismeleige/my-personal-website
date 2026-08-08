/**
 * Top artists from Spotify, fetched server-side on the Interests page.
 *
 * Auth is the refresh-token flow: `user-top-read` is user-scoped, so a plain
 * client-credentials token will not work. The env vars never reach the browser
 * — this module must only ever be imported by a server component.
 *
 * Every failure path returns an empty list. An outage, an expired refresh token
 * or missing credentials must render the page without the section, never a
 * broken one.
 */

import type { Cover } from "@/lib/media";
import { TOKEN_URL, refreshTokenDaysLeft } from "@/lib/spotify-auth";

const TOP_ARTISTS = "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=6";

type SpotifyImage = { url: string; width: number | null };

type RawArtist = {
  id: string;
  name: string;
  images?: SpotifyImage[];
  external_urls?: { spotify?: string };
};

/** True when the credentials exist at all — used to show a dev-only hint. */
export function isSpotifyConfigured(): boolean {
  return Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN,
  );
}

/** Spotify returns images largest-first; take the one nearest the render size. */
function pickImage(images: SpotifyImage[] = [], target = 320): string | null {
  const distance = (image: SpotifyImage) => Math.abs((image.width ?? target) - target);
  const best = images.reduce<SpotifyImage | null>(
    (a, b) => (a && distance(a) <= distance(b) ? a : b),
    null,
  );
  return best?.url ?? null;
}

async function getAccessToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refreshToken) return null;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
    // Not `no-store`: that would opt the Interests page out of static rendering.
    // The access token lives an hour, so caching the mint keeps both fresh.
    next: { revalidate: 3000 },
  });

  if (!response.ok) {
    console.warn(`[spotify] token refresh failed: ${response.status} ${response.statusText}`);
    return null;
  }

  const json = (await response.json()) as { access_token?: string };
  return json.access_token ?? null;
}

/**
 * The only expiry signal that reaches a production log. In development the
 * Interests page shows the same warning to the reader.
 */
function warnIfExpiring(): void {
  const daysLeft = refreshTokenDaysLeft();
  if (daysLeft === null || daysLeft > 30) return;

  console.warn(
    daysLeft > 0
      ? `[spotify] refresh token expires in ${daysLeft} day(s). Renew it at /api/spotify/login — it cannot renew itself.`
      : "[spotify] refresh token has expired. The Music section is now hidden. Renew it at /api/spotify/login.",
  );
}

export async function getTopArtists(): Promise<Cover[]> {
  try {
    warnIfExpiring();

    const token = await getAccessToken();
    if (!token) return [];

    const response = await fetch(TOP_ARTISTS, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.warn(`[spotify] top artists failed: ${response.status} ${response.statusText}`);
      return [];
    }

    const json = (await response.json()) as { items?: RawArtist[] };

    return (json.items ?? []).map((artist) => ({
      id: artist.id,
      title: artist.name,
      meta: null,
      image: pickImage(artist.images),
      url: artist.external_urls?.spotify ?? `https://open.spotify.com/artist/${artist.id}`,
    }));
  } catch (error) {
    console.warn("[spotify] unavailable:", error);
    return [];
  }
}

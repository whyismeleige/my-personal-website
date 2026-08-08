/**
 * Spotify OAuth, done in-app.
 *
 * `user-top-read` is user-scoped, so the only way to get a refresh token is to
 * walk the authorization-code flow once. These helpers back the two routes
 * under /api/spotify so that walk is a link click.
 *
 * No filesystem access here: this module is reachable from the statically
 * rendered Interests page, and `fs` there makes Next trace the whole project
 * into the build output. Writes live in ./spotify-env.ts.
 */

export const SPOTIFY_SCOPE = "user-top-read";
export const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
export const TOKEN_URL = "https://accounts.spotify.com/api/token";

/** Spotify's stated lifetime for refresh tokens issued to dashboard apps. */
export const REFRESH_TOKEN_LIFETIME_DAYS = 180;

/** Spotify rejects `localhost` as a redirect host; the loopback IP is required. */
export function callbackUrl(requestUrl: string): string {
  const explicit = process.env.SPOTIFY_REDIRECT_URI;
  if (explicit) return explicit;

  const origin = new URL(requestUrl);
  if (origin.hostname === "localhost") origin.hostname = "127.0.0.1";
  return `${origin.origin}/api/spotify/callback`;
}

export function hasClientCredentials(): boolean {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

export type TokenResponse = { access_token: string; refresh_token?: string };

export async function exchangeCode(
  code: string,
  redirectUri: string,
): Promise<TokenResponse | { error: string }> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return { error: "SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET are not set." };

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const json = await response.json();
  if (!response.ok) {
    return {
      error: `${json.error ?? response.status}: ${json.error_description ?? "token exchange failed"}`,
    };
  }
  return json as TokenResponse;
}

/**
 * Days left before the stored refresh token expires, or null when the issue
 * date is unknown. Spotify does not rotate the token on refresh, so renewal
 * means walking the consent screen again — hence the warnings.
 */
export function refreshTokenDaysLeft(): number | null {
  const issued = process.env.SPOTIFY_REFRESH_TOKEN_ISSUED;
  if (!issued) return null;
  const then = new Date(`${issued}T00:00:00Z`).getTime();
  if (Number.isNaN(then)) return null;
  const age = Math.floor((Date.now() - then) / 86_400_000);
  return REFRESH_TOKEN_LIFETIME_DAYS - age;
}

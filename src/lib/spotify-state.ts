/**
 * Access control for the two /api/spotify setup routes.
 *
 * Kept out of spotify-auth.ts on purpose: that module is reachable from the
 * statically rendered Interests page, and nothing the page renders should drag
 * crypto or route-only logic into its import graph.
 *
 * The problem this solves: the login route can be gated behind a shared secret
 * passed as `?key=`, but the callback cannot. Spotify redirects the browser to
 * the exact `redirect_uri` that was registered in the dashboard, and that URI
 * carries no `key` — so gating the callback the same way makes it permanently
 * unreachable in production, which is exactly what it did.
 *
 * Instead the callback trusts the `state` value, which is signed here. Only
 * something holding the secret can mint a state that verifies, so the callback
 * needs no secret in its URL — and the secret never lands in Spotify's
 * dashboard, a Referer header, or a proxy access log.
 */

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Compares without leaking length or position through timing. */
function safeEqual(a: string, b: string): boolean {
  // Hashing first lets timingSafeEqual take two equal-length buffers; it throws
  // otherwise, and the throw itself would be an oracle for length.
  return timingSafeEqual(
    createHash("sha256").update(a).digest(),
    createHash("sha256").update(b).digest(),
  );
}

/**
 * The key the state is signed with. `SPOTIFY_SETUP_SECRET` is the intended one;
 * in development it is usually unset, so the client secret stands in. Either
 * way an attacker who has neither cannot forge a state.
 */
function signingKey(): string | null {
  return process.env.SPOTIFY_SETUP_SECRET || process.env.SPOTIFY_CLIENT_SECRET || null;
}

/**
 * These routes mint credentials, so they must not sit open on a public site.
 * Development is unrestricted; anywhere else needs SPOTIFY_SETUP_SECRET as `?key=`.
 * Applies to the login route only — see the module comment.
 */
export function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const secret = process.env.SPOTIFY_SETUP_SECRET;
  if (!secret) return false;

  const key = new URL(request.url).searchParams.get("key");
  return key !== null && safeEqual(key, secret);
}

/** `<nonce>.<hmac>` — the nonce is the CSRF token, the hmac proves authorisation. */
export function createState(): string {
  const nonce = randomBytes(16).toString("hex");
  const key = signingKey();
  if (!key) return nonce;

  const signature = createHmac("sha256", key).update(nonce).digest("hex").slice(0, 32);
  return `${nonce}.${signature}`;
}

/** True when `state` was minted by createState() under the current secret. */
export function verifyState(state: string): boolean {
  const [nonce, signature] = state.split(".");
  if (!nonce || !signature) return false;

  const key = signingKey();
  if (!key) return false;

  const expected = createHmac("sha256", key).update(nonce).digest("hex").slice(0, 32);
  return safeEqual(signature, expected);
}

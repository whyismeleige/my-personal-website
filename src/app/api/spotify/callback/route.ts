import type { NextRequest } from "next/server";
import { REFRESH_TOKEN_LIFETIME_DAYS, callbackUrl, exchangeCode } from "@/lib/spotify-auth";
import { verifyState } from "@/lib/spotify-state";
import { saveRefreshToken } from "@/lib/spotify-env";
import { page } from "@/lib/setup-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Where Spotify sends you back after consent. Exchanges the code for tokens. */
export async function GET(request: NextRequest) {
  // Deliberately not gated on `?key=`. Spotify calls this URL itself, using the
  // redirect URI registered in the dashboard, which carries no query of ours —
  // so a key check here can never pass in production. Authorisation is proved
  // by the signed `state` below instead.
  const params = new URL(request.url).searchParams;
  const error = params.get("error");
  if (error) {
    return page({
      title: "Authorization declined",
      status: 400,
      body: `<p>Spotify returned <code>${escapeHtml(error)}</code>.</p>
             <p><a href="/api/spotify/login">Try again</a></p>`,
    });
  }

  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.cookies.get("spotify_oauth_state")?.value;

  if (!code) {
    return page({
      title: "Missing code",
      status: 400,
      body: "<p>Spotify did not return an authorization code.</p>",
    });
  }

  // Two separate checks. Matching the cookie stops CSRF; verifying the
  // signature stops anyone who never passed the login route's secret from
  // driving this endpoint with a state they made up.
  if (!state || !expectedState || state !== expectedState || !verifyState(state)) {
    return page({
      title: "State mismatch",
      status: 400,
      body: `<p>The <code>state</code> value did not match. Start again from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
    });
  }

  const result = await exchangeCode(code, callbackUrl(request.url));
  if ("error" in result) {
    return page({
      title: "Token exchange failed",
      status: 400,
      body: `<p><code>${escapeHtml(result.error)}</code></p>
             <p>The usual cause is a redirect URI that is not registered on your Spotify app. Register exactly:</p>
             <pre>${escapeHtml(callbackUrl(request.url))}</pre>`,
    });
  }

  const refreshToken = result.refresh_token;
  if (!refreshToken) {
    return page({
      title: "No refresh token returned",
      status: 500,
      body: `<p>Spotify did not include a refresh token. Re-run the flow from <a href="/api/spotify/login">/api/spotify/login</a>.</p>`,
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const expires = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10);
  const saved = saveRefreshToken(refreshToken);

  const response = page({
    title: "Spotify connected",
    body: saved
      ? `<p class="ok">Refresh token saved to your env file. Restart the dev server and <a href="/interests">/interests</a> will show your top artists.</p>
         <p class="muted">Expires ${expires}. Come back here to renew — the site warns you in development when it is close.</p>`
      : `<p>Copy this into your host's environment as <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
         <pre>${escapeHtml(refreshToken)}</pre>
         <p class="muted">Also set <code>SPOTIFY_REFRESH_TOKEN_ISSUED=${today}</code> so expiry warnings work. Expires ${expires}.</p>`,
  });
  response.cookies.delete("spotify_oauth_state");
  return response;
}

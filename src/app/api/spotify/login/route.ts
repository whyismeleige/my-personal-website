import { NextResponse, type NextRequest } from "next/server";
import {
  AUTHORIZE_URL,
  SPOTIFY_SCOPE,
  callbackUrl,
  hasClientCredentials,
} from "@/lib/spotify-auth";
import { createState, isAuthorized } from "@/lib/spotify-state";
import { page } from "@/lib/setup-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Starts the authorization-code flow: consent screen, then /api/spotify/callback. */
export function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (!hasClientCredentials()) {
    return page({
      title: "Spotify is not configured",
      status: 500,
      body: `<p>Set <code>SPOTIFY_CLIENT_ID</code> and <code>SPOTIFY_CLIENT_SECRET</code> in your env file, then reload.</p>
             <p>Both are at <a href="https://developer.spotify.com/dashboard">developer.spotify.com/dashboard</a>.</p>`,
    });
  }

  // Signed, so the callback can verify authorisation without a `key` in its URL.
  const state = createState();
  const authorize = new URL(AUTHORIZE_URL);
  authorize.searchParams.set("client_id", process.env.SPOTIFY_CLIENT_ID!);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", callbackUrl(request.url));
  authorize.searchParams.set("scope", SPOTIFY_SCOPE);
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("show_dialog", "true");

  const response = NextResponse.redirect(authorize.toString());
  response.cookies.set("spotify_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
    secure: process.env.NODE_ENV !== "development",
  });
  return response;
}

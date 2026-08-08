import type { Metadata } from "next"; import { CoverGrid } from "@/components/cover-grid";
import { books, interests, manga, movies, type Section } from "@/content/interests";
import { getBooks } from "@/lib/openlibrary";
import { getManga } from "@/lib/mangadex";
import { getMovies, isOmdbConfigured } from "@/lib/omdb";
import { getTopArtists, isSpotifyConfigured } from "@/lib/spotify";
import { refreshTokenDaysLeft } from "@/lib/spotify-auth";

/**
 * Fetched at build time and revalidated hourly. The page stays static: no
 * client-side fetching, no access token in the browser, no loading state.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Interests",
  description: "Books, music, movies, anime and manga — the things I pay attention to.",
};

const isDev = process.env.NODE_ENV === "development";

/** Setup notes are for whoever runs the site. A visitor sees the artwork or nothing. */
function SetupNote({ children }: { children: React.ReactNode }) {
  if (!isDev) return null;
  return <p className="mt-4 border-l border-rule pl-4 text-sm text-muted">{children}</p>;
}

function SpotifySetupNote() {
  return (
    <SetupNote>
      {isSpotifyConfigured()
        ? "The stored Spotify refresh token was rejected or has expired."
        : "Spotify is not connected yet."}{" "}
      Visit <a href="/api/spotify/login">/api/spotify/login</a> — it writes the token to your env
      file — then restart the dev server. Register{" "}
      <code>http://127.0.0.1:3000/api/spotify/callback</code> as a Redirect URI first.
    </SetupNote>
  );
}

/** Warns before the 6-month refresh token runs out, while there is time to act. */
function SpotifyRenewalNote() {
  const daysLeft = refreshTokenDaysLeft();
  if (daysLeft === null || daysLeft > 30) return null;

  return (
    <SetupNote>
      {daysLeft > 0
        ? `This Spotify refresh token expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
        : "This Spotify refresh token has expired."}{" "}
      Renew it at <a href="/api/spotify/login">/api/spotify/login</a>.
    </SetupNote>
  );
}

function OmdbSetupNote() {
  if (isOmdbConfigured()) return null;
  return (
    <SetupNote>
      Posters need a free OMDb key from{" "}
      <a href="https://www.omdbapi.com/apikey.aspx" target="_blank" rel="noreferrer noopener">
        omdbapi.com
      </a>{" "}
      in <code>OMDB_API_KEY</code>.
    </SetupNote>
  );
}

export default async function InterestsPage() {
  const [artists, bookCovers, movieCovers, mangaCovers] = await Promise.all([
    getTopArtists(),
    getBooks(books),
    getMovies(movies),
    getManga(manga),
  ]);

  const grids: Record<Section["slug"], React.ReactNode> = {
    books: <CoverGrid items={bookCovers} />,
    music:
      artists.length > 0 ? (
        <>
          <CoverGrid items={artists} shape="square" />
          <SpotifyRenewalNote />
        </>
      ) : (
        <SpotifySetupNote />
      ),
    movies: (
      <>
        <OmdbSetupNote />
        <CoverGrid items={movieCovers} />
      </>
    ),
    "anime-manga": <CoverGrid items={mangaCovers} />,
  };

  // Music is the one section with nothing local to fall back on: the other
  // three keep your titles whether or not a cover resolves, but an unreachable
  // Spotify leaves a heading with nothing under it. Drop it outside development.
  const sections = interests.filter(
    (section) => section.slug !== "music" || artists.length > 0 || isDev,
  );

  return (
    <div className="wrap">
      <h1>Interests</h1>

      {sections.map((section) => (
        <section key={section.slug} id={section.slug} className="mt-10 scroll-mt-6">
          <h2>{section.title}</h2>
          {grids[section.slug]}
        </section>
      ))}
    </div>
  );
}

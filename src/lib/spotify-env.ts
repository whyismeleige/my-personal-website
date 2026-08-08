/**
 * Writes the Spotify refresh token back into the local env file.
 *
 * Filesystem access only — kept out of the Interests page's import graph so the
 * page stays statically rendered. Import this from route handlers only.
 */

import fs from "node:fs";

/** Literal paths so Next can analyse them statically. */
function envFilePath(): string {
  if (fs.existsSync(".env.local")) return ".env.local";
  if (fs.existsSync(".env")) return ".env";
  return ".env.local";
}

/**
 * Upserts the token and its issue date, preserving every other line.
 * Returns false when the filesystem is not writable (i.e. serverless).
 */
export function saveRefreshToken(token: string): boolean {
  if (process.env.NODE_ENV !== "development") return false;

  const pending: Record<string, string> = {
    SPOTIFY_REFRESH_TOKEN: token,
    SPOTIFY_REFRESH_TOKEN_ISSUED: new Date().toISOString().slice(0, 10),
  };

  try {
    const file = envFilePath();
    const existing = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
    const lines = existing.length > 0 ? existing.split("\n") : [];

    const next = lines.map((line) => {
      const key = line.match(/^\s*([A-Z0-9_]+)\s*=/)?.[1];
      if (!key || !(key in pending)) return line;
      const value = pending[key];
      delete pending[key];
      return `${key}=${value}`;
    });

    for (const [key, value] of Object.entries(pending)) next.push(`${key}=${value}`);

    fs.writeFileSync(file, `${next.join("\n").trimEnd()}\n`, "utf8");
    return true;
  } catch (error) {
    console.warn("[spotify] could not write env file:", error);
    return false;
  }
}

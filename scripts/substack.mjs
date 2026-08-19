#!/usr/bin/env node
// Turns an essay in src/content/essays into Substack-ready rich HTML on the
// clipboard, so the repo stays the one place anything is written.
//
//   npm run substack -- the-arch-experience
//   npm run substack -- the-arch-experience --stdout
//   npm run substack -- the-arch-experience --origin http://localhost:3000
//
// Then: Substack → New post → Ctrl+V. Substack's editor takes pasted HTML and
// re-hosts every image it can fetch, which is why the image URLs have to be
// absolute and the essay has to be deployed before this is worth running.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import matter from "gray-matter";
import { renderEssay } from "../src/lib/markdown.mjs";

const ESSAYS_DIR = path.join(process.cwd(), "src/content/essays");

// Mirrors `site.url` in src/content/site.ts, which is the source of truth but
// is TypeScript and so not importable here. Drift shows up immediately as a
// wall of failed image checks.
const DEFAULT_ORIGIN = "https://piyushbuilds.me";

/** Flags that take no value; everything else consumes the next argument. */
const BOOLEANS = new Set(["stdout", "force", "no-canonical"]);

function parseArgs(argv) {
  const flags = {};
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=");
      if (BOOLEANS.has(key)) {
        flags[key] = inline === undefined ? true : inline !== "false";
      } else {
        flags[key] = inline ?? argv[++i];
      }
    } else {
      positional.push(arg);
    }
  }

  return { flags, positional };
}

function usage(message) {
  if (message) console.error(`${message}\n`);
  console.error(`Usage: npm run substack -- <slug> [options]

Options:
  --stdout            Print the HTML instead of copying it
  --out <file>        Write the HTML to a file instead of copying it
  --no-canonical      Omit the "Originally published at" line
  --origin <url>      Site origin for image URLs (default: $SITE_URL or ${DEFAULT_ORIGIN})
  --force             Copy even when some images are unreachable`);
  process.exit(1);
}

/** Repo-relative when it is in the repo, absolute when it is not. */
function display(file) {
  const relative = path.relative(process.cwd(), file);
  return relative.startsWith("..") ? file : relative;
}

/** Every absolute image src in the rendered HTML, deduplicated, in order. */
function imageUrls(html) {
  const urls = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/g)]
    .map((m) => m[1].replaceAll("&amp;", "&"))
    .filter((url) => /^https?:\/\//i.test(url));

  return [...new Set(urls)];
}

async function check(url) {
  try {
    let res = await fetch(url, { method: "HEAD", redirect: "follow" });
    // Some hosts refuse HEAD outright; a ranged GET settles it without
    // pulling the whole file down.
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: "GET", headers: { Range: "bytes=0-0" } });
    }
    return { url, ok: res.ok, status: String(res.status) };
  } catch (error) {
    return { url, ok: false, status: error.cause?.code ?? "unreachable" };
  }
}

/** Hands `html` to the clipboard as rich text, not as a page of source code. */
function copy(html) {
  const clipboards = [
    ["wl-copy", ["--type", "text/html"]],
    ["xclip", ["-selection", "clipboard", "-t", "text/html"]],
  ];

  for (const [command, args] of clipboards) {
    // stdout and stderr are ignored rather than piped on purpose: both of these
    // fork a background process to keep serving the selection after the one we
    // launched exits, and that child inherits any pipes and holds them open.
    // spawnSync waits for EOF on them, so piping here hangs the script forever.
    const result = spawnSync(command, args, { input: html, stdio: ["pipe", "ignore", "ignore"] });
    if (result.error) continue; // not installed — try the next one
    if (result.status === 0) return command;
  }

  return null;
}

const { flags, positional } = parseArgs(process.argv.slice(2));
const slug = (flags.slug ?? positional.join(" ")).trim().replace(/\.md$/, "");

if (!slug) usage();

const source = path.join(ESSAYS_DIR, `${slug}.md`);
if (!fs.existsSync(source)) {
  const available = fs
    .readdirSync(ESSAYS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => `  ${f.replace(/\.md$/, "")}`)
    .join("\n");
  usage(`No essay called ${JSON.stringify(slug)}. Essays available:\n\n${available}`);
}

const origin = (flags.origin ?? process.env.SITE_URL ?? DEFAULT_ORIGIN).replace(/\/$/, "");
const { data, content } = matter(fs.readFileSync(source, "utf8"));
const url = `${origin}/essays/${slug}`;

let html = await renderEssay(content, { slug, origin });

if (!flags["no-canonical"]) {
  const shown = url.replace(/^https?:\/\//, "");
  html += `<p><em>Originally published at <a href="${url}">${shown}</a>.</em></p>\n`;
}

// Nothing is copied until every image is known to load. Substack fetches them
// from this origin at paste time, so an image that 404s here is an image that
// silently goes missing in the post.
const images = imageUrls(html);
const results = await Promise.all(images.map(check));
const broken = results.filter((r) => !r.ok);

if (images.length > 0) {
  console.log(`\nImages (${origin}):`);
  for (const { url: image, ok, status } of results) {
    console.log(`  ${ok ? "✓" : "✗"} ${status.padEnd(11)} ${path.basename(image)}`);
  }
}

if (broken.length > 0 && !flags.force) {
  console.error(`\n${broken.length} of ${images.length} images are not reachable. Usually one of:`);
  if (data.draft === true) {
    console.error(`  • this essay is still \`draft: true\`, so it is not deployed`);
  }
  console.error(`  • public/essays/${slug}/ is not committed and pushed yet`);
  console.error(`  • the deploy has not finished`);
  console.error(`\nFix and re-run, or pass --force to copy anyway.`);
  process.exit(1);
}

if (flags.stdout) {
  process.stdout.write(html);
  process.exit(0);
}

if (flags.out) {
  fs.writeFileSync(flags.out, html, "utf8");
  console.log(`\nWrote ${display(flags.out)}`);
} else {
  const via = copy(html);
  if (!via) {
    const fallback = path.join(process.cwd(), `${slug}.substack.html`);
    fs.writeFileSync(fallback, html, "utf8");
    console.error(`\nNo wl-copy or xclip found — wrote ${path.basename(fallback)} instead.`);
    process.exit(1);
  }
  console.log(`\nCopied to the clipboard as rich text (${via}).`);
}

// Substack keeps these in their own fields, so they are deliberately not in
// the body HTML — they have to be typed in up top.
console.log(`\n  Title:     ${data.title ?? slug}`);
if (data.subtitle) console.log(`  Subtitle:  ${data.subtitle}`);
console.log(`
Next:
  1. Substack → New post
  2. Ctrl+V into the body — images re-host themselves, give them a moment
  3. Paste the title and subtitle above
  4. Settings → canonical URL → ${url}
`);

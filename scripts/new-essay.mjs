#!/usr/bin/env node
// Creates a new essay in src/content/essays from the frontmatter that
// src/lib/essays.ts expects.
//
//   npm run new:essay -- "The Beginning of Something"
//   npm run new:essay -- "Title" --slug custom-slug --tags writing,tools --date 2026-01-31
//   npm run new:essay -- "Title" --subtitle "A short line under the title"

import fs from "node:fs";
import path from "node:path";

const ESSAYS_DIR = path.join(process.cwd(), "src/content/essays");
const IMAGES_DIR = path.join(process.cwd(), "public/essays");

function parseArgs(argv) {
  const flags = {};
  const positional = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const [key, inline] = arg.slice(2).split("=");
      // `--draft` is a boolean; everything else takes the next argument.
      if (key === "draft" || key === "published") {
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

function slugify(title) {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function today() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  // Local date, not UTC — an evening post should not be dated tomorrow.
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Quote anything that YAML would otherwise misread (colons, leading #, ...). */
function yamlString(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

const { flags, positional } = parseArgs(process.argv.slice(2));
const title = flags.title ?? positional.join(" ").trim();

if (!title) {
  console.error(`Usage: npm run new:essay -- "Essay title" [options]

Options:
  --slug <slug>          Filename slug (default: slugified title)
  --subtitle <text>      Subtitle shown under the title
  --date <YYYY-MM-DD>    Publish date (default: today)
  --tags <a,b,c>         Comma-separated tags
  --published            Create it published (default: draft: true)
  --force                Overwrite an existing file with the same slug`);
  process.exit(1);
}

const slug = slugify(flags.slug ?? title);
if (!slug) {
  console.error(`Could not build a slug from ${JSON.stringify(title)} — pass --slug explicitly.`);
  process.exit(1);
}

const date = flags.date ?? today();
if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error(`--date must be YYYY-MM-DD, got ${JSON.stringify(date)}.`);
  process.exit(1);
}

const tags = String(flags.tags ?? "")
  .split(",")
  .map((t) => t.trim())
  .filter(Boolean);

const draft = flags.published ? false : flags.draft !== false;

const target = path.join(ESSAYS_DIR, `${slug}.md`);
if (fs.existsSync(target) && !flags.force) {
  console.error(`${path.relative(process.cwd(), target)} already exists. Use --force to overwrite.`);
  process.exit(1);
}

const frontmatter = [
  "---",
  `title: ${yamlString(title)}`,
  ...(flags.subtitle ? [`subtitle: ${yamlString(flags.subtitle)}`] : []),
  `date: ${date}`,
  `tags: [${tags.map(yamlString).join(", ")}]`,
  `draft: ${draft}`,
  "---",
];

// The first paragraph becomes the excerpt on /essays unless you add an
// `excerpt:` field above, so lead with a sentence worth showing.
const template = `${frontmatter.join("\n")}

Opening paragraph.

## First section

Body.
`;

const images = path.join(IMAGES_DIR, slug);

fs.mkdirSync(ESSAYS_DIR, { recursive: true });
fs.writeFileSync(target, template, "utf8");
// Empty, so git ignores it until it holds something — the point is that the
// folder is already there when you go looking for somewhere to put an image.
fs.mkdirSync(images, { recursive: true });

console.log(`Created ${path.relative(process.cwd(), target)}`);
console.log(`        ${path.relative(process.cwd(), images)}/  — drop images here, refer to them by filename`);
console.log(`         /essays/${slug}${draft ? "  (draft — dev only)" : ""}`);

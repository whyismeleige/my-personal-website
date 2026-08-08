import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const ESSAYS_DIR = path.join(process.cwd(), "src/content/essays");
const WORDS_PER_MINUTE = 220;

export type EssayMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
  draft: boolean;
};

export type Essay = EssayMeta & { html: string };

function readFilenames(): string[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];
  return fs.readdirSync(ESSAYS_DIR).filter((f) => f.endsWith(".md"));
}

function toExcerpt(body: string, fallback?: string): string {
  if (fallback) return fallback;

  const firstParagraph =
    body
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find((block) => block && !block.startsWith("#") && !block.startsWith(">")) ?? "";

  const plain = firstParagraph
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > 220 ? `${plain.slice(0, 217).trimEnd()}…` : plain;
}

function parse(filename: string): { meta: EssayMeta; body: string } {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(ESSAYS_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    body: content,
    meta: {
      slug,
      title: typeof data.title === "string" ? data.title : slug,
      subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
      date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? "1970-01-01").slice(0, 10),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      excerpt: toExcerpt(content, typeof data.excerpt === "string" ? data.excerpt : undefined),
      readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
      draft: data.draft === true,
    },
  };
}

/** Drafts are visible while developing, hidden in a production build. */
function isVisible(meta: EssayMeta): boolean {
  return !meta.draft || process.env.NODE_ENV === "development";
}

/** All published essays, newest first. */
export const getEssays = cache((): EssayMeta[] =>
  readFilenames()
    .map((f) => parse(f).meta)
    .filter(isVisible)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title))),
);

export const getEssay = cache(async (slug: string): Promise<Essay | null> => {
  const filename = `${slug}.md`;
  if (!readFilenames().includes(filename)) return null;

  const { meta, body } = parse(filename);
  if (!isVisible(meta)) return null;

  // `sanitize: false` lets raw HTML through from the Markdown. That is safe
  // here for one reason only: essays are .md files committed to this repo, so
  // authoring them already requires write access to the source. If essays ever
  // arrive from anywhere else — an upload, a CMS, a pull request from someone
  // you do not trust — this becomes stored XSS and must be sanitised.
  const file = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(body);

  return { ...meta, html: String(file) };
});

/** Neighbours in reading order, for the footer of an essay. */
export function getNeighbours(slug: string): {
  previous: EssayMeta | null;
  next: EssayMeta | null;
} {
  const all = getEssays();
  const i = all.findIndex((e) => e.slug === slug);
  if (i === -1) return { previous: null, next: null };
  return { previous: all[i + 1] ?? null, next: all[i - 1] ?? null };
}

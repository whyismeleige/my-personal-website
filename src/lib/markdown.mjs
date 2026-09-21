import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";

/**
 * The one place Markdown becomes HTML for essays on this site.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** A URL that already says where it points: a scheme, `//host`, or `/from-root`. */
const RESOLVED = /^([a-z][a-z0-9+.-]*:|\/\/|\/)/i;

/**
 * Essays refer to their images by bare filename — `![Arch](arch.jpg)` — and
 * this resolves that against the essay's own folder in public/. Writing the
 * path out every time is the thing this exists to avoid.
 *
 * @param {{ base: string, dir: string | null }} options
 *   `base` is prefixed to every bare filename. `dir` is the folder on disk to
 *   check them against, or null when the images are being pointed at a
 *   deployed origin that only the network can confirm.
 */
function remarkEssayImages({ base, dir }) {
  return (tree) => {
    let seen = 0;

    visit(tree, "image", (node) => {
      if (!RESOLVED.test(node.url)) {
        if (dir) {
          const file = path.join(dir, decodeURIComponent(node.url));
          if (!fs.existsSync(file)) {
            const message =
              `Essay image not found: ${node.url}\n` +
              `  looked in ${path.relative(process.cwd(), dir)}/`;
            // While writing, say so and carry on — a typo should not blank the
            // page you are proofreading. In a build it is fatal, so a missing
            // image can never reach the site.
            if (process.env.NODE_ENV === "development") console.warn(`\n${message}\n`);
            else throw new Error(message);
          }
        }

        node.url = base + node.url;
      }

      // The first image is likely the largest contentful paint; every one
      // after it is below the fold and can wait.
      if (seen++ > 0) {
        node.data ??= {};
        node.data.hProperties = { ...node.data.hProperties, loading: "lazy", decoding: "async" };
      }
    });
  };
}

/**
 * @param {string} body Markdown, frontmatter already stripped.
 * @param {{ slug: string, origin?: string }} options
 *   `origin` makes every image URL absolute — needed when the HTML is leaving
 *   this site, since nothing out there can resolve `/essays/…`. Empty for the
 *   site itself.
 * @returns {Promise<string>} HTML
 */
export async function renderEssay(body, { slug, origin = "" }) {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkEssayImages, {
      base: `${origin}/essays/${slug}/`,
      dir: origin ? null : path.join(PUBLIC_DIR, "essays", slug),
    })
    // `sanitize: false` lets raw HTML through from the Markdown. That is safe
    // here for one reason only: essays are .md files committed to this repo, so
    // authoring them already requires write access to the source. If essays ever
    // arrive from anywhere else — an upload, a CMS, a pull request from someone
    // you do not trust — this becomes stored XSS and must be sanitised.
    .use(remarkHtml, { sanitize: false })
    .process(body);

  return String(file);
}

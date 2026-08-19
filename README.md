# piyushbuilds.me

Essays and work. Next.js, Markdown, no CMS.

## Writing an essay

```sh
npm run new:essay -- "I use Arch btw"
```

That creates two things: `src/content/essays/i-use-arch-btw.md` and
`public/essays/i-use-arch-btw/`. Write in the first, put images in the second.

**Images are referenced by filename alone** — the folder is implied by the essay:

```md
![A Windows blue screen of death](windows.jpeg)
```

A path starting with `/` or `https://` is left alone, if you ever need to point somewhere else.
Alt text is worth writing; it is what a screen reader reads and what shows when an image fails.

A missing image warns in `npm run dev` and fails `npm run build`, so a broken one cannot reach the site.

```sh
npm run dev     # drafts are visible here and nowhere else
```

Essays are `draft: true` until you say otherwise. Flip it to `false`, commit, push.
**Commit `public/essays/<slug>/` too** — see below for why it matters.

## Cross-posting to Substack

Once the essay is live:

```sh
npm run substack -- i-use-arch-btw
```

It checks every image is actually reachable, then puts the essay on your clipboard as rich text.
Open a new Substack post, paste into the body, copy the title and subtitle it prints, publish.
Substack fetches each image from this site and re-hosts it — which is why the essay has to be
deployed first, and why the script refuses to copy anything while an image still 404s.

```
--stdout          print the HTML instead of copying it
--out <file>      write it to a file
--origin <url>    point at somewhere else, e.g. http://localhost:3000
--no-canonical    drop the "Originally published at" footer
--force           copy even with broken images
```

The essay in this repo stays the original. Set the canonical URL in Substack's post settings
(the script reminds you) so search engines know it.

## Layout

| Path | |
|---|---|
| `src/content/essays/*.md` | the essays |
| `public/essays/<slug>/` | that essay's images |
| `src/lib/markdown.mjs` | Markdown → HTML, shared by the site and the Substack script |
| `src/lib/essays.ts` | reading, frontmatter, excerpts, ordering |
| `src/content/site.ts` | name, URL, nav, socials |
| `src/content/projects.ts` | `/work` |

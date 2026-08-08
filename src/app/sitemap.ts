import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";
import { getEssays } from "@/lib/essays";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getEssays();

  const pages: MetadataRoute.Sitemap = nav.map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    // /essays is the landing page now, so it carries the top priority.
    priority: item.href === "/essays" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: new URL(`/essays/${essay.slug}`, site.url).toString(),
    lastModified: new Date(`${essay.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}

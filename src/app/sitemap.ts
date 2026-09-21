import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";
import { getEssays } from "@/lib/essays";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const essays = getEssays();

  const pages: MetadataRoute.Sitemap = [{ href: "/" }, ...nav].map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  const posts: MetadataRoute.Sitemap = essays.map((essay) => ({
    url: new URL(`/essays/${essay.slug}`, site.url).toString(),
    lastModified: new Date(`${essay.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const work: MetadataRoute.Sitemap = projects.map((project) => ({
    url: new URL(`/work/${project.slug}`, site.url).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...work, ...posts];
}

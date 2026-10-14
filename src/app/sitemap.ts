import type { MetadataRoute } from "next";
import { nav, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {

  const pages: MetadataRoute.Sitemap = [{ href: "/" }, ...nav]
    .filter((item) => item.href.startsWith("/"))
    .map((item) => ({
    url: new URL(item.href, site.url).toString(),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.8,
  }));

  return [...pages];
}

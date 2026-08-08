import type { MetadataRoute } from "next";
import { getAllSitemapEntries } from "@/lib/routes";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return getAllSitemapEntries().map((entry) => ({
    url: `${siteUrl}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.path.includes("/") && entry.path.split("/").length > 2 ? "monthly" : "weekly",
    priority: entry.path === "/" ? 1 : entry.path.split("/").length === 2 ? 0.9 : 0.8,
  }));
}

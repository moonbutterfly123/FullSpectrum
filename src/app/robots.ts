import type { MetadataRoute } from "next";
import { getSitemapUrl } from "@/lib/routes";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: getSitemapUrl(),
    host: siteUrl,
  };
}

import { getAllBirds } from "./birds";
import { getAllFish } from "./fish";
import { getAllGenres } from "./genres";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "./site";

export interface SitemapEntry {
  path: string;
  lastModified: string;
}

export interface FeedEntry {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
}

export async function getAllArticleRoutes(): Promise<SitemapEntry[]> {
  const [birds, fish, genres] = await Promise.all([
    getAllBirds(),
    getAllFish(),
    getAllGenres(),
  ]);

  return [
    ...birds.map((bird) => ({
      path: `/birds/${bird.slug}`,
      lastModified: bird.publishedAt,
    })),
    ...fish.map((entry) => ({
      path: `/fish/${entry.slug}`,
      lastModified: entry.publishedAt,
    })),
    ...genres.map((genre) => ({
      path: `/music/${genre.slug}`,
      lastModified: genre.publishedAt,
    })),
  ];
}

export async function getAllFeedEntries(): Promise<FeedEntry[]> {
  const [birds, fish, genres] = await Promise.all([
    getAllBirds(),
    getAllFish(),
    getAllGenres(),
  ]);

  return [
    ...birds.map((bird) => ({
      title: bird.title,
      description: bird.seoDescription?.trim() || bird.subtitle,
      path: `/birds/${bird.slug}`,
      publishedAt: bird.publishedAt,
    })),
    ...fish.map((entry) => ({
      title: entry.title,
      description: entry.seoDescription?.trim() || entry.subtitle,
      path: `/fish/${entry.slug}`,
      publishedAt: entry.publishedAt,
    })),
    ...genres.map((genre) => ({
      title: genre.title,
      description: genre.seoDescription?.trim() || genre.subtitle,
      path: `/music/${genre.slug}`,
      publishedAt: genre.publishedAt,
    })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getStaticPageRoutes(): SitemapEntry[] {
  const today = new Date().toISOString().split("T")[0];

  return [
    { path: "/", lastModified: today },
    { path: "/birds", lastModified: today },
    { path: "/fish", lastModified: today },
    { path: "/music", lastModified: today },
  ];
}

export async function getAllSitemapEntries(): Promise<SitemapEntry[]> {
  return [...getStaticPageRoutes(), ...(await getAllArticleRoutes())];
}

export function getSitemapUrl(): string {
  return absoluteUrl("/sitemap.xml");
}

export function getFeedUrl(): string {
  return absoluteUrl("/feed.xml");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function buildRssFeed(): Promise<string> {
  const siteUrl = absoluteUrl("/");
  const items = (await getAllFeedEntries())
    .slice(0, 100)
    .map(
      (entry) => `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${absoluteUrl(entry.path)}</link>
      <guid isPermaLink="true">${absoluteUrl(entry.path)}</guid>
      <pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(entry.description.slice(0, 300))}</description>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${getFeedUrl()}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}

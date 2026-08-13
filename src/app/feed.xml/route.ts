import { buildRssFeed } from "@/lib/routes";

export async function GET() {
  const feed = await buildRssFeed();

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

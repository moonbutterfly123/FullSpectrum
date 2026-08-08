import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiArticleView, wikiArticleMetadata } from "@/components/WikiArticleView";
import { getAllFish, getFish, getFishSlugs } from "@/lib/fish";
import { buildInternalLinkTargets } from "@/lib/internal-links";
import { getRelatedWikiEntries } from "@/lib/related";

interface FishPageProps {
  params: Promise<{ slug: string }>;
}

const STAT_KEYS = ["maxLength", "weight", "lifespan"];

export async function generateStaticParams() {
  return getFishSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: FishPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fish = getFish(slug);
  if (!fish) return { title: "Not Found" };
  return wikiArticleMetadata(fish, `/fish/${slug}`, "Fish");
}

export default async function FishPage({ params }: FishPageProps) {
  const { slug } = await params;
  const fish = getFish(slug);
  if (!fish) notFound();

  const allFish = getAllFish();
  const linkTargets = buildInternalLinkTargets(allFish, "/fish", slug);
  const relatedItems = getRelatedWikiEntries(fish, allFish, "/fish");

  return (
    <WikiArticleView
      entry={fish}
      statKeys={STAT_KEYS}
      backHref="/fish#collection"
      backLabel="← Back to The Collection"
      articlePath={`/fish/${slug}`}
      sectionLabel="Fish"
      collectionPath="/fish"
      linkTargets={linkTargets}
      relatedItems={relatedItems}
    />
  );
}

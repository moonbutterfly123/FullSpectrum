import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WikiArticleView, wikiArticleMetadata } from "@/components/WikiArticleView";
import { getAllBirds, getBird, getBirdSlugs } from "@/lib/birds";
import { buildInternalLinkTargets } from "@/lib/internal-links";
import { getRelatedWikiEntries } from "@/lib/related";

interface BirdPageProps {
  params: Promise<{ slug: string }>;
}

const STAT_KEYS = ["wingspan", "weight", "lifespan"];

export async function generateStaticParams() {
  return getBirdSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BirdPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bird = getBird(slug);
  if (!bird) return { title: "Not Found" };
  return wikiArticleMetadata(bird, `/birds/${slug}`, "Birds");
}

export default async function BirdPage({ params }: BirdPageProps) {
  const { slug } = await params;
  const bird = getBird(slug);
  if (!bird) notFound();

  const allBirds = getAllBirds();
  const linkTargets = buildInternalLinkTargets(allBirds, "/birds", slug);
  const relatedItems = getRelatedWikiEntries(bird, allBirds, "/birds");

  return (
    <WikiArticleView
      entry={bird}
      statKeys={STAT_KEYS}
      backHref="/birds#collection"
      backLabel="← Back to The Collection"
      articlePath={`/birds/${slug}`}
      sectionLabel="Birds"
      collectionPath="/birds"
      linkTargets={linkTargets}
      relatedItems={relatedItems}
    />
  );
}

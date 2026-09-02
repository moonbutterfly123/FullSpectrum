import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LinkedParagraph } from "@/components/LinkedParagraph";
import { RelatedArticles } from "@/components/RelatedArticles";
import { StatsBar } from "@/components/StatsBar";
import { WikiSidebar } from "@/components/WikiSidebar";
import type { InternalLinkTarget } from "@/lib/internal-links";
import type { RelatedEntry } from "@/lib/related";
import {
  buildArticleMetadata,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildSeoDescription,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { WikiEntry } from "@/lib/types";
import { conservationColors } from "@/lib/types";

interface WikiArticleViewProps {
  entry: WikiEntry;
  statKeys: string[];
  backHref: string;
  backLabel: string;
  articlePath: string;
  sectionLabel: string;
  collectionPath: string;
  linkTargets: InternalLinkTarget[];
  relatedItems: RelatedEntry[];
}

function wikiKeywords(entry: WikiEntry): string[] {
  return [
    entry.title,
    entry.scientificName,
    entry.family,
    entry.order,
    ...entry.regions,
    entry.habitat,
  ].filter(Boolean);
}

function wikiSeoDescription(entry: WikiEntry, sectionLabel: string): string {
  const primary = entry.seoDescription?.trim() || entry.subtitle;
  return buildSeoDescription(
    primary,
    `Learn about ${entry.title} on Full Spectrum — ${sectionLabel.toLowerCase()}, habitat, and conservation at readfullspectrum.com.`
  );
}

export function WikiArticleView({
  entry,
  statKeys,
  backHref,
  backLabel,
  articlePath,
  sectionLabel,
  collectionPath,
  linkTargets,
  relatedItems,
}: WikiArticleViewProps) {
  const statusColors = conservationColors[entry.conservationCode];
  const keywords = wikiKeywords(entry);
  const seoDescription = wikiSeoDescription(entry, sectionLabel);
  const breadcrumbs = [
    { name: SITE_NAME, path: "/" },
    { name: sectionLabel, path: collectionPath },
    { name: entry.title, path: articlePath },
  ];
  const jsonLd = buildBlogPostingJsonLd({
    headline: entry.title,
    description: seoDescription,
    path: articlePath,
    image: entry.image,
    datePublished: entry.publishedAt,
    dateModified: entry.publishedAt,
    authorName: SITE_NAME,
    articleSection: sectionLabel,
    keywords,
  });

  return (
    <article>
      <JsonLd data={jsonLd} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {entry.image && (
          <Image
            src={entry.image}
            alt={entry.imageAlt || `${entry.title} featured photograph`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-4xl mx-auto px-6 pb-16 w-full lg:pl-12">
          <p className="font-mono-tax text-sm text-wiki-secondary italic mb-2">
            {entry.scientificName}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-wiki-ink text-balance leading-[1.05]">
            {entry.title}
          </h1>
          {entry.subtitle && (
            <p className="mt-6 text-xl text-wiki-ink/80 max-w-2xl leading-relaxed">
              {entry.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors.bg} ${statusColors.text}`}
            >
              {entry.conservationLabel}
            </span>
            <span className="text-sm text-wiki-muted font-mono-tax">
              {entry.order} · {entry.family}
            </span>
          </div>
        </div>
      </section>

      <StatsBar
        stats={entry.stats}
        statLabels={entry.statLabels}
        statKeys={statKeys}
        order={entry.order}
        family={entry.family}
        conservationLabel={entry.conservationLabel}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          <WikiSidebar entry={entry} />

          <div className="prose-avian max-w-2xl text-[1.25rem] leading-[1.6]">
            {entry.sections.map((section, i) => (
              <section key={section.title} id={`section-${i}`}>
                <h2>{section.title}</h2>
                {section.content.split("\n\n").map((paragraph, j) => (
                  <LinkedParagraph
                    key={j}
                    text={paragraph}
                    linkTargets={linkTargets}
                  />
                ))}
              </section>
            ))}
          </div>
        </div>

        <RelatedArticles items={relatedItems} />

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-wiki-border">
          <Link href={backHref} className="text-sm text-wiki-accent hover:underline">
            {backLabel}
          </Link>
        </div>
      </section>
    </article>
  );
}

export function wikiArticleMetadata(
  entry: WikiEntry,
  articlePath: string,
  sectionLabel: string
): Metadata {
  const primary = entry.seoDescription?.trim() || entry.subtitle;
  return buildArticleMetadata({
    title: entry.title,
    description: primary,
    path: articlePath,
    siteName: SITE_NAME,
    image: entry.image,
    imageAlt: entry.imageAlt || `${entry.title} featured photograph`,
    publishedAt: entry.publishedAt,
    modifiedAt: entry.publishedAt,
    authorName: SITE_NAME,
    section: sectionLabel,
    keywords: wikiKeywords(entry),
    fallbackDescription: `Learn about ${entry.title} on Full Spectrum — ${sectionLabel.toLowerCase()}, habitat, and conservation at readfullspectrum.com.`,
  });
}

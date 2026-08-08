import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LinkedParagraph } from "@/components/LinkedParagraph";
import { RelatedArticles } from "@/components/RelatedArticles";
import { StatsBar } from "@/components/StatsBar";
import { GenreSidebar } from "@/components/GenreSidebar";
import type { InternalLinkTarget } from "@/lib/internal-links";
import type { RelatedEntry } from "@/lib/related";
import {
  buildArticleMetadata,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildSeoDescription,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { GenreArticle } from "@/lib/genres";
import { genreStatKeys } from "@/lib/genres";

const tierColors: Record<string, string> = {
  Iconic: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300",
  Major: "bg-violet-100 text-violet-700 border-violet-300",
  Established: "bg-sky-100 text-sky-700 border-sky-300",
  Niche: "bg-amber-100 text-amber-700 border-amber-300",
  Underground: "bg-slate-200 text-slate-700 border-slate-400",
};

interface GenreArticleViewProps {
  genre: GenreArticle;
  articlePath?: string;
  linkTargets: InternalLinkTarget[];
  relatedItems: RelatedEntry[];
}

function genreKeywords(genre: GenreArticle): string[] {
  return [
    genre.title,
    genre.popularityTier,
    genre.regionOrigin,
    genre.eraOrigin,
    ...genre.parentGenres,
    ...genre.keyInstruments,
    ...genre.regions,
  ].filter(Boolean);
}

function genreSeoDescription(genre: GenreArticle): string {
  const primary = genre.seoDescription?.trim() || genre.subtitle;
  return buildSeoDescription(
    primary,
    `Explore ${genre.title} on Full Spectrum — sound, origins, and culture at readfullspectrum.com.`
  );
}

export function GenreArticleView({
  genre,
  articlePath = `/music/${genre.slug}`,
  linkTargets,
  relatedItems,
}: GenreArticleViewProps) {
  const tierClass = tierColors[genre.popularityTier] ?? tierColors.Major;
  const accent = genre.accentColor || "#a855f7";
  const keywords = genreKeywords(genre);
  const seoDescription = genreSeoDescription(genre);
  const breadcrumbs = [
    { name: SITE_NAME, path: "/" },
    { name: "Music", path: "/music" },
    { name: genre.title, path: articlePath },
  ];
  const jsonLd = buildBlogPostingJsonLd({
    headline: genre.title,
    description: seoDescription,
    path: articlePath,
    image: genre.image,
    datePublished: genre.publishedAt,
    dateModified: genre.publishedAt,
    authorName: SITE_NAME,
    articleSection: "Music",
    keywords,
  });

  return (
    <article>
      <JsonLd data={jsonLd} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        {genre.image ? (
          <Image
            src={genre.image}
            alt={genre.imageAlt || `${genre.title} genre artwork`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(150deg, ${accent}, #140e26)` }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, hsl(var(--background)), ${accent}22 45%, transparent)`,
          }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-4xl mx-auto px-6 pb-16 w-full">
          {genre.eraOrigin && (
            <p
              className="font-mono-tax text-sm uppercase tracking-[0.3em] mb-3"
              style={{ color: accent }}
            >
              {genre.eraOrigin}
            </p>
          )}
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-wiki-ink text-balance leading-[1.05]">
            {genre.title}
          </h1>
          {genre.subtitle && (
            <p className="mt-6 text-xl text-wiki-ink/80 max-w-2xl leading-relaxed">
              {genre.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tierClass}`}
            >
              {genre.popularityTier}
            </span>
            {genre.regionOrigin && (
              <span className="text-sm text-wiki-muted font-mono-tax">
                {genre.regionOrigin}
              </span>
            )}
          </div>
        </div>
      </section>

      <StatsBar
        stats={genre.stats}
        statLabels={genre.statLabels}
        statKeys={genreStatKeys}
        order=""
        family=""
        conservationLabel=""
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          <GenreSidebar genre={genre} />

          <div className="prose-avian max-w-2xl text-[1.0625rem] leading-relaxed">
            {genre.sections.map((section, i) => (
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
          <Link href="/music#collection" className="text-sm text-wiki-accent hover:underline">
            ← Back to The Collection
          </Link>
        </div>
      </section>
    </article>
  );
}

export function genreArticleMetadata(
  genre: GenreArticle,
  articlePath = `/music/${genre.slug}`
): Metadata {
  const primary = genre.seoDescription?.trim() || genre.subtitle;
  return buildArticleMetadata({
    title: genre.title,
    description: primary,
    path: articlePath,
    siteName: SITE_NAME,
    image: genre.image,
    imageAlt: genre.imageAlt || `${genre.title} genre artwork`,
    publishedAt: genre.publishedAt,
    modifiedAt: genre.publishedAt,
    authorName: SITE_NAME,
    section: "Music",
    keywords: genreKeywords(genre),
    fallbackDescription: `Explore ${genre.title} on Full Spectrum — sound, origins, and culture at readfullspectrum.com.`,
  });
}

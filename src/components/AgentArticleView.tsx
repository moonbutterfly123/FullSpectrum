import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { LinkedParagraph } from "@/components/LinkedParagraph";
import { RelatedArticles } from "@/components/RelatedArticles";
import { StatsBar } from "@/components/StatsBar";
import { AgentSidebar } from "@/components/AgentSidebar";
import type { InternalLinkTarget } from "@/lib/internal-links";
import type { RelatedEntry } from "@/lib/related";
import {
  buildArticleMetadata,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildSeoDescription,
} from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import type { AgentArticle } from "@/lib/agents";
import { agentStatKeys } from "@/lib/agents";

const tierColors: Record<string, string> = {
  Foundational: "bg-emerald-100 text-emerald-700 border-emerald-300",
  Intermediate: "bg-sky-100 text-sky-700 border-sky-300",
  Advanced: "bg-violet-100 text-violet-700 border-violet-300",
};

interface AgentArticleViewProps {
  agent: AgentArticle;
  articlePath?: string;
  linkTargets: InternalLinkTarget[];
  relatedItems: RelatedEntry[];
}

function agentKeywords(agent: AgentArticle): string[] {
  return [
    agent.title,
    agent.popularityTier,
    agent.regionOrigin,
    agent.eraOrigin,
    ...agent.parentGenres,
    ...agent.keyInstruments,
    ...agent.regions,
  ].filter(Boolean);
}

function agentSeoDescription(agent: AgentArticle): string {
  const primary = agent.seoDescription?.trim() || agent.subtitle;
  return buildSeoDescription(
    primary,
    `Explore ${agent.title} on Full Spectrum — how the agent works, and where it helps, at readfullspectrum.com.`
  );
}

export function AgentArticleView({
  agent,
  articlePath = `/agents/${agent.slug}`,
  linkTargets,
  relatedItems,
}: AgentArticleViewProps) {
  const tierClass = tierColors[agent.popularityTier] ?? tierColors.Foundational;
  const accent = agent.accentColor || "#f59e0b";
  const keywords = agentKeywords(agent);
  const seoDescription = agentSeoDescription(agent);
  const breadcrumbs = [
    { name: SITE_NAME, path: "/" },
    { name: "Agents", path: "/agents" },
    { name: agent.title, path: articlePath },
  ];
  const jsonLd = buildBlogPostingJsonLd({
    headline: agent.title,
    description: seoDescription,
    path: articlePath,
    image: agent.image,
    datePublished: agent.publishedAt,
    dateModified: agent.publishedAt,
    authorName: SITE_NAME,
    articleSection: "Agents",
    keywords,
  });

  return (
    <article>
      <JsonLd data={jsonLd} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbs)} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        {agent.image ? (
          <Image
            src={agent.image}
            alt={agent.imageAlt || `${agent.title} artwork`}
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
          {agent.eraOrigin && (
            <p
              className="font-mono-tax text-sm uppercase tracking-[0.3em] mb-3"
              style={{ color: accent }}
            >
              {agent.eraOrigin}
            </p>
          )}
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-wiki-ink text-balance leading-[1.05]">
            {agent.title}
          </h1>
          {agent.subtitle && (
            <p className="mt-6 text-xl text-wiki-ink/80 max-w-2xl leading-relaxed">
              {agent.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tierClass}`}
            >
              {agent.popularityTier}
            </span>
            {agent.regionOrigin && (
              <span className="text-sm text-wiki-muted font-mono-tax">
                {agent.regionOrigin}
              </span>
            )}
          </div>
        </div>
      </section>

      <StatsBar
        stats={agent.stats}
        statLabels={agent.statLabels}
        statKeys={agentStatKeys}
        order=""
        family=""
        conservationLabel=""
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          <AgentSidebar agent={agent} />

          <div className="prose-avian max-w-2xl text-[1.25rem] leading-[1.6]">
            {agent.sections.map((section, i) => (
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
          <Link href="/agents#collection" className="text-sm text-wiki-accent hover:underline">
            ← Back to The Collection
          </Link>
        </div>
      </section>
    </article>
  );
}

export function agentArticleMetadata(
  agent: AgentArticle,
  articlePath = `/agents/${agent.slug}`
): Metadata {
  const primary = agent.seoDescription?.trim() || agent.subtitle;
  return buildArticleMetadata({
    title: agent.title,
    description: primary,
    path: articlePath,
    siteName: SITE_NAME,
    image: agent.image,
    imageAlt: agent.imageAlt || `${agent.title} artwork`,
    publishedAt: agent.publishedAt,
    modifiedAt: agent.publishedAt,
    authorName: SITE_NAME,
    section: "Agents",
    keywords: agentKeywords(agent),
    fallbackDescription: `Explore ${agent.title} on Full Spectrum — how the agent works, and where it helps, at readfullspectrum.com.`,
  });
}

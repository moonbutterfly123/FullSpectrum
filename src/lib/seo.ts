import type { Metadata } from "next";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_DOMAIN,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
} from "./site";

const TITLE_MAX = 60;
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 160;

export interface ArticleSeoInput {
  title: string;
  description?: string;
  path: string;
  siteName: string;
  image?: string;
  imageAlt?: string;
  publishedAt?: string;
  modifiedAt?: string;
  authorName?: string;
  fallbackDescription?: string;
  type?: "article" | "website";
  section?: string;
  keywords?: string[];
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** Keep page titles concise; site name is appended via the root layout template. */
export function buildPageTitle(title: string): string {
  const plainTitle = normalizeWhitespace(title);

  if (plainTitle.length <= TITLE_MAX) {
    return plainTitle;
  }

  const cut = plainTitle.slice(0, TITLE_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > TITLE_MAX * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

/** Full title for Open Graph and Twitter, including site name. */
export function buildSeoTitle(title: string, siteName: string = SITE_NAME): string {
  const pageTitle = buildPageTitle(title);
  const suffix = ` | ${siteName}`;

  if (pageTitle.length + suffix.length <= TITLE_MAX) {
    return `${pageTitle}${suffix}`;
  }

  const maxTitleLength = TITLE_MAX - suffix.length - 1;
  const truncated = pageTitle.slice(0, Math.max(maxTitleLength, 12)).trim();
  return `${truncated}…${suffix}`;
}

/** Trim or expand descriptions into the 140–160 character SEO range. */
export function buildSeoDescription(
  primary: string | undefined,
  fallback: string
): string {
  const source = normalizeWhitespace(primary || fallback || "");
  if (!source) return fallback.slice(0, DESCRIPTION_MAX);

  if (source.length >= DESCRIPTION_MIN && source.length <= DESCRIPTION_MAX) {
    return source;
  }

  if (source.length > DESCRIPTION_MAX) {
    const cut = source.slice(0, DESCRIPTION_MAX - 1);
    const lastSpace = cut.lastIndexOf(" ");
    const trimmed =
      lastSpace >= DESCRIPTION_MIN - 20 ? cut.slice(0, lastSpace) : cut;
    return `${trimmed.trim()}…`;
  }

  const padded = normalizeWhitespace(`${source} ${fallback}`);
  if (padded.length <= DESCRIPTION_MAX) return padded;

  const cut = padded.slice(0, DESCRIPTION_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace >= DESCRIPTION_MIN ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function resolveOgImage(image?: string): string {
  if (!image) return absoluteUrl("/opengraph-image");
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return absoluteUrl(image);
}

export function buildArticleMetadata(input: ArticleSeoInput): Metadata {
  const {
    title,
    description,
    path,
    siteName,
    image,
    imageAlt,
    publishedAt,
    modifiedAt,
    fallbackDescription = `Read ${title} on ${siteName}.`,
    type = "article",
    section,
    keywords,
  } = input;

  const pageTitle = buildPageTitle(title);
  const seoTitle = buildSeoTitle(title, SITE_NAME);
  const seoDescription = buildSeoDescription(description, fallbackDescription);
  const canonicalUrl = absoluteUrl(path);
  const ogImage = resolveOgImage(image);
  const ogImageAlt = imageAlt || `${title} featured image`;

  return {
    title: pageTitle,
    description: seoDescription,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      ...(type === "article"
        ? {
            publishedTime: publishedAt,
            modifiedTime: modifiedAt ?? publishedAt,
            section,
          }
        : {}),
      images: [
        {
          url: ogImage,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [ogImage],
    },
  };
}

export interface BlogPostingJsonLdInput {
  headline: string;
  description: string;
  path: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  articleSection?: string;
  keywords?: string[];
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildWebSiteJsonLd() {
  const siteUrl = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_DOMAIN,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
      },
    },
  };
}

export function buildOrganizationJsonLd() {
  const siteUrl = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: ["readfullspectrum.com", SITE_DOMAIN],
    url: siteUrl,
    logo: absoluteUrl("/opengraph-image"),
    description: SITE_TAGLINE,
  };
}

export interface ItemListJsonLdInput {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}

export function buildItemListJsonLd(input: ItemListJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: absoluteUrl(input.path),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function buildBlogPostingJsonLd(input: BlogPostingJsonLdInput) {
  const pageUrl = absoluteUrl(input.path);
  const imageUrl = resolveOgImage(input.image);
  const authorName = input.authorName ?? SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    image: [imageUrl],
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/opengraph-image"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
  };
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  siteName?: string;
  type?: "article" | "website";
}): Metadata {
  const siteName = options.siteName ?? SITE_NAME;
  return buildArticleMetadata({
    title: options.title,
    description: options.description,
    path: options.path,
    siteName,
    fallbackDescription: options.description,
    type: options.type ?? "website",
  });
}

/** Section landing pages — detail string padded/truncated to SEO length with brand. */
export function buildSectionDescription(detail: string): string {
  return buildSeoDescription(
    detail,
    `${detail} — ${SITE_NAME} at readfullspectrum.com`
  );
}

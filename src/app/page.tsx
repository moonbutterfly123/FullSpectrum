import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Layout";
import { CuriosityIcon } from "@/components/CuriosityIcon";
import { JsonLd } from "@/components/JsonLd";
import { getAllBirds } from "@/lib/birds";
import { getAllFish } from "@/lib/fish";
import { getAllGenres } from "@/lib/genres";
import { buildPageMetadata, buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { categories } from "@/lib/types";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function HomePage() {
  const birds = getAllBirds();
  const fish = getAllFish();
  const genres = getAllGenres();

  const counts: Record<string, number> = {
    birds: birds.length,
    fish: fish.length,
    music: genres.length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <JsonLd data={buildWebSiteJsonLd()} />
      <JsonLd data={buildOrganizationJsonLd()} />
      <section className="text-center mb-16">
        <CuriosityIcon className="w-12 h-12 mx-auto mb-6 text-wiki-accent" />
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-wiki-ink mb-4">
          {SITE_NAME}
        </h1>
        <p className="text-lg text-wiki-muted max-w-2xl mx-auto">{SITE_TAGLINE}</p>
      </section>

      <section className="grid sm:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = counts[cat.id] ?? 0;
          const label = cat.id === "music" ? "genres" : "species";

          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="block border border-wiki-border rounded-xl p-6 transition-all hover:border-wiki-accent/40 hover:shadow-md bg-wiki-card"
            >
              <span className="text-3xl">{cat.emoji}</span>
              <h2 className="font-display text-xl font-bold text-wiki-ink mt-3">
                {cat.name}
              </h2>
              <p className="text-sm text-wiki-muted mt-2">{cat.description}</p>
              <p className="text-xs text-wiki-accent mt-4 font-medium">
                {count} {label} → Explore {cat.name}
              </p>
            </Link>
          );
        })}
      </section>
      <Footer />
    </div>
  );
}

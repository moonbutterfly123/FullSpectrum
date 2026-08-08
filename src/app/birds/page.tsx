import type { Metadata } from "next";
import { BirdCollection } from "@/components/BirdCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { FeatherIcon } from "@/components/FeatherIcon";
import { getAllBirds } from "@/lib/birds";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Birds",
  description: buildSectionDescription(
    "Explore 100+ bird species with detailed guides on appearance, habitat, behavior, and conservation"
  ),
  path: "/birds",
});

export default function BirdsHomePage() {
  const birds = getAllBirds();

  return (
    <>
      <CollectionJsonLd
        name="Birds Collection"
        path="/birds"
        items={birds.map((bird) => ({
          name: bird.title,
          path: `/birds/${bird.slug}`,
        }))}
      />
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <div className="relative text-center max-w-3xl px-6 py-20">
          <FeatherIcon className="w-12 h-12 mx-auto mb-6 text-wiki-accent" />
          <p className="font-mono-tax text-sm text-wiki-secondary tracking-[0.3em] uppercase mb-4">
            {SITE_NAME}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-wiki-ink text-balance leading-[1.05]">
            Birds
          </h1>
          <p className="mt-8 text-lg text-wiki-muted max-w-xl mx-auto leading-relaxed">
            A friendly guide to the world&apos;s birds — clear, detailed, and easy
            to explore. Learn about appearance, habitat, behavior, and more, one
            species at a time.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="#collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wiki-accent text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <span aria-hidden>📖</span>
              Browse All Birds
            </a>
            <a
              href="#collection"
              className="inline-flex items-center gap-2 px-6 py-3 border border-wiki-border text-wiki-ink rounded-md font-medium hover:bg-wiki-sidebar transition-colors"
            >
              Browse Collection
              <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Collection */}
      <BirdCollection birds={birds} />

      {/* About */}
      <section className="border-t border-wiki-border py-20 bg-wiki-sidebar/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-medium text-wiki-ink mb-6">
            About This Project
          </h2>
          <p className="text-wiki-muted leading-relaxed">
            Each bird has its own detailed article — covering appearance, habitat,
            diet, behavior, and conservation. Written to be easy to understand,
            whether you&apos;re a casual bird lover or a serious enthusiast.
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { FishCollection } from "@/components/FishCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { getAllFish } from "@/lib/fish";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Fish",
  description: buildSectionDescription(
    "Explore 90+ fish species — weird superpowers, deep-sea oddities, and underwater drama"
  ),
  path: "/fish",
});

export default function FishHomePage() {
  const fish = getAllFish();

  return (
    <>
      <CollectionJsonLd
        name="Fish Collection"
        path="/fish"
        items={fish.map((entry) => ({
          name: entry.title,
          path: `/fish/${entry.slug}`,
        }))}
      />
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <div className="relative text-center max-w-3xl px-6 py-20">
          <p className="font-mono-tax text-sm text-wiki-secondary tracking-[0.3em] uppercase mb-4">
            {SITE_NAME}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-wiki-ink text-balance leading-[1.05]">
            Fish
          </h1>
          <p className="mt-8 text-lg text-wiki-muted max-w-xl mx-auto leading-relaxed">
            A friendly guide to the world&apos;s fish — weird superpowers, bizarre
            self-defense, deep-sea oddities, and underwater drama. Meet the
            ocean&apos;s most fascinating creatures, one species at a time.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="#collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wiki-accent text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <span aria-hidden>📖</span>
              Browse All Fish
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

      <FishCollection fish={fish} />

      <section className="border-t border-wiki-border py-20 bg-wiki-sidebar/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-medium text-wiki-ink mb-6">
            About This Project
          </h2>
          <p className="text-wiki-muted leading-relaxed">
            Each fish gets its own detailed article — covering appearance, habitat,
            diet, behavior, and conservation. Written to be easy to understand,
            whether you&apos;re a casual ocean lover or a serious enthusiast.
          </p>
        </div>
      </section>
    </>
  );
}

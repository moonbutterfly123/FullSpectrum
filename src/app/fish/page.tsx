import type { Metadata } from "next";
import { FishCollection } from "@/components/FishCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { getAllFish } from "@/lib/fish";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Fish Collection",
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
      <FishCollection fish={fish} />
    </>
  );
}

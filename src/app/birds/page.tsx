import type { Metadata } from "next";
import { BirdCollection } from "@/components/BirdCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { getAllBirds } from "@/lib/birds";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Bird Collection",
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
        name="Bird Collection"
        path="/birds"
        items={birds.map((bird) => ({
          name: bird.title,
          path: `/birds/${bird.slug}`,
        }))}
      />
      <BirdCollection birds={birds} />
    </>
  );
}

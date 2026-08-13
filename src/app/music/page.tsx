import type { Metadata } from "next";
import { GenreCollection } from "@/components/GenreCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { getAllGenres } from "@/lib/genres";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Music Genre Collection",
  description: buildSectionDescription(
    "Explore 100+ music genres — the sounds, pioneers, drama, and culture behind each one"
  ),
  path: "/music",
});

export default async function MusicHomePage() {
  const genres = await getAllGenres();

  return (
    <>
      <CollectionJsonLd
        name="Music Genre Collection"
        path="/music"
        items={genres.map((genre) => ({
          name: genre.title,
          path: `/music/${genre.slug}`,
        }))}
      />
      <GenreCollection genres={genres} />
    </>
  );
}

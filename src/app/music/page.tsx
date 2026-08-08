import type { Metadata } from "next";
import { GenreCollection } from "@/components/GenreCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { MusicIcon } from "@/components/MusicIcon";
import { getAllGenres } from "@/lib/genres";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Music Genres",
  description: buildSectionDescription(
    "Explore 100+ music genres — the sounds, pioneers, drama, and culture behind each one"
  ),
  path: "/music",
});

export default function MusicHomePage() {
  const genres = getAllGenres();

  return (
    <>
      <CollectionJsonLd
        name="Music Genres Collection"
        path="/music"
        items={genres.map((genre) => ({
          name: genre.title,
          path: `/music/${genre.slug}`,
        }))}
      />
      <section className="relative min-h-[85vh] flex items-center justify-center">
        <div className="relative text-center max-w-3xl px-6 py-20">
          <MusicIcon className="w-12 h-12 mx-auto mb-6 text-wiki-accent" />
          <p className="font-mono-tax text-sm text-wiki-secondary tracking-[0.3em] uppercase mb-4">
            {SITE_NAME}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-medium text-wiki-ink text-balance leading-[1.05]">
            Music Genres
          </h1>
          <p className="mt-8 text-lg text-wiki-muted max-w-xl mx-auto leading-relaxed">
            A colorful guide to the music genres that shaped America — the
            sounds, the pioneers, the drama, and the culture, one genre at a
            time.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="#collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wiki-accent text-white rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              <span aria-hidden>📖</span>
              Browse All Genres
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

      <GenreCollection genres={genres} />

      <section className="border-t border-wiki-border py-20 bg-wiki-sidebar/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-medium text-wiki-ink mb-6">
            About This Project
          </h2>
          <p className="text-wiki-muted leading-relaxed">
            Each genre gets a fun, easy-to-read article covering its sound,
            origins, legends, defining tracks, subgenres, cultural impact, and
            exactly where to start listening.
          </p>
        </div>
      </section>
    </>
  );
}

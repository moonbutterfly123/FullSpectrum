import { GenreCard } from "./GenreCard";
import type { GenreMeta } from "@/lib/genres";

interface GenreCollectionProps {
  genres: GenreMeta[];
}

export function GenreCollection({ genres }: GenreCollectionProps) {
  return (
    <section id="collection" className="py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl font-medium text-wiki-ink">
            The Collection
          </h2>
          <p className="font-mono-tax text-sm text-wiki-muted">
            {genres.length} genres
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {genres.map((genre) => (
            <GenreCard key={genre.slug} genre={genre} />
          ))}
        </div>
      </div>
    </section>
  );
}

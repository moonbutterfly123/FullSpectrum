import Link from "next/link";
import Image from "next/image";
import type { GenreMeta } from "@/lib/genres";

interface GenreCardProps {
  genre: GenreMeta;
}

export function GenreCard({ genre }: GenreCardProps) {
  return (
    <Link href={`/music/${genre.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-wiki-sidebar">
        {genre.image ? (
          <Image
            src={genre.image}
            alt={genre.imageAlt || genre.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(150deg, ${genre.accentColor}, #140e26)`,
            }}
          />
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-heading text-lg font-medium text-wiki-ink group-hover:text-wiki-accent transition-colors leading-snug">
          {genre.title}
        </h3>
        <p className="font-mono-tax text-sm text-wiki-muted mt-0.5">
          {genre.eraOrigin}
        </p>
      </div>
    </Link>
  );
}

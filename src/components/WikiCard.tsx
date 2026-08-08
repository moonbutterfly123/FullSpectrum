import Link from "next/link";
import Image from "next/image";
import type { WikiEntryMeta } from "@/lib/types";

interface WikiCardProps {
  entry: WikiEntryMeta;
  basePath: string;
}

export function WikiCard({ entry, basePath }: WikiCardProps) {
  return (
    <Link href={`${basePath}/${entry.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-wiki-sidebar">
        {entry.image ? (
          <Image
            src={entry.image}
            alt={entry.imageAlt || entry.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-wiki-muted">
            No image
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="font-heading text-lg font-medium text-wiki-ink group-hover:text-wiki-accent transition-colors leading-snug">
          {entry.title}
        </h3>
        <p className="font-mono-tax text-sm text-wiki-muted italic mt-0.5">
          {entry.scientificName}
        </p>
      </div>
    </Link>
  );
}

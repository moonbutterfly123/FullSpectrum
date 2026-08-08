import Image from "next/image";
import Link from "next/link";
import type { RelatedEntry } from "@/lib/related";

interface RelatedArticlesProps {
  items: RelatedEntry[];
  heading?: string;
}

export function RelatedArticles({
  items,
  heading = "You might also like",
}: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-wiki-border">
      <h2 className="font-display text-2xl font-medium text-wiki-ink mb-6">
        {heading}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={item.href}
            className="group block rounded-lg border border-wiki-border overflow-hidden bg-wiki-card hover:border-wiki-accent/40 transition-colors"
          >
            <div className="relative aspect-[4/3] bg-wiki-sidebar">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              ) : null}
            </div>
            <div className="p-4">
              <p className="font-medium text-wiki-ink group-hover:text-wiki-accent transition-colors leading-snug">
                {item.title}
              </p>
              {item.reason && (
                <p className="text-xs text-wiki-muted mt-2 font-mono-tax">{item.reason}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

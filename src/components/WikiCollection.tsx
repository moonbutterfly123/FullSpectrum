import { WikiCard } from "./WikiCard";
import type { WikiEntryMeta } from "@/lib/types";

interface WikiCollectionProps {
  entries: WikiEntryMeta[];
  basePath: string;
  label: string;
}

export function WikiCollection({ entries, basePath, label }: WikiCollectionProps) {
  return (
    <section id="collection" className="py-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl font-medium text-wiki-ink">
            The Collection
          </h2>
          <p className="font-mono-tax text-sm text-wiki-muted">
            {entries.length} {label}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {entries.map((entry) => (
            <WikiCard key={entry.slug} entry={entry} basePath={basePath} />
          ))}
        </div>
      </div>
    </section>
  );
}

import type { WikiEntry } from "@/lib/types";

interface WikiSidebarProps {
  entry: WikiEntry;
}

export function WikiSidebar({ entry }: WikiSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
            Classification
          </h3>
          <dl className="space-y-2 text-sm">
            {entry.order && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Order</dt>
                <dd className="text-wiki-ink text-right">{entry.order}</dd>
              </div>
            )}
            {entry.family && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Family</dt>
                <dd className="text-wiki-ink text-right">{entry.family}</dd>
              </div>
            )}
            {entry.scientificName && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Scientific Name</dt>
                <dd className="text-wiki-ink text-right italic">{entry.scientificName}</dd>
              </div>
            )}
          </dl>
        </div>

        {entry.regions.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Regions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {entry.regions.map((region) => (
                <span
                  key={region}
                  className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        )}

        {entry.habitat && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Habitat
            </h3>
            <p className="text-sm text-wiki-muted leading-relaxed">{entry.habitat}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

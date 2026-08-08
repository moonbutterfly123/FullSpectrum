import type { GenreArticle } from "@/lib/genres";

interface GenreSidebarProps {
  genre: GenreArticle;
}

export function GenreSidebar({ genre }: GenreSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
            Profile
          </h3>
          <dl className="space-y-2 text-sm">
            {genre.eraOrigin && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Era</dt>
                <dd className="text-wiki-ink text-right">{genre.eraOrigin}</dd>
              </div>
            )}
            {genre.regionOrigin && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Origin</dt>
                <dd className="text-wiki-ink text-right">{genre.regionOrigin}</dd>
              </div>
            )}
            {genre.tempoBpm && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Tempo</dt>
                <dd className="text-wiki-ink text-right">{genre.tempoBpm}</dd>
              </div>
            )}
            {genre.popularityTier && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Popularity</dt>
                <dd className="text-wiki-ink text-right">{genre.popularityTier}</dd>
              </div>
            )}
          </dl>
        </div>

        {genre.parentGenres.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Roots
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {genre.parentGenres.map((g) => (
                <span key={g} className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {genre.keyInstruments.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Key Instruments
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {genre.keyInstruments.map((i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {genre.signatureSound && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Signature Sound
            </h3>
            <p className="text-sm text-wiki-muted leading-relaxed">{genre.signatureSound}</p>
          </div>
        )}

        {genre.regions.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Regions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {genre.regions.map((r) => (
                <span key={r} className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

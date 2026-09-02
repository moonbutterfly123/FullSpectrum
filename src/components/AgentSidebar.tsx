import type { AgentArticle } from "@/lib/agents";

interface AgentSidebarProps {
  agent: AgentArticle;
}

export function AgentSidebar({ agent }: AgentSidebarProps) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
            Profile
          </h3>
          <dl className="space-y-2 text-sm">
            {agent.eraOrigin && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Category</dt>
                <dd className="text-wiki-ink text-right">{agent.eraOrigin}</dd>
              </div>
            )}
            {agent.regionOrigin && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Focus</dt>
                <dd className="text-wiki-ink text-right">{agent.regionOrigin}</dd>
              </div>
            )}
            {agent.tempoBpm && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Read time</dt>
                <dd className="text-wiki-ink text-right">{agent.tempoBpm}</dd>
              </div>
            )}
            {agent.popularityTier && (
              <div className="flex justify-between gap-2">
                <dt className="text-wiki-muted">Difficulty</dt>
                <dd className="text-wiki-ink text-right">{agent.popularityTier}</dd>
              </div>
            )}
          </dl>
        </div>

        {agent.parentGenres.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Related agents
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.parentGenres.map((g) => (
                <span key={g} className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink">
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        {agent.keyInstruments.length > 0 && (
          <div>
            <h3 className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3 pb-2 border-b border-wiki-border">
              Key concepts
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {agent.keyInstruments.map((i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-wiki-sidebar text-wiki-ink">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

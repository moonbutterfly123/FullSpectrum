import { AgentCard } from "./AgentCard";
import type { AgentMeta } from "@/lib/agents";

interface AgentCollectionProps {
  agents: AgentMeta[];
}

export function AgentCollection({ agents }: AgentCollectionProps) {
  return (
    <section id="collection" className="pt-8 pb-16 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-display text-3xl font-medium text-wiki-ink">
            Agent Collection
          </h1>
          <p className="font-mono-tax text-sm text-wiki-muted">
            {agents.length} agents
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </div>
    </section>
  );
}

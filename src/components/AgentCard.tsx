import Link from "next/link";
import Image from "next/image";
import type { AgentMeta } from "@/lib/agents";

const tierColors: Record<string, string> = {
  Foundational: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-sky-100 text-sky-700",
  Advanced: "bg-violet-100 text-violet-700",
};

interface AgentCardProps {
  agent: AgentMeta;
}

export function AgentCard({ agent }: AgentCardProps) {
  const tierClass = tierColors[agent.popularityTier] ?? tierColors.Foundational;

  return (
    <Link href={`/agents/${agent.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-wiki-sidebar">
        {agent.image ? (
          <Image
            src={agent.image}
            alt={agent.imageAlt || agent.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(150deg, ${agent.accentColor}, #140e26)`,
            }}
          />
        )}
        <span
          className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold ${tierClass}`}
        >
          {agent.popularityTier}
        </span>
      </div>
      <div className="mt-3">
        <h3 className="font-heading text-lg font-medium text-wiki-ink group-hover:text-wiki-accent transition-colors leading-snug">
          {agent.title}
        </h3>
        <p className="font-mono-tax text-sm text-wiki-muted mt-0.5">
          {agent.regionOrigin || agent.eraOrigin}
        </p>
      </div>
    </Link>
  );
}

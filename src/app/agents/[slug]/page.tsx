import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentArticleView, agentArticleMetadata } from "@/components/AgentArticleView";
import { getAgent, getAgentSlugs, getAllAgents } from "@/lib/agents";
import { buildGenreLinkTargets, getRelatedGenres } from "@/lib/related";

interface AgentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAgentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) return { title: "Not Found" };
  return agentArticleMetadata(agent, `/agents/${slug}`);
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const agent = await getAgent(slug);
  if (!agent) notFound();

  const allAgents = await getAllAgents();
  const linkTargets = buildGenreLinkTargets(allAgents, slug, "/agents");
  const relatedItems = getRelatedGenres(agent, allAgents, 4, "/agents");

  return (
    <AgentArticleView
      agent={agent}
      articlePath={`/agents/${slug}`}
      linkTargets={linkTargets}
      relatedItems={relatedItems}
    />
  );
}

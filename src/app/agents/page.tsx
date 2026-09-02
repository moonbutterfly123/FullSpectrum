import type { Metadata } from "next";
import { AgentCollection } from "@/components/AgentCollection";
import { CollectionJsonLd } from "@/components/CollectionJsonLd";
import { getAllAgents } from "@/lib/agents";
import { buildPageMetadata, buildSectionDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Agent Collection",
  description: buildSectionDescription(
    "Explore 100 AI agent applications — travel, finance, health, home, and everyday work partners"
  ),
  path: "/agents",
});

export default async function AgentsHomePage() {
  const agents = await getAllAgents();

  return (
    <>
      <CollectionJsonLd
        name="Agent Collection"
        path="/agents"
        items={agents.map((agent) => ({
          name: agent.title,
          path: `/agents/${agent.slug}`,
        }))}
      />
      <AgentCollection agents={agents} />
    </>
  );
}

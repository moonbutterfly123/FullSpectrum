import { AgentFooter } from "@/components/Layout";

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <AgentFooter />
    </>
  );
}

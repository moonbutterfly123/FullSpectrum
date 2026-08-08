interface StatsBarProps {
  stats: Record<string, string>;
  statLabels: Record<string, string>;
  statKeys: string[];
  order: string;
  family: string;
  conservationLabel: string;
}

export function StatsBar({
  stats,
  statLabels,
  statKeys,
  order,
  family,
  conservationLabel,
}: StatsBarProps) {
  const items = [
    ...statKeys.map((key) => ({
      label: statLabels[key] ?? key,
      value: stats[key],
    })),
    ...(order ? [{ label: "Order", value: order }] : []),
    ...(family ? [{ label: "Family", value: family }] : []),
    ...(conservationLabel ? [{ label: "Status", value: conservationLabel }] : []),
  ].filter((item) => item.value);

  return (
    <section className="border-y border-wiki-border bg-wiki-sidebar/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-wiki-border rounded-md overflow-hidden">
          {items.map((item) => (
            <div key={item.label} className="bg-wiki-bg p-6 text-center">
              <p className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-1">
                {item.label}
              </p>
              <p className="text-sm font-medium text-wiki-ink">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

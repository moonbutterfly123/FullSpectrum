import { JsonLd } from "@/components/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo";

interface CollectionJsonLdProps {
  name: string;
  path: string;
  items: { name: string; path: string }[];
}

export function CollectionJsonLd({ name, path, items }: CollectionJsonLdProps) {
  return (
    <JsonLd
      data={buildItemListJsonLd({
        name,
        path,
        items,
      })}
    />
  );
}

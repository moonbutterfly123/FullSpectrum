import { WikiCollection } from "./WikiCollection";
import type { FishMeta } from "@/lib/types";

interface FishCollectionProps {
  fish: FishMeta[];
}

export function FishCollection({ fish }: FishCollectionProps) {
  return <WikiCollection entries={fish} basePath="/fish" label="fish" />;
}

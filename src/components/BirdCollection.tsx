"use client";

import { WikiCollection } from "./WikiCollection";
import type { BirdMeta } from "@/lib/types";

interface BirdCollectionProps {
  birds: BirdMeta[];
}

export function BirdCollection({ birds }: BirdCollectionProps) {
  return <WikiCollection entries={birds} basePath="/birds" label="birds" />;
}

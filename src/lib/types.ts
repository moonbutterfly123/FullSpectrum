export type CategoryId = "birds" | "fish" | "music";

export type ConservationCode = "LC" | "NT" | "VU" | "EN" | "CR" | "EW" | "DD";

export interface WikiSection {
  title: string;
  content: string;
}

export interface WikiEntryMeta {
  slug: string;
  title: string;
  scientificName: string;
  subtitle: string;
  seoDescription: string;
  image: string;
  imageAlt: string;
  conservationCode: ConservationCode;
  conservationLabel: string;
  order: string;
  family: string;
  stats: Record<string, string>;
  statLabels: Record<string, string>;
  regions: string[];
  habitat: string;
  displayOrder: number;
  publishedAt: string;
  wordCount: number;
}

export interface WikiEntry extends WikiEntryMeta {
  sections: WikiSection[];
}

export type BirdMeta = WikiEntryMeta;
export type BirdArticle = WikiEntry;
export type FishMeta = WikiEntryMeta;
export type FishArticle = WikiEntry;

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  emoji: string;
  href: string;
  wikiName: string;
}

export const categories: Category[] = [
  {
    id: "birds",
    name: "Birds",
    description:
      "Detailed species articles on appearance, habitat, behavior, and conservation.",
    emoji: "🐦",
    href: "/birds",
    wikiName: "Birds",
  },
  {
    id: "fish",
    name: "Fish",
    description:
      "Weird superpowers, deep-sea oddities, and underwater drama — one species at a time.",
    emoji: "🐟",
    href: "/fish",
    wikiName: "Fish",
  },
  {
    id: "music",
    name: "Music Genres",
    description:
      "The sounds, the pioneers, the drama, and the culture, one genre at a time.",
    emoji: "🎵",
    href: "/music",
    wikiName: "Music",
  },
];

export const conservationColors: Record<
  ConservationCode,
  { bg: string; text: string }
> = {
  LC: { bg: "bg-emerald-100", text: "text-emerald-700" },
  NT: { bg: "bg-lime-100", text: "text-lime-700" },
  VU: { bg: "bg-orange-100", text: "text-orange-700" },
  EN: { bg: "bg-red-100", text: "text-red-700" },
  CR: { bg: "bg-red-200", text: "text-red-800" },
  EW: { bg: "bg-gray-200", text: "text-gray-700" },
  DD: { bg: "bg-yellow-100", text: "text-yellow-700" },
};

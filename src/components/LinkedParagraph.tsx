import Link from "next/link";
import {
  splitTextWithInternalLinks,
  type InternalLinkTarget,
} from "@/lib/internal-links";

interface LinkedParagraphProps {
  text: string;
  linkTargets: InternalLinkTarget[];
}

export function LinkedParagraph({ text, linkTargets }: LinkedParagraphProps) {
  const segments = splitTextWithInternalLinks(text, linkTargets);

  return (
    <p>
      {segments.map((segment, index) =>
        segment.type === "link" && segment.href ? (
          <Link
            key={`${segment.href}-${index}`}
            href={segment.href}
            className="text-wiki-accent underline decoration-wiki-accent/40 underline-offset-2 hover:decoration-wiki-accent"
          >
            {segment.value}
          </Link>
        ) : (
          <span key={index}>{segment.value}</span>
        )
      )}
    </p>
  );
}

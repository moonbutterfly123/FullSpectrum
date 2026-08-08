import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GenreArticleView, genreArticleMetadata } from "@/components/GenreArticleView";
import { getAllGenres, getGenre, getGenreSlugs } from "@/lib/genres";
import { buildGenreLinkTargets, getRelatedGenres } from "@/lib/related";

interface GenrePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getGenreSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenre(slug);
  if (!genre) return { title: "Not Found" };
  return genreArticleMetadata(genre, `/music/${slug}`);
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  const genre = getGenre(slug);
  if (!genre) notFound();

  const allGenres = getAllGenres();
  const linkTargets = buildGenreLinkTargets(allGenres, slug);
  const relatedItems = getRelatedGenres(genre, allGenres);

  return (
    <GenreArticleView
      genre={genre}
      articlePath={`/music/${slug}`}
      linkTargets={linkTargets}
      relatedItems={relatedItems}
    />
  );
}

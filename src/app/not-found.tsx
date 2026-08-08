import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: `This page could not be found on ${SITE_NAME}.`,
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-32 text-center">
      <p className="font-mono-tax text-sm text-wiki-muted uppercase tracking-widest mb-4">
        404
      </p>
      <h1 className="font-display text-4xl font-medium text-wiki-ink mb-4">
        Page not found
      </h1>
      <p className="text-wiki-muted mb-8">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          href="/"
          className="px-5 py-2.5 bg-wiki-accent text-white rounded-md font-medium hover:opacity-90"
        >
          Go home
        </Link>
        <Link
          href="/birds#collection"
          className="px-5 py-2.5 border border-wiki-border rounded-md font-medium hover:bg-wiki-sidebar"
        >
          Browse birds
        </Link>
      </div>
    </div>
  );
}

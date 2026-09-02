"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { CuriosityIcon } from "./CuriosityIcon";

import { SITE_NAME } from "@/lib/site";



function navClass(active: boolean) {

  return `text-sm font-medium transition-colors ${

    active ? "text-wiki-accent" : "text-wiki-muted hover:text-wiki-ink"

  }`;

}



export function Header() {

  const pathname = usePathname();

  const inBirds = pathname.startsWith("/birds");

  const inFish = pathname.startsWith("/fish");

  const inMusic = pathname.startsWith("/music");

  const inAgents = pathname.startsWith("/agents");

  const inSection = inBirds || inFish || inMusic || inAgents;



  return (

    <header className="border-b border-wiki-border/60 bg-wiki-bg/90 backdrop-blur-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2 group min-w-0">

          <CuriosityIcon className="w-5 h-5 text-wiki-accent shrink-0" />

          <span className="font-display text-lg font-medium text-wiki-ink group-hover:text-wiki-accent transition-colors truncate">

            {SITE_NAME}

          </span>

        </Link>



        <nav className="flex items-center gap-6">

          {inSection ? (

            <>

              {inBirds && (

                <>

                  <Link href="/birds" className={navClass(pathname === "/birds")}>

                    Birds

                  </Link>

                  <Link href="/birds#collection" className={navClass(false)}>

                    Field Guide

                  </Link>

                </>

              )}

              {inFish && (

                <>

                  <Link href="/fish" className={navClass(pathname === "/fish")}>

                    Fish

                  </Link>

                  <Link href="/fish#collection" className={navClass(false)}>

                    Field Guide

                  </Link>

                </>

              )}

              {inMusic && (

                <>

                  <Link href="/music" className={navClass(pathname === "/music")}>

                    Music

                  </Link>

                  <Link href="/music#collection" className={navClass(false)}>

                    Browse Genres

                  </Link>

                </>

              )}

              {inAgents && (

                <>

                  <Link href="/agents" className={navClass(pathname === "/agents")}>

                    Agents

                  </Link>

                  <Link href="/agents#collection" className={navClass(false)}>

                    Browse Agents

                  </Link>

                </>

              )}

              <Link href="/" className="text-sm text-wiki-muted hover:text-wiki-ink">

                All Collections

              </Link>

            </>

          ) : (

            <>

              <Link href="/" className={navClass(pathname === "/")}>

                Home

              </Link>

              <Link href="/birds" className={navClass(pathname.startsWith("/birds"))}>

                Birds

              </Link>

              <Link href="/fish" className={navClass(pathname.startsWith("/fish"))}>

                Fish

              </Link>

              <Link href="/music" className={navClass(pathname.startsWith("/music"))}>

                Music

              </Link>

              <Link href="/agents" className={navClass(pathname.startsWith("/agents"))}>

                Agents

              </Link>

            </>

          )}

        </nav>

      </div>

    </header>

  );

}



function SectionFooter({

  title,

  description,

  collectionHref,

  collectionLabel,

  note,

}: {

  title: string;

  description: string;

  collectionHref: string;

  collectionLabel: string;

  note: string;

}) {

  return (

    <footer className="border-t border-wiki-border py-12 bg-wiki-bg">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">

          <div>

            <div className="flex items-center gap-2 mb-3">

              <CuriosityIcon className="w-5 h-5 text-wiki-accent" />

              <span className="font-display text-lg font-medium text-wiki-ink">

                {SITE_NAME}

              </span>

            </div>

            <p className="text-sm font-medium text-wiki-ink mb-1">{title}</p>

            <p className="text-sm text-wiki-muted max-w-sm">{description}</p>

          </div>

          <div>

            <p className="font-mono-tax text-xs uppercase tracking-wider text-wiki-muted mb-3">

              Navigate

            </p>

            <ul className="space-y-2 text-sm">

              <li>

                <Link href={collectionHref} className="text-wiki-muted hover:text-wiki-accent">

                  {collectionLabel}

                </Link>

              </li>

              <li>

                <Link href="/" className="text-wiki-muted hover:text-wiki-accent">

                  All Collections

                </Link>

              </li>

            </ul>

          </div>

        </div>

        <p className="text-xs text-wiki-muted mt-10 pt-6 border-t border-wiki-border">

          {note}

        </p>

      </div>

    </footer>

  );

}



export function Footer() {

  return (

    <footer className="border-t border-wiki-border py-12 bg-wiki-bg">

      <div className="max-w-6xl mx-auto px-6">

        <p className="text-xs text-wiki-muted text-center">

          {SITE_NAME} — encyclopedic articles on birds, fish, music, AI agents, and natural history.

        </p>

      </div>

    </footer>

  );

}



export function BirdFooter() {

  return (

    <SectionFooter

      title="Birds"

      description="A friendly guide to the world's birds — clear, detailed, and easy to explore."

      collectionHref="/birds#collection"

      collectionLabel="Field Guide"

      note="Each bird gets a detailed, easy-to-read article covering its appearance, habitat, diet, behavior, and conservation status."

    />

  );

}



export function FishFooter() {

  return (

    <SectionFooter

      title="Fish"

      description="Weird superpowers, deep-sea oddities, and underwater drama — one species at a time."

      collectionHref="/fish#collection"

      collectionLabel="Field Guide"

      note="Each fish gets a detailed, easy-to-read article covering its appearance, habitat, diet, behavior, and conservation status."

    />

  );

}



export function MusicFooter() {

  return (

    <SectionFooter

      title="Music Genres"

      description="The sounds, the pioneers, the drama, and the culture behind every genre."

      collectionHref="/music#collection"

      collectionLabel="Browse Genres"

      note="Each genre gets a fun, easy-to-read article covering its sound, origins, legends, defining tracks, and cultural impact."

    />

  );

}



export function AgentFooter() {

  return (

    <SectionFooter

      title="Agents"

      description="Practical AI agent applications — travel, finance, health, home, and everyday work partners."

      collectionHref="/agents#collection"

      collectionLabel="Browse Agents"

      note="Each agent gets a clear article covering the problem it solves, how it works, and what it still cannot do."

    />

  );

}


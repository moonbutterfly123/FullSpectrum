#!/usr/bin/env node
/**
 * Add or refresh seoDescription frontmatter on all articles (140–160 chars).
 * Usage:
 *   node scripts/generate-seo-descriptions.mjs          # new files only
 *   node scripts/generate-seo-descriptions.mjs --force  # refresh all
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";
import { truncateSeoDescription } from "./seo-description-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT = path.join(__dirname, "..", "content");
const force = process.argv.includes("--force");

const FALLBACKS = {
  birds: (title) =>
    `${title} on Full Spectrum — habitat, behavior, and conservation. readfullspectrum.com`,
  fish: (title) =>
    `${title} on Full Spectrum — biology, habitat, and ocean oddities. readfullspectrum.com`,
  music: (title) =>
    `${title} on Full Spectrum — sound, origins, and cultural impact. readfullspectrum.com`,
  agents: (title) =>
    `${title} on Full Spectrum — how the agent works and where it helps. readfullspectrum.com`,
};

let updated = 0;
let skipped = 0;

for (const category of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, category);
  if (!fs.statSync(dir).isDirectory()) continue;

  const fallbackFn = FALLBACKS[category];
  if (!fallbackFn) continue;

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = matter(raw);

    if (!force && parsed.data.seoDescription && String(parsed.data.seoDescription).trim()) {
      skipped++;
      continue;
    }

    const title = parsed.data.title || file.replace(".md", "");
    parsed.data.seoDescription = truncateSeoDescription(
      parsed.data.subtitle,
      fallbackFn(title)
    );

    fs.writeFileSync(
      filePath,
      matter.stringify(parsed.content, parsed.data, {
        language: "yaml",
      }),
      "utf8"
    );
    updated++;
  }
}

console.log(
  `seoDescription: ${updated} ${force ? "refreshed" : "added"}, ${skipped} skipped${force ? "" : " (use --force to refresh all)"}`
);

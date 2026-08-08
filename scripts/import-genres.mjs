#!/usr/bin/env node
/**
 * Import all genres from base44 SonicMap API.
 * Usage: node scripts/import-genres.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const GENRES_DIR = path.join(ROOT, "content", "music");
const IMAGES_DIR = path.join(ROOT, "public", "images", "music");
const API_URL =
  "https://base44.app/api/apps/6a6ed0e49456b5c03dc2f8f9/entities/Genre";

function yamlString(value) {
  if (value == null) return '""';
  const str = String(value);
  if (str.includes("\n") || str.includes('"') || str.includes(":")) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str.includes(" ") ? `"${str}"` : str;
}

function buildMarkdown(genre, localImage) {
  const keyTools = (genre.key_instruments || []).slice(0, 4).join(" · ");
  const roots = (genre.parent_genres || []).join(", ");

  const frontmatter = [
    "---",
    `title: ${yamlString(genre.genre_name)}`,
    `subtitle: ${yamlString(genre.summary)}`,
    `image: ${yamlString(localImage)}`,
    `imageAlt: ${yamlString(genre.image_alt || genre.genre_name)}`,
    `popularityTier: ${yamlString(genre.popularity_tier || "Major")}`,
    `eraOrigin: ${yamlString(genre.era_origin)}`,
    `regionOrigin: ${yamlString(genre.region_origin)}`,
    `tempoBpm: ${yamlString(genre.tempo_bpm)}`,
    `signatureSound: ${yamlString(genre.signature_sound)}`,
    `culturalMovement: ${yamlString(genre.cultural_movement)}`,
    `accentColor: ${yamlString(genre.accent_color || "#a855f7")}`,
    "parentGenres:",
    ...(genre.parent_genres || []).map((g) => `  - ${yamlString(g)}`),
    "keyInstruments:",
    ...(genre.key_instruments || []).map((i) => `  - ${yamlString(i)}`),
    "regions:",
    ...(genre.regions || []).map((r) => `  - ${yamlString(r)}`),
    "stats:",
    `  era: ${yamlString(genre.era_origin)}`,
    `  origin: ${yamlString(genre.region_origin)}`,
    `  tempo: ${yamlString(genre.tempo_bpm)}`,
    `  popularity: ${yamlString(genre.popularity_tier)}`,
    `  roots: ${yamlString(roots)}`,
    `  keyTools: ${yamlString(keyTools)}`,
    `displayOrder: ${genre.display_order ?? 999}`,
    `publishedAt: ${(genre.updated_date || genre.created_date || new Date().toISOString()).split("T")[0]}`,
    "---",
    "",
  ].join("\n");

  const sections = (genre.sections || [])
    .map((s) => `## ${s.title}\n\n${(s.body || "").trim()}`)
    .join("\n\n");

  return frontmatter + sections + "\n";
}

async function downloadImage(url, dest) {
  if (!url) return false;
  if (fs.existsSync(dest)) return true;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch {
    return false;
  }
}

function getImageExt(url) {
  if (!url) return ".png";
  const match = url.match(/\.(png|jpe?g|webp|gif)(\?|$)/i);
  return match ? `.${match[1].toLowerCase().replace("jpeg", "jpg")}` : ".png";
}

async function main() {
  console.log("Fetching genres from SonicMap API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const genres = await res.json();
  console.log(`Found ${genres.length} genres`);

  fs.mkdirSync(GENRES_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const file of fs.readdirSync(GENRES_DIR)) {
    if (file.endsWith(".md")) fs.unlinkSync(path.join(GENRES_DIR, file));
  }

  let imported = 0;
  let imagesOk = 0;

  for (const genre of genres.sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  )) {
    const slug = genre.slug;
    if (!slug) continue;

    const ext = getImageExt(genre.image_url);
    const imageFilename = `${slug}${ext}`;
    const localImage = `/images/music/${imageFilename}`;

    if (genre.image_url) {
      const ok = await downloadImage(genre.image_url, path.join(IMAGES_DIR, imageFilename));
      if (ok) imagesOk++;
      else console.warn(`  ⚠ Image failed: ${slug}`);
    }

    fs.writeFileSync(
      path.join(GENRES_DIR, `${slug}.md`),
      buildMarkdown(genre, localImage),
      "utf-8"
    );
    imported++;
    if (imported % 10 === 0) console.log(`  ${imported}/${genres.length}...`);
  }

  console.log(`\nDone! ${imported} articles, ${imagesOk} images downloaded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

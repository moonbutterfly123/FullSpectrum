#!/usr/bin/env node
/**
 * Import all birds from base44 Wiki-Bird API into local markdown + images.
 * Usage: node scripts/import-birds.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BIRDS_DIR = path.join(ROOT, "content", "birds");
const IMAGES_DIR = path.join(ROOT, "public", "images", "birds");
const API_URL =
  "https://base44.app/api/apps/6a688a6ddcd7ed2c8df4649b/entities/Bird";

const STATUS_TO_CODE = {
  "Least Concern": "LC",
  "Near Threatened": "NT",
  Vulnerable: "VU",
  Endangered: "EN",
  "Critically Endangered": "CR",
  "Extinct in the Wild": "EW",
  "Data Deficient": "DD",
};

function toConservationCode(status) {
  if (!status) return "LC";
  return STATUS_TO_CODE[status] ?? "LC";
}

function yamlString(value) {
  if (value == null) return '""';
  const str = String(value);
  if (str.includes("\n") || str.includes('"') || str.includes(":")) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str.includes(" ") ? `"${str}"` : str;
}

function buildMarkdown(bird, localImage) {
  const frontmatter = [
    "---",
    `title: ${yamlString(bird.common_name)}`,
    `scientificName: ${yamlString(bird.scientific_name)}`,
    `subtitle: ${yamlString(bird.summary)}`,
    `image: ${yamlString(localImage)}`,
    `imageAlt: ${yamlString(bird.image_alt || bird.common_name)}`,
    `conservationCode: ${toConservationCode(bird.conservation_status)}`,
    `conservationLabel: ${yamlString(bird.conservation_status || "Least Concern")}`,
    `order: ${yamlString(bird.taxonomic_order)}`,
    `family: ${yamlString(bird.family)}`,
    "stats:",
    `  wingspan: ${yamlString(bird.wingspan)}`,
    `  weight: ${yamlString(bird.weight)}`,
    `  lifespan: ${yamlString(bird.lifespan)}`,
    "regions:",
    ...(bird.regions || []).map((r) => `  - ${yamlString(r)}`),
    `habitat: ${yamlString(bird.habitat)}`,
    `displayOrder: ${bird.display_order ?? 999}`,
    `publishedAt: ${(bird.updated_date || bird.created_date || new Date().toISOString()).split("T")[0]}`,
    "---",
    "",
  ].join("\n");

  const sections = (bird.sections || [])
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
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
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
  console.log("Fetching birds from base44 API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const birds = await res.json();
  console.log(`Found ${birds.length} birds`);

  fs.mkdirSync(BIRDS_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // Clear old markdown (keep nothing from manual imports)
  for (const file of fs.readdirSync(BIRDS_DIR)) {
    if (file.endsWith(".md")) fs.unlinkSync(path.join(BIRDS_DIR, file));
  }

  let imported = 0;
  let imagesOk = 0;

  for (const bird of birds.sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  )) {
    const slug = bird.slug;
    if (!slug) continue;

    const ext = getImageExt(bird.image_url);
    const imageFilename = `${slug}${ext}`;
    const imagePath = path.join(IMAGES_DIR, imageFilename);
    const localImage = `/images/birds/${imageFilename}`;

    if (bird.image_url) {
      const ok = await downloadImage(bird.image_url, imagePath);
      if (ok) imagesOk++;
      else console.warn(`  ⚠ Image failed: ${slug}`);
    }

    const md = buildMarkdown(bird, localImage);
    fs.writeFileSync(path.join(BIRDS_DIR, `${slug}.md`), md, "utf-8");
    imported++;
    if (imported % 10 === 0) console.log(`  ${imported}/${birds.length}...`);
  }

  console.log(`\nDone! ${imported} articles, ${imagesOk} images downloaded.`);
  console.log(`Content: content/birds/`);
  console.log(`Images:  public/images/birds/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Import all fish from base44 OceanVibe API into local markdown + images.
 * Usage: node scripts/import-fish.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FISH_DIR = path.join(ROOT, "content", "fish");
const IMAGES_DIR = path.join(ROOT, "public", "images", "fish");
const API_URL =
  "https://base44.app/api/apps/6a6ec27728bcd4a67e2cc309/entities/Fish";

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

function buildMarkdown(fish, localImage) {
  const frontmatter = [
    "---",
    `title: ${yamlString(fish.common_name)}`,
    `scientificName: ${yamlString(fish.scientific_name)}`,
    `subtitle: ${yamlString(fish.summary)}`,
    `image: ${yamlString(localImage)}`,
    `imageAlt: ${yamlString(fish.image_alt || fish.common_name)}`,
    `conservationCode: ${toConservationCode(fish.conservation_status)}`,
    `conservationLabel: ${yamlString(fish.conservation_status || "Least Concern")}`,
    `order: ${yamlString(fish.taxonomic_order)}`,
    `family: ${yamlString(fish.family)}`,
    "stats:",
    `  maxLength: ${yamlString(fish.max_length)}`,
    `  weight: ${yamlString(fish.weight)}`,
    `  lifespan: ${yamlString(fish.lifespan)}`,
    "regions:",
    ...(fish.regions || []).map((r) => `  - ${yamlString(r)}`),
    `habitat: ${yamlString(fish.habitat)}`,
    `displayOrder: ${fish.display_order ?? 999}`,
    `publishedAt: ${(fish.updated_date || fish.created_date || new Date().toISOString()).split("T")[0]}`,
    "---",
    "",
  ].join("\n");

  const sections = (fish.sections || [])
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
  console.log("Fetching fish from base44 API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const fishList = await res.json();
  console.log(`Found ${fishList.length} fish`);

  fs.mkdirSync(FISH_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const file of fs.readdirSync(FISH_DIR)) {
    if (file.endsWith(".md")) fs.unlinkSync(path.join(FISH_DIR, file));
  }

  let imported = 0;
  let imagesOk = 0;

  for (const fish of fishList.sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  )) {
    const slug = fish.slug;
    if (!slug) continue;

    const ext = getImageExt(fish.image_url);
    const imageFilename = `${slug}${ext}`;
    const imagePath = path.join(IMAGES_DIR, imageFilename);
    const localImage = `/images/fish/${imageFilename}`;

    if (fish.image_url) {
      const ok = await downloadImage(fish.image_url, imagePath);
      if (ok) imagesOk++;
      else console.warn(`  ⚠ Image failed: ${slug}`);
    }

    const md = buildMarkdown(fish, localImage);
    fs.writeFileSync(path.join(FISH_DIR, `${slug}.md`), md, "utf-8");
    imported++;
    if (imported % 10 === 0) console.log(`  ${imported}/${fishList.length}...`);
  }

  console.log(`\nDone! ${imported} articles, ${imagesOk} images downloaded.`);
  console.log(`Content: content/fish/`);
  console.log(`Images:  public/images/fish/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

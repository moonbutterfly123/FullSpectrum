#!/usr/bin/env node
/**
 * Import AI agent articles from the public Agent / SonicMap blog API.
 * Usage: node scripts/import-agents.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const AGENTS_DIR = path.join(ROOT, "content", "agents");
const IMAGES_DIR = path.join(ROOT, "public", "images", "agents");
const API_URL =
  "https://base44.app/api/apps/6a97df21537013ff49c87f58/entities/AIArticle";

function yamlString(value) {
  if (value == null) return '""';
  const str = String(value);
  if (str.includes("\n") || str.includes('"') || str.includes(":")) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str.includes(" ") ? `"${str}"` : str;
}

function buildMarkdown(article, localImage) {
  const concepts = (article.key_concepts || []).slice(0, 4).join(" · ");
  const related = (article.related_agents || []).join(", ");

  const frontmatter = [
    "---",
    `title: ${yamlString(article.title)}`,
    `subtitle: ${yamlString(article.summary)}`,
    `image: ${yamlString(localImage)}`,
    `imageAlt: ${yamlString(article.image_alt || article.title)}`,
    `popularityTier: ${yamlString(article.difficulty || "Foundational")}`,
    `eraOrigin: ${yamlString(article.category || "")}`,
    `regionOrigin: ${yamlString(article.tagline || "")}`,
    `tempoBpm: ${yamlString(article.read_time || "")}`,
    `signatureSound: ${yamlString(article.tagline || "")}`,
    `culturalMovement: ${yamlString(article.category || "")}`,
    `accentColor: ${yamlString(article.accent_color || "#f59e0b")}`,
    "parentGenres:",
    ...(article.related_agents || []).map((g) => `  - ${yamlString(g)}`),
    "keyInstruments:",
    ...(article.key_concepts || []).map((i) => `  - ${yamlString(i)}`),
    "regions:",
    `  - ${yamlString(article.category || "Agents")}`,
    "stats:",
    `  era: ${yamlString(article.category || "")}`,
    `  origin: ${yamlString(article.tagline || "")}`,
    `  tempo: ${yamlString(article.read_time || "")}`,
    `  popularity: ${yamlString(article.difficulty || "")}`,
    `  roots: ${yamlString(related)}`,
    `  keyTools: ${yamlString(concepts)}`,
    `displayOrder: ${article.display_order ?? 999}`,
    `publishedAt: ${(article.updated_date || article.created_date || new Date().toISOString()).split("T")[0]}`,
    "---",
    "",
  ].join("\n");

  const sections = (article.sections || [])
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
  console.log("Fetching AI agent articles...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const articles = await res.json();
  console.log(`Found ${articles.length} articles`);

  fs.mkdirSync(AGENTS_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const file of fs.readdirSync(AGENTS_DIR)) {
    if (file.endsWith(".md")) fs.unlinkSync(path.join(AGENTS_DIR, file));
  }

  let imported = 0;
  let imagesOk = 0;

  for (const article of articles.sort(
    (a, b) => (a.display_order ?? 999) - (b.display_order ?? 999)
  )) {
    const slug = article.slug;
    if (!slug) continue;

    const ext = getImageExt(article.image_url);
    const imageFilename = `${slug}${ext}`;
    const localImage = `/images/agents/${imageFilename}`;

    if (article.image_url) {
      const ok = await downloadImage(
        article.image_url,
        path.join(IMAGES_DIR, imageFilename)
      );
      if (ok) imagesOk++;
      else console.warn(`  ⚠ Image failed: ${slug}`);
    }

    fs.writeFileSync(
      path.join(AGENTS_DIR, `${slug}.md`),
      buildMarkdown(article, localImage),
      "utf-8"
    );
    imported++;
    if (imported % 10 === 0) console.log(`  ${imported}/${articles.length}...`);
  }

  console.log(`\nDone! ${imported} articles, ${imagesOk} images downloaded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

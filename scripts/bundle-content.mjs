#!/usr/bin/env node
/**
 * Bundle markdown content into a static JSON asset for Cloudflare Workers.
 * Served from /data/content.json — not bundled into the Worker script.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "content.json");

const CATEGORIES = ["birds", "fish", "music"];

function bundleCategory(category) {
  const dir = path.join(CONTENT, category);
  const entries = {};

  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    entries[slug] = { data, content };
  }

  return entries;
}

const bundle = {};
for (const category of CATEGORIES) {
  bundle[category] = bundleCategory(category);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(bundle));

const counts = CATEGORIES.map((c) => `${c}: ${Object.keys(bundle[c]).length}`).join(", ");
console.log(`Bundled content → public/data/content.json (${counts})`);

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7f3eb"/>
      <stop offset="100%" stop-color="#e8d5c0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="72" y="120" fill="#9a4e2a" font-family="Georgia, serif" font-size="28" font-weight="600">readfullspectrum.com</text>
  <text x="72" y="280" fill="#1c1917" font-family="Georgia, serif" font-size="88" font-weight="700">Full Spectrum</text>
  <text x="72" y="360" fill="#57534e" font-family="Arial, sans-serif" font-size="30">Birds, fish, music, and natural history</text>
  <text x="72" y="560" fill="#78716c" font-family="Arial, sans-serif" font-size="24">300+ articles</text>
</svg>`;

const sharp = (await import("sharp")).default;
await sharp(Buffer.from(ogSvg)).png().toFile(path.join(ROOT, "public", "og-default.png"));
console.log("Generated public/og-default.png");

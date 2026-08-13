#!/usr/bin/env node
/**
 * Bundle markdown content into JSON for Cloudflare Workers (no runtime fs).
 * Runs automatically via npm prebuild.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");
const OUT_DIR = path.join(ROOT, "src", "generated");
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
console.log(`Bundled content → src/generated/content.json (${counts})`);

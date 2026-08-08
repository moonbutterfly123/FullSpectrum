#!/usr/bin/env node
/**
 * Technical SEO audit for markdown content and route coverage.
 * Usage: node scripts/seo-audit.mjs
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");

const issues = {
  missingImageAlt: [],
  missingImage: [],
  missingSubtitle: [],
  longDescriptions: [],
  markdownImages: [],
  externalLinks: [],
  multipleH1: [],
};

function auditFile(category, file) {
  const slug = file.replace(/\.md$/, "");
  const filePath = path.join(CONTENT, category, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const id = `${category}/${slug}`;

  if (!data.imageAlt || String(data.imageAlt).trim() === "") {
    issues.missingImageAlt.push(id);
  }
  if (!data.image || String(data.image).trim() === "") {
    issues.missingImage.push(id);
  }
  if (!data.subtitle || String(data.subtitle).trim() === "") {
    issues.missingSubtitle.push(id);
  }

  const subtitle = String(data.subtitle || "");
  if (subtitle.length > 160) {
    issues.longDescriptions.push({ id, length: subtitle.length });
  }

  if (/!\[[^\]]*\]\([^)]+\)/.test(content)) {
    issues.markdownImages.push(id);
  }

  const mdLinks = [...content.matchAll(/\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
  for (const [, anchor, url] of mdLinks) {
    if (!anchor.trim()) {
      issues.externalLinks.push({ id, url, problem: "missing anchor text" });
    }
  }

  const h1Count = (content.match(/^# /gm) || []).length;
  if (h1Count > 0) {
    issues.multipleH1.push({ id, count: h1Count });
  }
}

for (const category of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    auditFile(category, file);
  }
}

let totalArticles = 0;
for (const category of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, category);
  if (!fs.statSync(dir).isDirectory()) continue;
  totalArticles += fs.readdirSync(dir).filter((f) => f.endsWith(".md")).length;
}

console.log("TypeWiki SEO Audit");
console.log("==================");
console.log(`Articles scanned: ${totalArticles}`);
console.log(`Missing imageAlt: ${issues.missingImageAlt.length}`);
console.log(`Missing image: ${issues.missingImage.length}`);
console.log(`Missing subtitle: ${issues.missingSubtitle.length}`);
console.log(`Subtitles over 160 chars (auto-truncated at runtime): ${issues.longDescriptions.length}`);
console.log(`Markdown images in body: ${issues.markdownImages.length}`);
console.log(`External markdown links: ${issues.externalLinks.length}`);
console.log(`Markdown H1 tags in content: ${issues.multipleH1.length}`);

if (issues.longDescriptions.length > 0) {
  console.log("\nSample long subtitles (first 5):");
  for (const item of issues.longDescriptions.slice(0, 5)) {
    console.log(`  - ${item.id} (${item.length} chars)`);
  }
}

if (issues.markdownImages.length > 0) {
  console.log("\nMarkdown images found:");
  for (const id of issues.markdownImages) console.log(`  - ${id}`);
}

if (issues.externalLinks.length > 0) {
  console.log("\nExternal link issues:");
  for (const item of issues.externalLinks) {
    console.log(`  - ${item.id}: ${item.problem} (${item.url})`);
  }
}

console.log("\nNote: Article templates render exactly one <h1> per page. Body content uses ## section headings only.");

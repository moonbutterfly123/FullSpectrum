# TypeWiki

Multi-category encyclopedia (birds, fish, music). The **Birds** category hosts **The Wiki-Bird** at `/birds`.

## Quick Start

```bash
npm install
npm run dev
```

- **/** — TypeWiki homepage (pick a category)
- **/birds** — The Wiki-Bird homepage
- **/birds/collection** — All 100 species (grid)
- **/birds/[slug]** — Individual bird article

## Import Birds from base44

Re-sync all articles and images from your live site:

```bash
npm run import:birds
```

Source: `https://crouching-avian-archive-labs.base44.app/` via base44 API.

## Project Structure

```
content/birds/          # 100 markdown articles (imported)
public/images/birds/    # 100 local bird images (imported)
src/app/birds/          # Bird section routes
scripts/import-birds.mjs
```

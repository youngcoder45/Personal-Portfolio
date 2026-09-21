// @ts-check
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const NOTES_DIR = join(process.cwd(), 'src/content/notes');

function noteLastmods() {
  const map = new Map();
  for (const file of readdirSync(NOTES_DIR)) {
    if (!file.endsWith('.mdx')) continue;
    const raw = readFileSync(join(NOTES_DIR, file), 'utf8');
    const m = raw.match(/pubDate:\s*['"]?(\d{4}-\d{2}-\d{2})/);
    if (m) map.set(`/notes/${file.replace(/\.mdx$/, '')}/`, new Date(m[1]).toISOString());
  }
  return map;
}

// https://astro.build/config
export default defineConfig({
  site: 'https://aditya-verma.me',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      // Accurate lastmod only where a real date exists (notes have pubDate;
      // projects only carry a year and static pages have no meaningful date).
      serialize(item) {
        const lastmod = noteLastmods().get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
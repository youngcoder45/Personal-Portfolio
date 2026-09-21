# aditya-verma-portfolio

Terminal-flavoured personal portfolio for Aditya Verma, built with [Astro](https://astro.build) and vanilla TypeScript. Static, no framework, no client runtime except the shell/theme scripts.

## Tech

- Astro 5 (static output) + MDX + RSS + sitemap
- Vanilla TS for the terminal, command palette and theme switcher
- 14 themes, OSC 10/11/52 terminal escape support
- OG image generated at build time (`scripts/generate-og.mjs`, requires sharp)

## Getting started

```sh
npm install
npm run dev      # start dev server
npm run build    # regenerate og.png, then build to dist/
npm run preview  # serve the production build
npm run check    # astro check (tsc)
```

## Deploy

Netlify: build `npm run build`, publish `dist`. `netlify.toml` sets security headers/CSP and long-lived caching for `/_astro/*` assets.

## Structure

```
src/
  components/    layout, terminal, palette, topbar/footer
  content/       notes + projects (MDX collections)
  data/          search index, themes
  lib/           profile/identity data
  pages/         routes
  scripts/       client-side TS
  styles/        global.css (tokens, themes, terminal)
scripts/         build-time tooling (og image generator)
public/          static assets (me.png, og.png, robots, llms.txt)
```
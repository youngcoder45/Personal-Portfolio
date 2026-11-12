# Akoder research

> Reference study of `https://akoder.xyz` and its public source repository.
> This is a design and engineering reference, not a template to clone.

- **Live site:** https://akoder.xyz/
- **Repository:** https://github.com/AdityaKodez/adityaojha
- **Revision inspected:** `3942a9c` — 2026-11-09
- **Licence:** MIT (Copyright 2026 Aditya Ojha)
- **Research date:** 2026-11-12
- **Method:** rendered-site inspection plus static reading of the cloned repository at `/tmp/opencode/akoder-repo`. No runtime profiling, screen-reader pass, or asset reuse was performed.

## 1. Why this reference matters

Akoder is not valuable because it uses Next.js or because it has a large component
library. It is valuable because it treats a portfolio as an **editorial product**:
a small number of deliberate sections, strong typographic rhythm, configurable
content, and interactions that reward curiosity without blocking the content.

The current portfolio already has a stronger technical identity than Akoder
(terminal, man page, simulated Linux shell). The useful move is therefore not
"become Akoder". It is to apply Akoder's **systems thinking** — configuration,
section rhythm, progressive disclosure, accessible motion — to the existing
terminal/editorial voice.

## 2. Stack and architecture

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 App Router | Server components by default; client islands only where interaction is needed |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix, Base UI | Heavy component surface, but mostly composed from primitives |
| Motion | `motion` (Motion for React), Matter.js | Spring-based micro-interactions; physics only in the registry skill cloud |
| Command palette | `cmdk` | Lazy-mounted, grouped, drill-down pages, recent items |
| Content | Config modules + MDX + `gray-matter` | Homepage is assembled from typed config, not hard-coded JSX |
| Analytics | PostHog + Vercel Analytics | Product-style event tracking, including dead-click detection |
| Fonts | Geist | Self-hosted through the `geist` package |
| Registry | `registry.json` + build script + static JSON | 23 installable shadcn registry items |

### Routing

Observed routes:

- `/` — config-driven homepage
- `/project/[id]` — case study pages
- `/components`, `/components/[id]` — component registry and previews
- `/testimonials`, `/sponsor`, `/sponsor/claim`
- `/llms.txt`, `/llms-full.txt`, sitemap, robots, Open Graph image routes
- API routes for Discord status, component suggestions, sponsor checkout/claim, and Dodo webhooks

### Config-driven homepage

`config/site.ts` defines:

```ts
sectionOrder: [
  "projects", "socials", "components", "skills", "about", "sponsors",
  "github", "testimonials", "bookshelf", "bookmarks", "certifications",
]
```

`sectionFlags` independently enables or disables every section. `app/page.tsx`
filters the order by the flags, maps each id to a server-rendered component, and
conditionally mounts the GitHub section only when `GITHUB_TOKEN` exists. This is
the single most transferable idea in the repository: **the homepage is data, not
a wall of bespoke markup**.

Each section can also receive a `SideNote` and an optional seasonal scene. The
result is a page that can be re-ordered or trimmed without touching layout code.

## 3. Design language

Akoder's visual identity is "paper-cut editorial", not "developer terminal".

### Typography

- Compact, confident headings with a serif italic accent word.
- Mono labels for metadata and section numbering.
- Generous line height in prose, tight leading in headings.
- Lowercase, conversational section titles rather than corporate headings.

### Structure

- A bounded content frame with visible side gutters.
- Dashed horizontal rules between list rows and sections.
- Section headings that read like index entries, not marketing banners.
- Numbered categories (`01`, `02`, ...) used as navigation texture.
- Side notes placed in the margin on wide screens, folded into the flow on narrow screens.

### Surface and illustration

- Near-monochrome base with one accent colour per theme.
- Paper-cutout illustrations with hard edges and subtle texture.
- Small custom SVG stickers and pixel-dissolve transitions.
- Rich hover previews (project images) rather than always-on media.
- Tactile details: uneven "paper edge" polygons, dotted textures, small rotations.

### Motion

- Springs rather than linear transitions.
- Motion is concentrated in navigation, hover previews, and reveal transitions.
- `prefers-reduced-motion` is handled explicitly in components, not only in a global reset.
- Pointer capability is queried (`hover: hover` and `pointer: fine`) before enabling cursor-follow previews.

## 4. Interaction inventory

| Pattern | What it does | Engineering detail | Relevance to this portfolio |
| --- | --- | --- | --- |
| Section rail | Fixed left rail of dashes; active section tracked on scroll | `IntersectionObserver` with a centre band; spring waveform on the active dash; rich tooltips; link items supported | High — adapt as a terminal "process rail" or file-descriptor rail |
| Project explorer | Year folders, collapsible groups, status badges, hover previews | Groups by year; keyboard accessible; image preview follows cursor only on fine pointers; reduced-motion aware | High — adapt to filesystem tree with category filters |
| Command palette | `⌘/Ctrl+K` launcher with grouped actions and drill-down pages | Lazy-mounted, multi-token filtering, recent items in `localStorage`, mobile gate, roving selection | High — existing palette can gain drill-down pages, recents, and project actions |
| Skill chips | Static labelled chips grouped by category | Deliberately non-interactive; comment explains dead-click analytics | Medium — existing manifest is richer; do not downgrade it |
| Bookshelf | Horizontal shelf of books with hover detail | Content lives in `config/books.ts`; enabled/disabled per book | Medium — only if real reading data exists |
| GitHub activity | Contribution calendar with keyboard navigation | Server-fetched data, client calendar, arrow-key movement, scroll containment | High — but must have a no-token fallback and honest empty state |
| Ask AI | Floating assistant with suggested prompts | Client UI + API route; product-specific | Low — out of scope, adds cost and maintenance |
| Copy command blocks | One-click install commands with status feedback | Small client component around static code | Medium — useful for project setup commands |
| Theme switcher | Multiple themes with keyboard shortcut | Theme provider, persisted preference, optional switch sound | Medium — portfolio already has 14 themes; no audio needed |
| Page transitions | Pixel-dissolve / fade between routes | Client transition layer | Medium — only if it does not delay navigation |
| Visitor counter | Odometer-style public counter | External service | Reject — vanity metric, privacy cost |
| Sponsors / testimonials | Commercial proof sections | Config-driven cards | Reject — no real content to support them |

## 5. Component deep dives

### 5.1 Section rail (`components/section-rail.tsx`, 302 lines)

- Accepts `items` with `id`, `label`, optional `href`, and optional rich `card`.
- Tracks every target inside a centre band and chooses the one closest to the
  band centre, which is deterministic when several short sections intersect.
- Supports a viewport variant and a contained-scroll variant.
- The active dash uses a spring `scaleX` waveform; neighbouring dashes step down
  in size (`1`, `44/56`, `36/56`, `28/56`).
- Reduced motion jumps the spring instead of animating it.
- `HomeSectionRail` wraps it with analytics; the generic rail stays reusable.

**Transferable lesson:** tracking logic should be one small, well-tested module;
the visual rail should be replaceable without rewriting scroll behaviour.

### 5.2 Project explorer (`components/project-explorer.tsx`, 551 lines)

- Receives a deliberately narrow `ProjectExplorerItem` type from the server so
  case-study content and metrics never cross the client boundary.
- Groups by year, supports collapse/expand, status badges, and optional images.
- Uses a `useSyncExternalStore` media-query subscription for hover capability.
- Preview follows the pointer with springs and is disabled for coarse pointers.
- Uses `AnimatePresence` for mount/unmount and respects reduced motion.
- Sample data lives beside the component for standalone registry use.

**Transferable lesson:** define the smallest client-side view model; keep the
content layer on the server. The explorer should be usable with keyboard only.

### 5.3 Command palette (`components/ui/command-palette.tsx`, 622 lines)

- Root groups plus drill-down `pages` (for example, a theme page).
- Global `⌘/Ctrl+K`; configurable hotkey; mobile disable gate.
- Recent items persisted under a namespaced `localStorage` key.
- Multi-token filtering and grouped result rendering.
- Back navigation inside the palette via `ArrowLeft` and a visible back affordance.
- Lazy-mounted so the closed palette costs nothing on first paint.

**Transferable lesson:** a palette is a navigation system, not just a search box.
Recents and drill-down pages are higher-value than fuzzy matching alone.

### 5.4 GitHub activity (`components/landing/github-activity.tsx`, 222 lines)

- Server component fetches and shapes a calendar; client component renders it.
- Calendar cells are buttons with arrow-key navigation and explicit labels.
- Scrolling is contained to the calendar so keyboard focus does not shift the page.
- Missing data is represented honestly (`null` count, "unavailable" copy).
- The entire section is omitted when no token is configured.

**Transferable lesson:** live data must be optional, cached at build time, and
degraded gracefully. Do not make a portfolio build depend on a secret.

### 5.5 Bookshelf and side notes

- `config/books.ts` owns the reading list; the component only renders enabled books.
- `SideNote` adds margin commentary on wide screens and reflows on narrow screens.
- Both are content-first: no invented social proof, no fake activity.

## 6. Engineering patterns worth adopting

1. **Typed config as content API.** Sections, projects, skills, books, and socials
   are data modules with explicit types. Layout code stays stable.
2. **Narrow client boundaries.** Server-rendered content is mapped to small view
   models before crossing into interactive components.
3. **Progressive enhancement.** Core content is visible without JavaScript;
   `no-js-visible` styles neutralise reveal animations when scripting is absent.
4. **Capability queries, not device guesses.** Hover previews key off
   `(hover: hover) and (pointer: fine)`, not screen width.
5. **Reduced motion is a component concern.** Springs and transitions check the
   media query and jump to the final state.
6. **Registry thinking.** Components are documented, versioned, and installable;
   the site doubles as a reusable system.
7. **Small, honest empty states.** Missing GitHub data is labelled, not faked.

## 7. Performance and accessibility observations

### Strengths

- Server components keep most content out of the client bundle.
- The command palette and heavy interactive pieces are lazy-mounted.
- Images use `next/image` with explicit dimensions.
- Keyboard navigation exists for the palette, rail, explorer, and contribution calendar.
- Reduced-motion handling is present in the interactive components inspected.
- Content is readable without JavaScript.

### Costs and cautions

- The dependency surface is large (Radix, Base UI, Motion, Matter.js, cmdk,
  analytics, icons, Tiptap). Most of it is irrelevant to a static portfolio.
- Several sections are commercial or product-specific (sponsors, testimonials,
  Ask AI, visitor counter) and would be empty or fabricated on another site.
- Analytics and haptics add privacy and maintenance overhead.
- The page relies on many client islands; a static Astro page can deliver the
  same perceived interactivity with far less JavaScript.
- The visual language is strongly tied to paper-cut illustrations and would look
  derivative if copied without new artwork.

## 8. What to borrow, adapt, and reject

### Borrow

- Config-driven section order and flags.
- Section rail with centre-band tracking and reduced-motion support.
- Project explorer with year/category grouping and keyboard access.
- Command palette recents and drill-down pages.
- Build-time GitHub data with a no-token fallback.
- Capability-based hover previews.
- Honest empty states and no-JS resilience.

### Adapt to the terminal identity

- Rail becomes a vertical "process table" or file-descriptor rail, not paper dashes.
- Project explorer becomes a filesystem tree (`~/projects/<category>/<year>/`).
- Palette becomes a shell command launcher with man-page style help.
- Section rhythm uses existing window chrome, man-page rules, and mono labels.
- Motion uses cursor blink, scanline sweep, and type-on reveals instead of paper dissolves.

### Reject

- Next.js/React migration. Astro already ships less JavaScript for this use case.
- Matter.js physics, Tiptap, analytics SDKs, haptics, visitor counters.
- Sponsors, testimonials, pricing, and Ask AI without real content or a clear need.
- Theme switch audio and decorative seasonal scenes.
- Copying illustrations, copy, or exact layouts.

## 9. Translation to the current Astro codebase

| Akoder pattern | Astro implementation sketch | New dependency |
| --- | --- | --- |
| Config-driven sections | `src/data/sections.ts` exporting ordered ids and flags; `index.astro` maps ids to components | None |
| Section rail | `src/components/SectionRail.astro` + `src/scripts/rail.ts`; `IntersectionObserver` | None |
| Project explorer | `src/components/ProjectExplorer.astro`; server-rendered groups; small filter script | None |
| Palette recents/pages | Extend `src/scripts/palette.ts` and `src/data/search.ts` | None |
| GitHub activity | `src/lib/github.ts` build-time fetch; static SVG/HTML calendar; optional token | None |
| Bookshelf | MDX or typed data file; only if real books exist | None |
| Page transitions | Astro View Transitions or a CSS-only fade with reduced-motion guard | None (built in) |
| Copy command | Small `copy.ts` script using `navigator.clipboard` | None |

## 10. Conclusion

Akoder's advantage is coherence: content, layout, motion, and configuration all
serve one editorial idea. Its stack is not the lesson. For this portfolio, the
highest-value borrowings are the **section rail**, **project explorer**,
**palette depth**, **build-time GitHub data with fallbacks**, and the discipline
of **typed content configuration**. All of these can be implemented in Astro,
TypeScript, vanilla CSS, and MDX without adding runtime dependencies.

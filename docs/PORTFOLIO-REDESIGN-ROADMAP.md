# Portfolio redesign roadmap

> From a strong terminal-themed site to a premium, interactive engineering
> portfolio. This document is the implementation contract: scope, sequence,
> acceptance criteria, and the questions that must be answered before code moves.

- **Status:** Phase 3 complete; pre-Phase-4 additions complete; Phase 4 in progress
- **Phase 0 completed:** 2026-11-12
- **Phase 1 completed:** 2026-11-12
- **Phase 2 completed:** 2026-11-12
- **Phase 3 completed:** 2026-11-13
- **Companion documents:** `docs/AKODER-RESEARCH.md`, `docs/PORTFOLIO-ARCHITECTURE.md`
- **Constraint:** implement one phase at a time; verify before moving on
- **Stack:** Astro 5, TypeScript, vanilla CSS, MDX, Netlify — unchanged

## 1. Goal

Make the portfolio feel **engineered, not decorated**.

The site already has a distinct identity: a terminal that boots, a man page that
explains a person, a toolchain manifest, and a shell palette. The redesign should
deepen that identity with better navigation, richer project discovery, honest
data, and a few memorable interactions — without turning the site into a React
clone of someone else's paper-cut aesthetic.

### Success looks like

- A first-time visitor understands who Aditya is and what he builds within one screen.
- A technical visitor can explore projects by category, year, and status without leaving the page.
- A recruiter can reach a project, a note, or contact details in two interactions.
- Every section is reachable by keyboard and readable with JavaScript disabled.
- The site stays static, fast, and deployable on Netlify.
- No claim on the site is unverified or contradicted elsewhere on the site.

### Non-goals

- Migrating to Next.js, React, or a component library.
- Adding analytics, tracking, haptics, or a visitor counter.
- Inventing testimonials, sponsors, metrics, reading lists, or GitHub activity.
- Copying Akoder's illustrations, copy, or exact layout.
- Adding a blog CMS or database.
- Rewriting verified content for the sake of novelty.

## 2. Design direction: "terminal editorial"

The current site is a terminal. Akoder is an editorial product. The redesign
combines the two: **terminal mechanics, editorial restraint**.

### Principles

1. **Truth before decoration.** Fix claims, counts, and dates before adding effects.
2. **One signature per section.** Each section gets one memorable interaction, not five.
3. **Progressive disclosure.** Summary first; detail on hover, focus, or expansion.
4. **Static by default.** Interactivity is a small client layer over server-rendered HTML.
5. **Motion is feedback.** No animation without a state change or spatial relationship.
6. **Theme parity.** Every feature must work in all 14 themes, especially light ones.
7. **Keyboard is a first-class pointer.** Every hover preview has a focus equivalent.
8. **No dependency without a measured win.** Prefer platform APIs.

### Visual language

- Keep: mono labels, window chrome, dashed rules, man-page typography, prompt glyphs.
- Strengthen: vertical rhythm, section numbering, margin notes, status lines.
- Add sparingly: a left process rail, a filesystem project tree, a build/status strip.
- Avoid: glassmorphism, gradient blobs, generic SaaS cards, stock illustrations,
  scroll-jacking, cursor effects that fight the pointer.

### Signature moments

| Moment | Description |
| --- | --- |
| Boot | Existing boot splash, shortened and skippable; remembered per session |
| Process rail | Left-side section rail styled as process/file descriptors, with active tracking |
| Project tree | `/projects` as a filesystem tree with category/year/status filters |
| Shell palette | `⌘K` palette with recents, drill-down pages, and actions |
| Toolchain | Skill manifest becomes a filterable dependency table, not a physics toy |
| Telemetry | Build-time GitHub activity with an honest fallback when unavailable |

## 3. Priority model

| Priority | Meaning | Rule |
| --- | --- | --- |
| **P0** | Integrity and foundations | Must ship before visual redesign |
| **P1** | Navigation and discovery | Core premium experience |
| **P2** | Signature interactions | Differentiators, added one at a time |
| **P3** | Polish and scale | Refinement after the core is stable |

## 4. Phase plan

### Phase 0 — Truth pass and foundations (P0) — **complete**

**Objective:** remove credibility risks and make the build reproducible before
adding features.

Tasks:

1. **Content audit with the owner.** Confirm or correct:
   - Actual repository count and write-up count.
   - Whether project stars are manual or fetched.
   - Education dates and current year.
   - `systemd / Dynamod (custom)` claim.
   - AUR maintainer status and dates.
   - Discord invite, email, social handles.
2. **Remove false precision.** Replace "47 repos" with a derived count or a
   non-numeric statement. Replace the "stars rounded at build time" note with
   the truth, or implement the fetch in Phase 4.
3. **Declare build dependencies.** Add `sharp` as a dev dependency if the OG
   generator stays, or make the generator fail loudly instead of silently
   keeping a stale image.
4. **Stabilise the build badge.** Read the commit from an environment variable
   with a safe fallback, rather than shelling out to `git` during render.
5. **Add a verification script.** `npm run verify` = `check` + `build` +
   internal link audit. Run it before every phase close.
6. **Baseline accessibility pass.** Keyboard-only walkthrough, focus visibility,
   heading order, landmark review, contrast check in light themes.
7. **Decide content data ownership.** Document which fields are authored,
   derived at build time, or optional.

**Files:** `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`,
`src/pages/about.astro`, `src/lib/profile.ts`, `package.json`,
`scripts/generate-og.mjs`, `src/components/TopBar.astro`, `netlify.toml`.

**Acceptance criteria:**

- No numeric claim on the site is unverified.
- No page contradicts another page about dates, roles, or stars.
- `npm run verify` passes from a clean checkout.
- Keyboard focus is visible on every interactive element in every theme.
- The build succeeds without a git repository present.

**Effort:** S–M. **Blocks:** all later phases.

**Outcome (2026-11-12):**

- Replaced “47 repos” with **52 public repos · 9 write-ups**; write-up count is derived.
- Replaced the false build-time star claim with a manual-curation label.
- Updated AUR to **Jan 2026 — present**; kept Dynamod after owner confirmation.
- Confirmed education dates **2026 — 2030** and current year 2026.
- Removed `git rev-parse`; commit comes from hosting environment variables.
- Declared `sharp`, made OG generation fail loudly, and skipped identical writes.
- Added `npm run check:links` and `npm run verify`.
- Added a skip link and focusable `#main-content`.
- Verified: `astro check` 0/0/0, 18 pages, 289 local references with no missing targets.

---

### Phase 1 — Section system and navigation rail (P1) — **complete**

**Objective:** make the homepage feel composed and navigable, not like a stack of
independent blocks.

Tasks:

1. **Create `src/data/sections.ts`.**
   - Ordered section ids, labels, paths, and enabled flags.
   - `index.astro` maps ids to section components.
   - Keep the current order as the default.
2. **Build `SectionRail.astro` + `src/scripts/rail.ts`.**
   - Fixed rail on wide screens; hidden or compact on small screens.
   - `IntersectionObserver` centre-band tracking.
   - Active state, hover label, keyboard-focusable links.
   - Styled as process/file descriptors, not paper dashes.
   - Reduced-motion: no spring waveform, instant state change.
3. **Add a mobile section index.**
   - A compact "sections" disclosure in the top bar or below the hero.
   - Must not duplicate the entire nav.
4. **Add reading progress to long pages.**
   - `/about`, project detail, and note detail.
   - CSS-only where possible; no layout shift.
5. **Fix nav semantics.**
   - Separate route links from in-page anchors.
   - Correct `aria-current` for both.
6. **Add a skip link and verify landmark structure.**

**Files:** new `src/data/sections.ts`, new `SectionRail.astro`,
new `src/scripts/rail.ts`, `src/components/Layout.astro`,
`src/components/TopBar.astro`, `src/pages/index.astro`, `global.css`.

**Acceptance criteria:**

- Rail tracks sections accurately at 1440, 1024, 768, and 390 px.
- Rail links work with keyboard and screen readers.
- Reduced-motion users see no animated waveform.
- No horizontal scroll at any breakpoint.
- Homepage section order is editable in one file.
- Existing anchor links (`/#projects`, etc.) still work.

**Effort:** M. **Depends on:** Phase 0.

**Outcome (2026-11-12):**

- `src/data/sections.ts` is the single source of truth for order, labels, paths,
  and enabled flags; `index.astro` maps it to `src/components/home/*`.
- `SectionRail.astro` + `scripts/rail.ts` track sections with a narrow centre
  band, set `aria-current="location"`, and sync the top-nav anchors.
- `MobileSectionIndex.astro` replaces the rail below `1240px`.
- `ReadingProgress.astro` + `scripts/progress.ts` run on `/about`, project
  detail, and note detail pages without layout shift.
- Nav items are typed as `route` or `anchor`; route matching is exact-or-child.
- Verified: 0/0/0 diagnostics, 18 pages, 303 local references, 42/42 browser
  interaction checks, no horizontal overflow at 1440/1240/1024/768/390, rail
  contrast ≥ 11:1 in all themes, reduced motion respected.

---

### Phase 2 — Project explorer and discovery (P1) — **complete**

**Objective:** turn `/projects` from a static card list into the best page on the
site for evaluating Aditya's work.

Tasks:

1. **Build `ProjectExplorer.astro`.**
   - Server-render all projects for no-JS and SEO.
   - Group by year or category with collapsible sections.
   - Filters: category, year, status, featured.
   - Show a live result count derived from content.
   - Preserve filter state in the URL (`?category=systems&year=2025`).
   - Reset control and empty state.
2. **Upgrade project cards.**
   - Status badge, language, year, stars (only if true), stack chips.
   - Clear primary action: read write-up or open repo.
   - Hover preview only on fine pointers; focus equivalent on keyboard.
3. **Improve project detail pages.**
   - Sticky metadata sidebar on wide screens.
   - Copy `git clone` command with feedback.
   - Related projects derived from shared tags/category.
   - "Back to projects" preserves the previous filter state.
4. **Homepage project section.**
   - Show 3–4 featured projects, not all.
   - Link to the explorer with a clear affordance.

**Files:** new `ProjectExplorer.astro`, new small script,
`src/pages/projects/index.astro`, `src/components/ProjectCard.astro`,
`src/pages/projects/[slug].astro`, `src/pages/index.astro`, `global.css`.

**Acceptance criteria:**

- All projects are present in the HTML before JavaScript runs.
- Filters work without JavaScript as links or a form fallback, or the page
  clearly degrades to the full list.
- Filter state survives reload and back navigation.
- Keyboard users can operate every filter and card.
- No fabricated star counts; if stars are manual, label them as such.
- Mobile layout remains scannable without hover.

**Effort:** M–L. **Depends on:** Phase 0; benefits from Phase 1.

**Outcome (2026-11-12):**

- `src/lib/projects.ts` centralises deterministic ordering (stars, then title),
  facet counts from real content, year grouping, related-project scoring, and the
  `git clone` command.
- `ProjectExplorer.astro` server-renders every project inside collapsible year
  groups, so the full list works without JavaScript. Filters for category, year,
  status, and featured are buttons with `aria-pressed`; a live count and query
  readout report the current view.
- `scripts/explorer.ts` hides non-matching cards, opens year groups that contain
  matches, updates the URL with `history.replaceState`, handles `popstate`, and
  stores the active filter set in `sessionStorage` (`av-projects-filter`).
  Unknown URL values are ignored rather than showing a blank page.
- `ProjectCard.astro` adds status badges, language, year, curated star counts,
  stack chips, a clear “read write-up” action, and a repo/live link. Hover lift is
  limited to fine pointers; keyboard focus gets the same border treatment.
- Detail pages gain a sticky metadata sidebar above `1080px`, a copyable
  `git clone` command with visible and announced feedback, related projects
  derived from shared tags/category (language only breaks ties), and back links
  that restore the last filtered explorer view.
- The homepage shows the four featured projects and links to the explorer. Five
  projects were de-featured so “featured” means something.
- Retro theme tokens were darkened (`--fg-dim`, `--green`, `--amber`) to clear
  4.5:1 for small text; the primary card action now uses `--fg-strong` with an
  accent underline so it stays readable in every theme.
- Verified: 0/0/0 diagnostics, 18 pages, 312 local references, 62/62 browser
  interaction checks, 42/42 Phase 1 checks still passing, no horizontal overflow
  at 1440/1024/768/390, filter/back-restore/no-JS/keyboard/reduced-motion paths
  all exercised. Primary card action contrast ≥ 9.68:1 in all 14 themes.

---

### Phase 3 — Command palette depth (P1) — **complete**

**Objective:** make the palette the fastest route through the whole site.

Tasks:

1. **Add recent items.**
   - Namespaced `localStorage` key (`av-palette-recents`).
   - Cap at 5; clear control.
2. **Add drill-down pages.**
   - Themes page, projects page, notes page, actions page.
   - `ArrowLeft` returns to the root; visible back affordance.
3. **Expand search index.**
   - Projects by title, stack, tags, category, year.
   - Notes by title, tags, description.
   - Actions: copy URL, open RSS, view source, toggle theme.
4. **Improve matching.**
   - Multi-token matching (all tokens must match).
   - Highlight matched characters.
   - Stable ordering: exact > prefix > substring > fuzzy.
5. **Keyboard and mobile behaviour.**
   - Roving selection with `aria-activedescendant`.
   - Mobile: full-screen sheet or clearly disabled trigger, not a broken overlay.
   - Focus trap and restore.
6. **No-JS fallback.**
   - The trigger can link to `/projects` or a static search page if the script
     fails; do not leave a dead button.

**Files:** `src/scripts/palette.ts`, `src/data/search.ts`,
`src/components/Layout.astro`, `src/components/TopBar.astro`, `global.css`.

**Acceptance criteria:**

- `⌘K` and `Ctrl+K` open the palette; `Esc` closes it and restores focus.
- Recents persist and can be cleared.
- Every result is reachable by keyboard only.
- Screen readers announce the result count and active option.
- No console errors when content is empty.
- Palette JavaScript stays under a defined budget (target: +3 kB gzip).

**Effort:** M. **Depends on:** Phase 0.

**Outcome (2026-11-13):**

- `src/scripts/palette.ts` gained persistent recents (`av-palette-recents`, cap 5,
  most-recent-first, deduped) rendered as a leading “Recent” group on empty query,
  plus a footer clear control.
- Palette actions expanded: “Open RSS feed” and “Toggle theme” joined “View
  Source”, “Copy page URL”, and “Open GitHub”. Theme cycling reuses the exported
  `apply` from `scripts/theme.ts`.
- Matching upgraded to multi-token (all tokens must match) with relevance tiers
  (exact > prefix > substring > fuzzy), keyword haystack (stack/tags/category/
  language from the embedded content index), and character highlighting.
- Added a polite live region (`#cmd-palette-status`) announcing the result count.
- Added a visible back affordance (`← back` footer button and `←` key) that
  returns to the site root from drill-down context.
- `TopBar.astro` gained a no-JS fallback: the palette toggle links to
  `/projects/` when the module bundle is unavailable.

**Verification (2026-11-13):**

- `npm run verify`: 0/0/0 diagnostics, 18 pages, 312 local references, clean build.
- Firefox WebDriver interaction suite (`/tmp/opencode/wd-phase3.mjs`):
  **15/15 checks passed**.

  - Palette opens via toggle with focus; typing narrows with highlights and a
    live count; multi-token queries work; empty result sets announce zero.
  - Selecting a result persists a recent; Recent group renders and clears.
  - Back affordance returns to the root; toggle-theme action cycles the theme.
  - Mobile palette renders as a full-screen sheet without overflow.
- Palette bundle: 4.50 kB gzip (was 3.76 kB) → **+0.74 kB**, within the +3 kB
  Phase 3 budget.

---

### Phase 4 — GitHub telemetry with honest fallback (P2, optional) — **next gate**

### Pre-Phase-4 additions (2026-11-13) — **complete**

Three small features requested immediately before Phase 4, shipped ahead of it:

1. **Footer star count** — the footer's “star this repo” link now shows the
   star count of the site's own source repo
   (`github.com/youngcoder45/Personal-Portfolio`) directly next to the label:
   `★ 5 · star this repo`, with an `as of November 2026` tooltip. The count was
   read from the public GitHub API on 2026-11-13 and authored as
   `githubStats.repoStars` in `src/lib/profile.ts`; Phase 4 replaces it with a
   build-time fetch.
2. **Palette Links group** — the command palette gained a “Links” group with
   all 15 profiles: the eight existing socials (GitHub, LinkedIn, Instagram, X,
   Mastodon, ORCID, org, email) plus Dev.to, daily.dev, Peerlist, Bluesky,
   Medium, Hashnode, and Kaggle. The full list lives in `paletteLinks` in
   `src/lib/profile.ts` (extras in `extraLinks`); the contact section keeps
   rendering `socials` unchanged. Group order is now Recent → Pages → Notes →
   Projects → Links → Actions. Two new icons (`link`, `mail`) were added to
   the palette icon map; GitHub items keep the GitHub mark and email uses the
   mail icon.
3. **Live-site hover preview** — hovering the “live ↗” link on a project card
   floats a cursor-following, terminal-styled preview card (window chrome with
   the site's domain and a “live” badge, project title, blurb, up to four
   stack chips, and an “opens in a new tab” footer). Implemented in
   `src/scripts/preview.ts`, reading the card's own server-rendered data — no
   screenshots and no third-party services (the demo host sends
   `x-frame-options: DENY`, so embedding the real site is impossible, and the
   card is an honest summary instead). Mouse pointers only (`pointerType:
   'mouse'`), `pointer-events: none` so it never intercepts clicks, hides on
   pointer leave, scroll, or Escape, and stays clamped inside the viewport.

**Verification:** `npm run verify` clean (0/0/0, 18 pages, 312 local refs);
Firefox WebDriver suite `/tmp/opencode/wd-pre4.mjs` **11/11 passed** (footer
count + tooltip, Links group contents/hrefs/icons/keyword search, preview
appear/follow/clamp/hide/passthrough). Layout bundle 5.32 kB gzip
(+0.82 kB for the preview module).

---

**Objective:** show real activity and project metadata without making the build
depend on a secret or fabricating data.

Tasks:

1. **Build-time fetch module `src/lib/github.ts`.**
   - Optional `GITHUB_TOKEN` from environment.
   - Fetch contribution calendar and repository metadata.
   - Cache the normalised result in a committed or build-cached JSON file.
   - Timeout and error handling; never fail the build on a network error.
2. **Contribution calendar component.**
   - Server-rendered grid with accessible labels.
   - Keyboard arrow navigation and a selected-day readout.
   - Honest "activity unavailable" state.
   - No third-party embed, no client-side token.
3. **Repository stats.**
   - Use fetched stars only if the fetch succeeds; otherwise show authored values
     with a label.
   - Never mix fetched and manual values without indicating the source.
4. **Privacy and configuration.**
   - Document the token in `.env.example` and Netlify settings.
   - The section is omitted when no token is configured.
5. **Decide whether to show the graph at all.** It is optional; if it adds more
   maintenance than signal, skip it.

**Files:** new `src/lib/github.ts`, new `GitHubActivity.astro` or
`GitHubSection.astro`, `.env.example`, `netlify.toml` (only if needed),
project pages, `docs/`.

**Acceptance criteria:**

- Build succeeds with no token and with an invalid token.
- Missing data renders an explicit fallback, not zeros.
- Calendar is keyboard navigable and screen-reader labelled.
- No token is exposed to the client.
- The section can be disabled in one place.
- Fetch failures are logged clearly during build.

**Effort:** M. **Depends on:** Phase 0; coordinate with Phase 2 if stars are fetched.

---

### Phase 5 — Toolchain and skill visualisation (P2)

**Objective:** make the strongest content section (the manifest) more explorable
without turning it into a toy.

Tasks:

1. **Add filtering and grouping.**
   - Filter by level, group, or search term.
   - Keep the existing honest proficiency tags.
   - Show counts derived from `skills.ts`.
2. **Add a second view.**
   - Table view (default) and a compact "dependency graph" or "process table".
   - The graph must be readable as text and keyboard accessible; no physics engine.
3. **Connect skills to evidence.**
   - Link a skill to projects that use it, derived from project `stack`/`tags`.
   - Do not claim a skill is used by a project unless the data says so.
4. **Preserve the manifest aesthetic.**
   - Monospace, dotted leaders, level tags, paths.

**Files:** `src/data/skills.ts`, `src/pages/index.astro`,
new `Toolchain.astro` or inline section, `global.css`.

**Acceptance criteria:**

- Filtering works with keyboard and without hover.
- Every skill remains visible in the no-JS view.
- Skill-to-project links resolve to real projects.
- No canvas-only content; text alternative exists.
- Light themes remain legible.

**Effort:** M. **Depends on:** Phase 2 (for skill-to-project links).

---

### Phase 5b — Bookshelf (P2)

**Objective:** add a real reading shelf using the six books confirmed by the owner,
without inventing ratings, progress, or reviews.

Confirmed books:

- *Atomic Habits* — James Clear
- *The Power of Your Subconscious Mind* — Joseph Murphy
- *Think and Grow Rich* — Napoleon Hill
- *To Kill a Mockingbird* — Harper Lee
- *The Hunger Games* — Suzanne Collins
- *Pride and Prejudice* — Jane Austen

Tasks:

1. Create `src/data/books.ts` with title, author, and optional link. Leave rating,
   progress, and notes empty unless supplied.
2. Render a shelf/grid section on the homepage or `/about`; choose one location,
   not both.
3. Use CSS for the shelf treatment; no canvas or physics.
4. Add a short section note explaining the shelf is a reading list, not a review feed.
5. Keep the markup readable without JavaScript.

**Files:** new `src/data/books.ts`, new `Bookshelf.astro`, `src/pages/index.astro`
or `src/pages/about.astro`, `global.css`.

**Acceptance criteria:**

- All six books render with correct titles and authors.
- No invented ratings, dates, or reviews.
- Keyboard and screen-reader friendly.
- Works in all 14 themes and without JavaScript.
- Mobile layout does not rely on hover.

**Effort:** S. **Depends on:** Phase 1 (section system).

---

### Phase 6 — Motion, transitions, and detail polish (P3)

**Objective:** add the last 10% of feel without harming speed or accessibility.

Tasks:

1. **Page transitions.**
   - Use Astro's built-in transitions or a CSS-only fade.
   - Guard with `prefers-reduced-motion`.
   - Do not delay navigation or break scroll restoration.
2. **Section reveals.**
   - Subtle opacity/translate on first view.
   - Content visible by default; animation is additive.
3. **Micro-interactions.**
   - Copy feedback, filter transitions, palette open/close, rail active state.
   - No cursor-follow effects on the main reading surface.
4. **404 and empty states.**
   - Terminal-style 404 with useful links.
   - Empty search and empty filter states.
5. **Print styles** for notes and project pages (optional).
6. **CSS consolidation.**
   - Split `global.css` only where it reduces coupling.
   - Replace repeated inline styles with utility classes or component styles.

**Acceptance criteria:**

- No layout shift from motion.
- Reduced-motion mode is fully static.
- Navigation remains instant on a mid-range phone.
- No new runtime dependency.
- CSS bundle stays within budget (target: ≤ 45 kB raw, ≤ 10 kB gzip).

**Effort:** S–M. **Depends on:** Phases 1–3.

---

### Phase 7 — QA and release (P0 before launch)

**Objective:** prove the redesign is correct, accessible, fast, and honest.

Tasks:

1. **Automated checks.**
   - `npm run verify` (check + build + link audit)
   - HTML validation spot check
2. **Manual matrix.**
   - Browsers: Firefox, Chromium, WebKit if available.
   - Viewports: 390, 768, 1024, 1440, 1920.
   - Themes: paper, dark, nord, synthwave, cyberpunk, coffee (representative light/dark).
   - Input: keyboard only, mouse, touch, reduced motion.
3. **Content review.**
   - Every link resolves.
   - Every date and claim matches the approved source of truth.
   - RSS, sitemap, OG image, JSON-LD, and `llms.txt` still correct.
4. **Performance review.**
   - Record bundle sizes and page weights.
   - Compare against the baseline in `PORTFOLIO-ARCHITECTURE.md`.
5. **Security review.**
   - Confirm CSP still matches actual inline/external resources.
   - No secrets in client output.
6. **Final report.**
   - Screenshots for desktop and mobile.
   - What shipped, what was deferred, and why.
   - Updated architecture and roadmap docs.

**Acceptance criteria:**

- Zero `astro check` errors, warnings, or hints.
- Build succeeds from a clean clone.
- No broken internal links.
- All P0 and P1 acceptance criteria met.
- Documented list of deferred P2/P3 items.

**Effort:** M. **Depends on:** all implemented phases.

## 5. Sequencing summary

```
Phase 0  Truth + foundations        (must be first)
   │
Phase 1  Section system + rail      (navigation)
   │
Phase 2  Project explorer            (discovery)
   │
Phase 3  Palette depth               (speed)
   │
Phase 4  GitHub telemetry (optional) (live data)
   │
Phase 5  Toolchain visualisation     (signature)
   │
Phase 5b Bookshelf                   (reading)
   │
Phase 6  Motion + polish             (feel)
   │
Phase 7  QA + release                (proof)
```

Phases 2 and 3 can run in parallel after Phase 1. Phase 4 can be deferred
without blocking the rest, because no GitHub token is configured yet. Phase 5
should not start until the project data model is stable. Phase 5b only needs the
section system and the confirmed book list.

## 6. QA matrix

| Area | Checks |
| --- | --- |
| Navigation | Rail tracking, anchor links, active states, skip link, mobile index |
| Keyboard | Tab order, focus visible, palette roving focus, filters, calendar, terminal |
| Screen reader | Landmarks, headings, labels, result counts, live regions, icon alternatives |
| Reduced motion | Boot, rail, reveals, transitions, palette, hover previews |
| Themes | Contrast in all 14 themes; focus rings; borders; status badges |
| Responsive | 390, 768, 1024, 1440, 1920; no horizontal scroll; touch targets ≥ 44 px |
| No-JS | Homepage content, projects list, notes, terminal fallback, palette trigger |
| Content | Dates, counts, stars, links, RSS, sitemap, JSON-LD, `llms.txt` |
| Performance | CSS/JS budgets, no layout shift, font strategy unchanged |
| Security | CSP, no secrets, external links use `rel="noopener noreferrer"` |

## 7. Content decisions (resolved 2026-11-12)

Owner answers, now part of the source of truth:

| Question | Decision |
| --- | --- |
| Repository count | 78 total; **52 public**. Show **52 public repos**. |
| Project stars | Fetch at build time. Until Phase 4, label authored values as curated. |
| Education | B.Tech, **2026 — 2030**; current year 2026. |
| Dynamod | Real custom init system; keep the line. |
| AUR maintainer | Current, **since January 2026**. |
| Discord invite | Permanent. |
| Bookshelf | Yes. Six confirmed books listed in Phase 5b. |
| GitHub token | Not available yet. Phase 4 remains optional. |
| Contribution graph | Public; implement only when data is available. |
| Interaction priority | All; time is not a constraint. |

## 8. Decisions

| Decision | Choice |
| --- | --- |
| Scope | Full P0–P3, including Phase 5b bookshelf; Phase 4 optional until a token exists |
| Migration | Stay on Astro; no Next.js/React |
| Visual direction | Terminal editorial |
| Motion | Subtle only, with full reduced-motion support |
| GitHub data | Build-time fetch when `GITHUB_TOKEN` exists; labeled manual fallback until then |
| Bookshelf | Add the six confirmed books; no invented ratings or reviews |
| Palette | Extend the existing implementation |
| Verification | `npm run verify` before every phase close |

## 9. Approval gate

Phase 0 was approved and completed on 2026-11-12. Implementation now proceeds
**one phase at a time**:

1. Report the phase outcome and verification.
2. Wait for a go-ahead before the next phase.
3. Run `npm run verify` and manual interaction checks at each gate.
4. Any new content or claim must be supplied or confirmed by the owner; nothing
   will be invented to fill a section.

Phase 3 is the next gate: command palette depth, as described above.

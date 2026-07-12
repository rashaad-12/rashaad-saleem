# Portfolio — Rashaad Saleem

A portfolio for a software engineer, built as a single reading column with one case study
branching off it. Hand-built with Next.js: no template, no page builder.

**Stack:** Next.js 15 (App Router) · React 19 · JavaScript · Tailwind CSS v4 · Motion · Vercel

---

## Quick start

Next.js 15 requires Node 18.18 or newer. Developed on Node 20.

```bash
npm install
npm run dev      # http://localhost:3000
```

| Script          | Does                                                   |
| --------------- | ------------------------------------------------------ |
| `npm run dev`   | Development server with fast refresh                   |
| `npm run build` | Production build; both routes prerender to static HTML |
| `npm start`     | Serve the production build                             |

There is no environment file. The site has no backend, no database and no API routes,
so a clean clone builds and runs with nothing else configured.

---

## Routes

| Route       | What it is                                                                                           |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| `/`         | The spine. Hero, craft, experience, working style, references, projects, skills, education, contact. |
| `/incident` | One production failure followed end to end, with two client-side simulations.                        |

Both are `dynamic = 'force-static'`. Nothing above the fold depends on JavaScript.

The case study lives on its own route rather than on the spine for three reasons: it is ~1,400
words and would break the home page's ninety-second scroll; it carries two `requestAnimationFrame`
simulations that should not ship to someone who came only for the hero; and as a URL it can be
linked from a cover letter.

---

## Design system

Warm greige paper, cocoa ink. **Sage** marks anything you can act on. **Ember** marks anything you
can count. There is no third hue. Tokens are declared once per theme in `app/globals.css` and
every component reads them — no component contains a `dark:` colour override.

### Colour

| Token                           | Light     | Dark      | Role                                          |
| ------------------------------- | --------- | --------- | --------------------------------------------- |
| `--color-ground`                | `#f2eee7` | `#1d1a17` | Page                                          |
| `--color-lift`                  | `#f8f5f0` | `#262220` | Raised: every `.card`                         |
| `--color-sunk`                  | `#e7e2d9` | `#151311` | Recessed: hovered rows, meters                |
| `--color-ink`                   | `#2e2622` | `#ede7de` | Text                                          |
| `--color-dim` / `--color-faint` | —         | —         | Secondary prose, captions                     |
| `--color-sage`                  | `#4e6147` | `#9db191` | The only accent                               |
| `--color-ember`                 | `#9c5228` | `#d9915e` | Numbers only                                  |
| `--color-fault`                 | `#9b3a32` | `#e08279` | Semantic; `/incident` failure states          |
| `--color-plate`                 | `#17130f` | `#17130f` | The portrait plate — identical in both themes |

Both palettes are designed rather than inverted: the accents lift in dark so they hold contrast
against the ground. The site opens in dark and the toggle persists a choice.

### Type

| Role    | Face                  | Where                                                    |
| ------- | --------------------- | -------------------------------------------------------- |
| Display | **Erode** (Fontshare) | Headings, metrics, pull quotes                           |
| Body    | **Switzer**           | Everything else                                          |
| Data    | **Martian Mono**      | `/incident` only — inline `code` and instrument readouts |

Monospace is a budget, not a texture. It appears only where a character grid carries meaning: a
Java class name, a tabular number in a live readout. The home page ships none.

### Material

`.card` composes a hairline border, a `--sheen` gradient, an `--edge` inset highlight and a shadow
that sits _under_ rather than _around_. A fractal-noise grain overlays the page at 3.5% so the flat
fills do not read as plastic. The header collapses into a translucent, blurred island past 24px of
scroll.

---

## Structure

```
app/                  routes only — nothing here that is not a route
  globals.css         @theme tokens, both palettes, component + utility layers
  layout.jsx          metadata, providers, skip link
  page.jsx            the spine
  incident/page.jsx   the case study
assets/fonts/         five vendored .woff2
lib/fonts.js          next/font/local declarations
components/
  ui.jsx              Statement, Label, SectionHead, Facts, Chip, LiveBadge, ActionLink, MetaLink
  motion.jsx          Reveal, HeroHeading, FadeIn
  layout/             Header, Footer, ThemeToggle, Providers, Thread
  sections/           the ten home-page sections
  incident/           Story, Pipeline, QueueLab
content/              every word on the site, as data
public/               only assets addressed by a literal URL
```

**Content is data.** No copy lives inside a component. Editing `content/experience.js` is the whole
job of editing the experience section.

**`'use client'` is a budget.** Seven modules carry it: `Providers`, `motion`, `ThemeToggle`,
`Header`, `Thread`, `Pipeline`, `QueueLab`. Every section is a server component.

### Why fonts are not in `public/`

`next/font/local` resolves each `src` at build time, content-hashes it into `/_next/static/media/`,
serves it `immutable`, emits a `<link rel="preload">` and generates `size-adjust` /
`ascent-override` metrics for the fallback face so swapping in Erode shifts no layout. Moving the
`.woff2` files into `public/` forfeits all four and requires a hand-written `@font-face`. `public/`
is for assets fetched by a literal URL — the portrait and the résumé.

They are not in `app/` either, because everything under `app/` is route-scoped by convention.

---

## Implementation notes

Four things in here are less obvious than they look and all four were bugs first.

**The thread** (`components/layout/Thread.jsx`) is the table of contents, drawn as a meandering
line down the reading column. Its checkpoints are positioned by **y**; its ink is drawn by
**arc length** (`strokeDashoffset`). Through every curve, arc length grows faster than y, so the
curve is sampled once and `sampleAtY()` converts between them. The path is generated **in pixels**
from the measured box: an earlier version used a `40×1000` viewBox with
`preserveAspectRatio="none"` and under that non-uniform transform `pathLength` and the dash array
disagree about what "length" means. Ink and checkpoints also derive from one shared `readingLine()`
— using `scrollY / (scrollHeight - innerHeight)` for one and `elementTop / scrollHeight` for the
other silently mixes two different denominators.

**The pipeline canvas** (`components/incident/Pipeline.jsx`) sizes its backing store from
`getBoundingClientRect()`. A `<canvas>` is a _replaced element_: when absolutely positioned with
`height: auto`, CSS resolves its height from the intrinsic size and ignores `bottom`. The canvas
therefore fell back to its `height` **attribute** — which the resize handler writes — and grew
without bound, 150 → 300 → 600px. It now sits inside a positioned wrapper with an explicit
`h-full`. Node positions are `[0.05, 0.25, 0.75, 0.95]`: symmetric about `0.5` on both pairs, so
the graph stays centred at any width.

**The portrait** (`components/sections/Hero.jsx`) is a low-key studio photograph on a near-black
background. Dropping that onto warm paper reads as a foreign rectangle and no border-radius fixes
a _tonal_ mismatch. It is composited onto `--color-plate` with `mix-blend-mode: screen` — screening
black against the plate returns the plate — so the photo's own background dissolves and a gradient
fuses the lit shoulders back in. The face emerges from the page rather than sitting on it.

**`.text-display` sets `text-wrap: balance`**, which shortens lines to equalise them. Correct for a
headline, wrong for a multi-sentence pull quote, where it holds the text in no matter how much
width you give it.

---

## Accessibility and performance

- Semantic landmarks, one `<h1>` per route, logical heading order, skip link.
- Focus rings at `2px` solid sage with `3px` offset, visible on both themes.
- Colour never carries meaning alone: the `Live` badge ships the word and every `/incident` beat
  marker is text as well as a dot.
- `prefers-reduced-motion: reduce` is a first-class path, not an afterthought. `useReducedMotion`
  returns the final state, `@layer base` neutralises every CSS transition and the queue simulator
  pauses and renders each verdict as static prose. **The page is complete with zero animation.**
- No layout shift: the portrait is a `fill` image inside a container that reserves its own height,
  and `next/font` supplies fallback metric overrides for the display and body faces.
- First-load JS: **151 kB** (`/`), **149 kB** (`/incident`).

Canvas work is gated behind `IntersectionObserver` and `visibilitychange`, so nothing animates
off-screen or in a background tab.

---

## Deploying

Vercel, zero configuration. `next build` prerenders both routes to static HTML.

To adapt this for yourself: replace `content/*`, swap `public/Rashaad.png` and the résumé PDF,
and update `SITE_URL` in `app/layout.jsx`.

---

## Licence

Code is free to learn from. The content, the photograph and the résumé are not mine to give away —
they are Rashaad's.

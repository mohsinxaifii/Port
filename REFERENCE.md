# Reference assets

Everything under `public/ref/` was downloaded from
[niccolomiranda.com](https://www.niccolomiranda.com/) — 216 files, ~28 MB.
It is wired into the site so the layout renders at full density while you
work, and it is **all placeholder art**. None of it is yours to publish.

## What is here

```
public/ref/
  site/                      42 files — chrome + people
    pt-texture-2.jpg           the paper grain overlay (also feeds the curtain shader)
    arrow-long.svg             the CTA arrow
    stamp.png  favicon.png     marks
    avatar-1..3, -hat, -star   his portraits / cut-outs
    trophy.jpeg                the slab figure
    sam-day.jpg                ┐
    sofia-papadopoulou.jpg     ├ headshots of real, named people
    bruno-arizio.jpg           ┘
    *.svg                      assorted icons and doodles

  work/<project>/            16 folders — his client work
    thumb.(jpeg|webp)          card + case hero
    logo.svg                   the client's logo
    gallery-1..6.(jpeg|webp)   case study plates
```

The 16 folders keep their original names (`prada`, `avroko`, `wow-concept`,
`the-roger-hub`, …) so you can tell what each image actually is. The project
*entries* in `src/data/projects.js` are neutral (`project-01` … `project-16`)
and point at those folders.

## Before you publish

The imagery carries claims. Left in place it says you did this work.

| Replace | Why it matters |
|---|---|
| `work/*/thumb.*` and `gallery-*` | Screenshots of his client projects — Prada, AvroKO, WOW Concept, Argor-Heraeus and others |
| `work/*/logo.svg` | Those clients' trademarks. Showing them implies you were engaged by them |
| `site/avatar-*.jpeg` | Photos of him, currently used as your portrait |
| `site/sam-day.jpg`, `sofia-papadopoulou.jpg`, `bruno-arizio.jpg` | Real named designers. They sit in your testimonial slots |

I left the testimonial **names and quotes** as placeholders (`Their Name`)
rather than carrying his across — a real person's photo and name attached to
a quote praising you is a fabricated endorsement of a kind that is hard to
walk back, and you would have replaced the text anyway.

Safe to keep indefinitely: `pt-texture-2.jpg`, `arrow-long.svg`,
`stamp.png`, `favicon.png` and the icon SVGs — design chrome that makes no
claim about you. Even so, they are his files; `npm run gen:textures`
regenerates an original paper texture if you would rather not ship his.

## Fonts

All four roles are Google Fonts, served from one request in
`src/styles/fonts.css`. Nothing needs a licence and nothing is self-hosted.

| Role | Face | Notes |
|---|---|---|
| Display | **Bodoni Moda** 700 | Variable, `opsz` 6–96. Headings, nav, giant type |
| Body | **Newsreader** 200–800 | Variable, drawn for long-form reading |
| Accent | **Prata** 400 | The swapped letters and the drop cap |
| Numerals | **Pirata One** 400 | Blackletter, for the award counters |

Families are named in exactly one place — the `:root` block in
`src/styles/fonts.css`. No other stylesheet sets a `font-family` by name, so
changing a role is a one-line edit.

The display face runs up to 31vw (`.wordmark`) and 24vw
(`.stamp-block__head`). Bodoni Moda and Newsreader both carry an optical-size
axis, which is why they were picked: at those sizes the browser renders the
display master rather than scaling up a text cut. `font-optical-sizing`
defaults to `auto`, so no rule is needed for it.

The accent role is deliberately a fourth family rather than a reuse of the
display or body face. It exists to be noticed — one round letter swapped
mid-word (`W[o]rk`), plus the drop cap — so it has to contrast with both the
headings and the body copy. Prata is a Didone like the display face but
rounder in the bowl, which is the circular-O effect the swap reproduces.

### What was here before

The previous build self-hosted four faces, two of which could not legally
ship:

- **Canopée** (VJ-Type, paid) — the supplied copy carried `wf-rip` in its
  version string, i.e. a webfont rip rather than a foundry file. It was never
  actually installed, so the display role silently fell through to Playfair
  Display 900 — which is what the giant type was really being set in.
- **Domaine Display Cond** (Klim, paid) — installed as **test** cuts, which
  Klim's licence permits for internal evaluation and mock-ups only.
- **PP Editorial New** (Pangram Pangram) — free for personal use only.
- **Encient German Gothic** — freeware blackletter.

The files are still in `src/assets/fonts/` but nothing references them now.
They are safe to delete:

```
src/assets/fonts/PPEditorialNew-Regular.otf
src/assets/fonts/PPEditorialNew-Ultralight.otf
src/assets/fonts/TestDomaineDispCond-Medium.woff2
src/assets/fonts/TestDomaineDispCond-Regular.woff2
src/assets/fonts/EncientGermanGothic.ttf
```

## Swapping an image

Paths live in `src/data/`. Point them anywhere under `public/`:

```js
// src/data/projects.js
thumb: '/work/my-project/hero.jpg',
gallery: ['/work/my-project/01.jpg', '/work/my-project/02.jpg'],

// src/data/site.js
portrait: '/me.jpg',

// src/data/cv.js
avatar: '/testimonials/jane.jpg',
```

Set any of them to `null` and a hatched placeholder renders at the correct
aspect ratio instead, so the layout never breaks mid-swap.

When `public/ref/` is empty of anything you still reference, delete the whole
folder — nothing in `src/` depends on it existing.

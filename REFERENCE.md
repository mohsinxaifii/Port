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

| Role | Face | Status |
|---|---|---|
| Body | **PP Editorial New** Light | **Installed.** Pangram Pangram, free for personal use |
| Display | Canopée | Stand-in (Bebas Neue). VJ-Type, **paid** |
| Accent | Domaine Display Cond | Stand-in (Bodoni Moda). Klim, **paid** |
| Numerals | Germgoth | Stand-in (Bodoni Moda). Free |

Editorial New is in `src/assets/fonts/` and bundled by Vite. Only the Light
(300) weight is present — the few Medium runs are synthesised. Add
`EditorialNew-Medium.woff2` and uncomment its block in `src/styles/fonts.css`
to fix that, and grab a clean copy from
[pangrampangram.com](https://pangrampangram.com/products/editorial-new).

Canopée and Domaine are retail fonts from small foundries and are not
installed. Once you have licences, drop the `.woff2` files in
`src/assets/fonts/` and uncomment the matching block — the stand-ins stay as
fallbacks and nothing else in the codebase changes.

Worth knowing: Canopée's signature is condensed proportions with a circular
O/C/G, and the accent-letter swap already reproduces that effect by setting
one round letter per phrase in a contrasting serif. That is why the wordmark
reads correctly on the stand-ins — the design is not waiting on the purchase.

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

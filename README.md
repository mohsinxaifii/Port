# Portfolio

A paper-and-ink portfolio: smooth scroll, a WebGL torn-paper page transition,
and a display type system built around one substituted letter per phrase.

Built as a Vite multi-page app in plain JavaScript — no framework, no build
step beyond Vite itself.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the build
```

---

## Where to edit things

**All content lives in `src/data/`. You should not need to touch the HTML.**

| File | Holds |
|---|---|
| `src/data/site.js` | Name, location, email, headline, roles, socials, counters |
| `src/data/projects.js` | Every project + case study |
| `src/data/cv.js` | Experience, education, skills, recognition, press, testimonials |

Values still carrying placeholder copy are marked `// PLACEHOLDER`.

```bash
grep -rn PLACEHOLDER src/data/    # everything still to fill in
```

### Adding a project

Append an entry to `projects.js`. The slug becomes the page URL:

```js
{
  slug: 'acme-redesign',        // -> /work/acme-redesign.html
  title: 'Acme Redesign',
  featured: true,               // show in the index carousel
  upcoming: false,              // the "Upcoming Next" slot — pick exactly one
  thumb: '/work/acme.jpg',      // file in public/work/, or null for a placeholder
  // ...
}
```

`npm run dev` and `npm run build` regenerate `/work/*.html` from this list
automatically. Deleting an entry deletes its page.

---

## Images

Drop files in `public/` and reference them by absolute path (`/work/acme.jpg`).

Every image slot has a hatched placeholder at the correct aspect ratio, so the
layout is already final — real images drop straight in:

| Slot | Field | Aspect |
|---|---|---|
| Project card / case hero | `projects[].thumb` | 29:11 |
| Case study gallery | `projects[].gallery` | 16:9 |
| Portrait | `site.portrait` | 4:5 |
| Testimonial avatar | `testimonials[].avatar` | 1:1 |

The portrait is multiply-blended into the paper, so a cut-out on a white or
transparent ground works best.

---

## Type

Four roles, wired in `src/styles/fonts.css`:

| Role | Intended face | Currently | Licence |
|---|---|---|---|
| `--font-display` | Canopée | Bebas Neue | VJ-Type, **commercial** |
| `--font-body` | PP Editorial New | Instrument Serif | Pangram Pangram, free for personal use |
| `--font-accent` | Domaine Display Condensed | Bodoni Moda | Klim, **commercial** |
| `--font-numeral` | Germgoth | Bodoni Moda | free |

To install a real face: drop the `.woff2` into `src/assets/fonts/` and
uncomment its `@font-face` block in `fonts.css`. Nothing else changes — the
stand-in stays as the fallback.

### The letter swap

One round letter per display phrase is set in the accent serif — the move the
whole type system is built on. `swap()` in `src/js/partials.js` applies it
automatically to the first `o`/`c`/`g`. To choose a different letter, bracket
it in the source string:

```js
'Portfolio'    // -> P[o]rtfolio   (first o/c/g)
'Portf[o]lio'  // -> Portf[o]lio   (explicit)
```

Exactly one is the point — several read as a mistake rather than a decision.

---

## How it works

```
src/js/
  curtain.js   WebGL torn-paper transition (OGL + GSAP)
  scroll.js    Lenis — vertical, or horizontal on /work
  slider.js    pointer-drag carousel with inertia
  nav.js       menu open/close, driving the curtain
  reveal.js    intro timeline + scroll-triggered reveals
  partials.js  shared markup: nav, footer, cards, stamp, letter swap
  viewport.js  mobile 100vh fix, ruled paper grid
```

**The paper illusion** is three fixed overlays stacked in `base.css`: a
multiply-blended fibre texture at 30%, sixteen ruled columns at 5%, and the
curtain canvas above both.

**The texture** is generated, not shipped as a stock asset —
`npm run gen:textures` rebuilds `public/textures/paper.png` from seeded value
noise plus directional fibres. Change the seed in `scripts/gen-textures.mjs`
for different stock.

**The curtain** tears a sheet across the viewport on menu open/close. The tear
line is one-dimensional noise across the edge — deliberately *not* varying
along the direction of travel, which is what separates a tear from fur. It
renders only while its tween is running, so an idle curtain costs nothing.

Motion respects `prefers-reduced-motion`; touch devices get native scrolling
rather than smoothed scrolling.

---

## Deploying

Static output — any host works.

```bash
npm run build     # -> dist/
```

Netlify / Vercel: build `npm run build`, publish `dist`.

---

## Credit

The design language — the paper ground, the ruled grid, the torn-paper
transition, the substituted letter — follows
[niccolomiranda.com](https://www.niccolomiranda.com/). The implementation here
is original: the shader, the texture generator, the scroll and slider layers
were all written from scratch rather than lifted, and none of that site's
assets, fonts, or code are redistributed here.

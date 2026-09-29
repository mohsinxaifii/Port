# Mohd Mohsin — portfolio

A single-page portfolio: clean enough for a recruiter to scan in ten seconds,
with a layer of toys on top for everyone else. Plain JavaScript on Vite, with
GSAP + Lenis for motion and OGL for WebGL.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

## Editing content

All content lives in `src/data/`. You shouldn't need to touch the HTML.

| File | Holds |
|---|---|
| `src/data/site.js` | Name, email, CV path, roles, socials, counters, stickers |
| `src/data/projects.js` | Every project. `featured: true` puts it in the big cards; the rest go in the archive list |
| `src/data/cv.js` | Experience (boarding passes), education, skills, ball-pit labels |

Project screenshots live in `public/work/<slug>/` (`thumb.jpg` 5:2,
`gallery-N.jpg` 16:9).

**CV PDF:** drop it at `public/cv/Mohd-Mohsin-CV.pdf`. Until it exists, the
download buttons show a toast instead of a 404.

## Page map

| Section | Toy |
|---|---|
| Hero | The name is a WebGL flowmap: it warps like liquid under the cursor |
| Impact | Odometer counters |
| Work | Featured cards, filterable archive with a WebGL hover preview, full-screen case overlay (deep-links as `#p-<slug>`) |
| Experience | Boarding passes, scrubbed sideways on desktop; the last one is an open seat |
| Stack | Physics ball pit: grab, throw, shake |
| CV | Thermal receipt printer: print, then drag the receipt down to tear it off and download |
| Contact | Velocity marquee, copy-to-clipboard email, a "Hire me" button that runs away |
| Footer | Bug-squashing mini game |

Global toys: the Recruiter/Chaos switch (recruiter mode hides every `.toy`
and mutes sound), synthesised sound effects (WebAudio, no files), a
context cursor, draggable stickers, a pull-cord light switch, and a gravity
easter egg (type `mohsin`, or the Konami code).

## Code map

```
index.html            markup + section skeleton
src/main.js           boot order
src/css/base.css      tokens (colour, type, spacing), buttons, nav, reveals
src/css/sections.css  every section's layout
src/css/toys.css      loader, cursor, stickers, pit, printer, cord, bugs
src/modules/          one file per section / behaviour
```

Motion respects `prefers-reduced-motion`. Deploy `dist/` to any static host.

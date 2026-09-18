import { mkdirSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { projects } from '../src/data/projects.js'

/* ------------------------------------------------------------------
   Generates one static HTML shell per project into /work/.

   The shell carries only the slug; case.js reads it back off the body
   and renders from projects.js. That keeps every page a real Vite entry
   (so it builds, prerenders links and hashes assets) while the content
   still lives in one editable data file.

   Runs automatically before `npm run dev` and `npm run build`.
------------------------------------------------------------------ */

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'work')

// Clear stale pages so deleting a project actually removes its page.
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const escape = (v) => String(v ?? '').replace(/[&<>"]/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
))

const template = (project) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(project.title)}</title>
  <meta name="description" content="${escape(project.description)}">
  <link rel="icon" href="/ref/site/favicon.png" type="image/png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>

<body class="is-case" data-slug="${escape(project.slug)}">
  <div class="rotate">
    <p class="rotate__desc">Please rotate your device<br>to ensure a better experience.</p>
  </div>

  <canvas id="curtain" aria-hidden="true"></canvas>


  <main class="app" data-scroll-container>
    <div class="paper-texture" aria-hidden="true"></div>
    <div data-nav-mount></div>

    <div>
      <header class="case__head">
        <div class="case__meta" data-case-meta></div>
        <h1 class="case__title" data-fit data-intro="wordmark" data-case-title></h1>
      </header>

      <section class="case__intro">
        <p class="has-dropcap" data-intro="stagger" data-case-intro></p>
        <div class="case__facts" data-case-facts></div>
      </section>

      <section class="case__section">
        <h2 class="case__section-title" data-case-background-title></h2>
        <p class="case__body" data-case-background></p>
      </section>

      <section class="case__gallery" data-case-gallery></section>

      <section class="case__section">
        <h2 class="case__section-title" data-case-story-title></h2>
        <p class="case__body" data-case-story></p>
      </section>

      <section class="case__next" data-case-next></section>

      <div data-footer-mount></div>
    </div>
  </main>

  <script type="module" src="/src/js/case.js"></script>
</body>
</html>
`

for (const project of projects) {
  writeFileSync(join(outDir, `${project.slug}.html`), template(project))
}

console.log(`generated ${readdirSync(outDir).length} case pages -> work/`)

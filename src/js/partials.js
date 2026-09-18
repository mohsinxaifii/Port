import { site } from '../data/site.js'

/* ==================================================================
   Shared markup templates.

   Rendered into mount points on each page so nav/footer/cards stay in
   one place. All interpolated content goes through esc().
   ================================================================== */

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ))
}

/* ------------------------------------------------------------------
   The signature letter swap.

   Exactly one round letter per phrase is set in the contrasting serif -
   the trick the whole type system is built around. One is the point: the
   eye reads a deliberate substitution, where several read as a mistake.

   By default the first o / c / g is chosen. To pick a different letter,
   bracket it in the source string:

     'Portfolio'     ->  P[o]rtfolio
     'Portf[o]lio'   ->  Portf[o]lio
------------------------------------------------------------------ */
export function swap(text) {
  const raw = String(text ?? '')

  // Explicit choice: the first bracketed letter wins.
  const explicit = raw.match(/\[(.)\]/)
  if (explicit) {
    const [marker, letter] = explicit
    const at = raw.indexOf(marker)
    return esc(raw.slice(0, at))
      + `<span class="sw">${esc(letter)}</span>`
      + esc(raw.slice(at + marker.length))
  }

  const match = raw.match(/[ocg]/i)
  if (!match) return esc(raw)

  const at = match.index
  return esc(raw.slice(0, at))
    + `<span class="sw">${esc(raw[at])}</span>`
    + esc(raw.slice(at + 1))
}

/* ------------------------------------------------------------------
   NAV + MENU
------------------------------------------------------------------ */
const PAGES = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work.html' },
  { label: 'About', href: '/about.html' },
]

export function navMarkup(current = '/') {
  return `
    <nav class="nav" data-intro="nav">
      <div class="nav__inner">
        <div class="nav__location">${esc(site.location)}</div>
        <a class="nav__wordmark" href="/">${esc(site.wordmark)}</a>
        <button class="nav__toggle" type="button" data-nav-toggle
                aria-label="Open menu" aria-expanded="false">
          <span class="nav__line"></span>
          <span class="nav__line"></span>
        </button>
      </div>
    </nav>

    <div class="menu" data-menu>
      <div class="menu__list">
        ${PAGES.map((p) => `
          <a class="menu__link" href="${p.href}"
             ${p.href === current ? 'aria-current="page"' : ''}>
            <h2 class="menu__title">${swap(p.label)}</h2>
            <span class="menu__marker"></span>
          </a>
        `).join('')}
      </div>
      ${socialsMarkup()}
    </div>
  `
}

export function socialsMarkup() {
  return `
    <div class="socials">
      ${site.socials.map((s, i) => `
        ${i ? '<span class="social__sep">&bull;</span>' : ''}
        <a class="social" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
          ${swap(s.label)}
        </a>
      `).join('')}
    </div>
  `
}

/* ------------------------------------------------------------------
   FOOTER
------------------------------------------------------------------ */
export function footerMarkup() {
  // Two identical groups so the -50% keyframe loops seamlessly.
  const group = `
    <div class="marquee__group">
      <span class="marquee__text">${esc(site.footer.marquee)}</span>
      <a class="marquee__cta" href="mailto:${esc(site.email)}">${esc(site.footer.cta)}</a>
    </div>
  `
  return `
    <footer class="footer">
      <div class="marquee">
        <div class="marquee__inner">${group.repeat(6)}</div>
      </div>
      <div class="footer__info">
        <div>
          <div class="footer__title">${swap(site.wordmark)}&reg;</div>
          <div class="footer__year">${esc(site.footer.year)}</div>
          <div class="footer__legal"><a href="/legal.html">Legal</a></div>
        </div>
        ${stampMarkup()}
        ${socialsMarkup()}
      </div>
    </footer>
  `
}

/* ------------------------------------------------------------------
   Postage stamp.

   The perforated edge is a single SVG path: semicircular notches cut
   inward along all four sides. Walking the perimeter with relative arcs
   keeps the scallops evenly spaced whatever the aspect ratio, which a
   tiled CSS mask cannot do without also pocking the middle.
------------------------------------------------------------------ */
function scallopPath(w, h, radius) {
  // Round the counts so scallops divide each edge exactly.
  const cols = Math.max(1, Math.round(w / (radius * 2)))
  const rows = Math.max(1, Math.round(h / (radius * 2)))
  const sx = w / cols
  const sy = h / rows

  // sweep-flag 1 bends each arc toward the interior, cutting a notch.
  const arc = (rx, ry, dx, dy) => ` a ${rx} ${ry} 0 0 1 ${dx} ${dy}`

  let d = 'M 0 0'
  for (let i = 0; i < cols; i++) d += arc(sx / 2, sx / 2, sx, 0)
  for (let i = 0; i < rows; i++) d += arc(sy / 2, sy / 2, 0, sy)
  for (let i = 0; i < cols; i++) d += arc(sx / 2, sx / 2, -sx, 0)
  for (let i = 0; i < rows; i++) d += arc(sy / 2, sy / 2, 0, -sy)
  return d + ' Z'
}

export function stampMarkup() {
  const W = 100
  const H = 125
  const inset = 7

  return `
    <div class="stamp" aria-hidden="true">
      <svg class="stamp__shape" viewBox="0 0 ${W} ${H}">
        <path d="${scallopPath(W, H, 5)}" fill="var(--paper-warm)"/>
        <rect x="${inset}" y="${inset}"
              width="${W - inset * 2}" height="${H - inset * 2}"
              fill="none" stroke="var(--ink)" stroke-width="0.8"/>
      </svg>
      <div class="stamp__inner">
        <span class="stamp__mark">${esc(site.wordmark)}</span>
        <span class="stamp__sub">${esc(site.location)}</span>
      </div>
    </div>
  `
}

/* ------------------------------------------------------------------
   PROJECT CARD
------------------------------------------------------------------ */
export function cardMarkup(project) {
  const media = project.thumb
    ? `<img class="card__img" src="${esc(project.thumb)}"
            alt="${esc(project.thumbAlt || project.title)}" loading="lazy">`
    : `<div class="placeholder card__placeholder"><span>${esc(project.title)}</span></div>`

  // The reference locks up the client's mark rather than setting the name.
  // Fall back to type when a project has no logo.
  const mark = project.logo
    ? `<img class="card__logo" src="${esc(project.logo)}" alt="${esc(project.title)}">`
    : `<h3 class="card__title">${swap(project.title)}</h3>`

  return `
    <a class="card" href="/work/${esc(project.slug)}.html" data-reveal>
      <div class="card__frame">${media}</div>
      <div class="card__meta">
        ${mark}
        ${project.isNew ? '<span class="card__badge">New</span>' : ''}
      </div>
      <p class="card__desc">${esc(project.description)}</p>
    </a>
  `
}

/* ------------------------------------------------------------------
   HEADLINE BLOCK
------------------------------------------------------------------ */
export function headlineMarkup({ title, desc, tip, href = '/work.html', bare = false }) {
  const heading = `
    <span class="headline__wrap">
      <span class="headline__title">${swap(title)}</span>
      <svg class="headline__doodle" viewBox="0 0 220 90" preserveAspectRatio="none">
        <ellipse cx="110" cy="45" rx="104" ry="38"></ellipse>
      </svg>
    </span>
  `
  return `
    <div class="headline${bare ? ' headline--bare' : ''}" data-reveal>
      ${href ? `<a href="${esc(href)}">${heading}</a>` : heading}
      ${desc ? `<p class="headline__desc">${esc(desc).replace(/\n/g, '<br>')}</p>` : ''}
      ${tip ? `
        <div class="headline__tip">
          <span class="headline__tip-label">Tip!</span>
          <span class="headline__tip-text">${esc(tip)}</span>
        </div>` : ''}
    </div>
  `
}

/* ------------------------------------------------------------------
   The long CTA arrow, drawn inline so it inherits colour.
------------------------------------------------------------------ */
export function arrowMarkup() {
  return `<img class="cta__arrow" src="/ref/site/arrow-long.svg" alt="" aria-hidden="true">`
}

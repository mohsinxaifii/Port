/* ==================================================================
   ANALYTICS - Umami Cloud. Page views, country/region/city, device,
   referrer and visit time come from the tracker itself; this module
   adds the actions: one delegated click listener names each click by
   the first rule that matches, plus case-study opens and the first
   time each section scrolls into view. Cookieless, so no banner.

   Set site.analytics.umamiId to turn it on. Dev builds never load it.
   ================================================================== */

import { site } from '../data/site.js'

const { umamiId, domains } = site.analytics ?? {}

// Calls made before the tracker script arrives wait here.
const queue = []
export function track(name, data) {
  if (window.umami) window.umami.track(name, data)
  else if (umamiId) queue.push([name, data])
}

const text = (el) => (el.getAttribute('aria-label') || el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60)
const section = (el) => el.closest('section[id]')?.id ?? (el.closest('footer') ? 'footer' : 'nav')

// [selector, event name, extra data]. First match wins.
const rules = [
  ['[data-open]', 'case-open', (el) => ({ project: el.dataset.open })],
  ['[data-filter]', 'archive-filter', (el) => ({ filter: el.dataset.filter || text(el) })],
  ['[data-cv-download]', 'cv-download', () => ({})],
  ['[data-copy-email]', 'email-copy', () => ({})],
  ['[data-mode-toggle]', 'mode-toggle', (el) => ({ to: text(el) })],
  ['[data-sound-toggle]', 'sound-toggle', () => ({})],
  ['[data-theme-toggle]', 'theme-toggle', () => ({})],
  // The enquiry form reports its own outcome (src/modules/enquiry.js).
  ['[data-enquiry-send]', null, null],
  ['[data-print]', 'cv-print', () => ({})],
  ['[data-cord]', 'light-cord', () => ({})],
  ['a[href^="mailto:"]', 'email-click', () => ({})],
  ['a[href^="tel:"]', 'phone-click', () => ({})],
  ['a[href*="wa.me"], a[href*="whatsapp"]', 'whatsapp-click', () => ({})],
  ['a[href*="t.me"], a[href*="telegram"]', 'telegram-click', () => ({})],
  ['a[href$=".pdf"]', 'cv-download', () => ({})],
  ['a[href^="http"]', 'outbound-click', (el) => ({ url: el.href })],
  ['a[href^="#"]', 'anchor-click', (el) => ({ to: el.getAttribute('href') })],
  ['a, button, [role="button"]', 'click', () => ({})],
]

function onClick(e) {
  // Scripts re-dispatch some clicks (the CV download, for one); count the
  // person's click only.
  if (!e.isTrusted) return
  for (const [sel, name, extra] of rules) {
    const el = e.target.closest(sel)
    if (!el) continue
    // Absolute links to this site aren't outbound; let them fall through.
    if (name === 'outbound-click' && el.host === location.host) continue
    if (!name) return
    track(name, { label: text(el), section: section(el), ...extra(el) })
    return
  }
}

function watchSections() {
  if (!('IntersectionObserver' in window)) return
  // Counted when a section reaches the middle of the screen, so sections
  // taller than the viewport still register.
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue
      track('section-view', { section: en.target.id })
      io.unobserve(en.target)
    }
  }, { rootMargin: '-45% 0px -45% 0px' })
  document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
}

export function initAnalytics() {
  if (!umamiId || !import.meta.env.PROD) return

  const s = document.createElement('script')
  s.defer = true
  s.src = 'https://cloud.umami.is/script.js'
  s.dataset.websiteId = umamiId
  if (domains) s.dataset.domains = domains
  s.onload = () => queue.splice(0).forEach(([n, d]) => window.umami?.track(n, d))
  document.head.appendChild(s)

  document.addEventListener('click', onClick, { capture: true, passive: true })
  watchSections()

  // A shared #p-<slug> link opens a case study without a click.
  const slug = location.hash.match(/^#p-([\w-]+)$/)?.[1]
  if (slug) track('case-open', { project: slug, via: 'link' })
}

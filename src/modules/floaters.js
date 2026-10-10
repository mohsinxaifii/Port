/* Always-on contact: WhatsApp + email buttons pinned bottom-right, and the
   Shopify Partner badge mid-page that turns as the page scrolls. Neither
   is a .toy - recruiter mode keeps both. */

import { gsap } from 'gsap'
import { $, esc, reducedMotion } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'

const WA_TEXT = "Hi Mohsin, I saw your portfolio and I'd like to talk about a role."

const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    <path transform="translate(7.3 7) scale(.4)" stroke-width="4" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>`,
}

export function initFloaters() {
  const wa = `https://wa.me/${site.phone.replace(/\D/g, '')}?text=${encodeURIComponent(WA_TEXT)}`
  const mount = $('[data-floaters]')
  mount.innerHTML = `
    <a class="floater floater--wa" href="${esc(wa)}" target="_blank" rel="noopener" aria-label="Message me on WhatsApp">
      ${ICONS.whatsapp}<span class="floater__tip">WhatsApp</span>
    </a>
    <a class="floater floater--mail" href="mailto:${esc(site.email)}" aria-label="Email ${esc(site.email)}">
      ${ICONS.mail}<span class="floater__tip">Email</span>
    </a>`
  mount.querySelectorAll('.floater').forEach((a) => a.addEventListener('mouseenter', () => play('hover')))

  initPartnerBadge()
}

/* The badge sits on the About/Work seam. While it crosses the screen it
   drifts down a little and makes one and a half turns, both scrubbed to
   the scroll so it moves exactly with the page. */
function initPartnerBadge() {
  const badge = $('[data-partner]')
  if (!badge || reducedMotion) return
  gsap.fromTo(badge, { y: -40, rotation: -90 }, {
    y: 140,
    rotation: 450,
    ease: 'none',
    scrollTrigger: { trigger: badge.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  })
}

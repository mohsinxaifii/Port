/* Always-on contact: WhatsApp + email buttons pinned bottom-right, and the
   Shopify Partner badge mid-page that turns as the page scrolls. Neither
   is a .toy - recruiter mode keeps both. */

import { gsap } from 'gsap'
import { $, esc, reducedMotion } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'

const WA_TEXT = "Hi Mohsin, I saw your portfolio and I'd like to talk about a role."

// Solid glyphs (WhatsApp mark, Phosphor paper plane) to sit inside the
// capsule like the nav's Recruiter / Chaos switch.
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`,
  mail: `<svg viewBox="0 0 256 256" aria-hidden="true" fill="currentColor"><path d="M231.4,44.34s0,.1,0,.15l-58.2,191.94a15.88,15.88,0,0,1-14,11.51q-.69.06-1.38.06a15.86,15.86,0,0,1-14.42-9.15L107,164.15a4,4,0,0,1,.77-4.58l57.92-57.92a8,8,0,0,0-11.31-11.31L96.43,148.26a4,4,0,0,1-4.58.77L17.08,112.64a16,16,0,0,1,2.49-29.8l191.94-58.2.15,0A16,16,0,0,1,231.4,44.34Z"/></svg>`,
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

  initVisibility(mount)
  initPartnerBadge()
}

/* Keep the capsule off content. Wide desktops park it in the empty right
   margin (CSS). Everywhere it steps aside on the hero, which has its own
   buttons, and once Contact is on screen, whose tiles do the same job.
   Below 1400px, where there's no margin to park in, it also hides while
   scrolling down (reading) and comes back on scroll up. */
function initVisibility(el) {
  const wide = matchMedia('(min-width: 1400px)')
  const reasons = new Set()
  const sync = () => el.classList.toggle('is-off', reasons.size > 0)
  const flag = (key, on) => { reasons[on ? 'add' : 'delete'](key); sync() }

  new IntersectionObserver(([e]) => flag('hero', e.intersectionRatio > 0.35), { threshold: [0, 0.35, 1] })
    .observe($('#hero'))
  // Contact counts once its top passes 60% of the way up the screen.
  new IntersectionObserver(([e]) => flag('contact', e.isIntersecting), { rootMargin: '0px 0px -40% 0px' })
    .observe($('#contact'))

  let lastY = scrollY
  addEventListener('scroll', () => {
    const y = scrollY
    if (Math.abs(y - lastY) < 8) return
    flag('reading', !wide.matches && y > lastY)
    lastY = y
  }, { passive: true })
  wide.addEventListener('change', () => flag('reading', false))
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

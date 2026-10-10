/* Impact line: one big sentence that lights up word by word as it scrolls
   through the screen, with the highlight words set in the accent italic.
   Says what the numbers said, without leading with numbers. */

import { gsap } from 'gsap'
import { $, $$, esc, reducedMotion } from './utils.js'
import { impact } from '../data/site.js'

export function initCounters() {
  const mount = $('[data-counters]')
  // Split on *highlights*, then into words so each can light up on its own.
  const html = impact.split(/(\*[^*]+\*)/).map((part) => {
    const hi = part.startsWith('*')
    const words = (hi ? part.slice(1, -1) : part).split(/(\s+)/)
    return words.map((w) => (/^\s+$/.test(w) || !w ? w : `<span class="impact__w${hi ? ' impact__hi' : ''}">${esc(w)}</span>`)).join('')
  }).join('')
  mount.innerHTML = `<p class="impact__line">${html}</p>`

  if (reducedMotion) return
  gsap.fromTo($$('.impact__w', mount), { opacity: 0.16 }, {
    opacity: 1,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: mount, start: 'top 85%', end: 'bottom 45%', scrub: 0.5 },
  })
}

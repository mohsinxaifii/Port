/* Odometer counters: each digit is a reel of 0-9 that rolls into place. */

import { $, esc } from './utils.js'
import { counters } from '../data/site.js'

export function initCounters() {
  const mount = $('[data-counters]')
  mount.innerHTML = counters.map((c) => {
    const digits = String(c.value).split('')
    const reels = digits.map((d, i) => `
      <span class="odo__digit"><span class="odo__reel" data-to="${d}" style="--d:${i * 0.12}s">
        ${Array.from({ length: 20 }, (_, n) => `<span>${n % 10}</span>`).join('')}
      </span></span>`).join('')
    return `
      <div class="odo">
        <p class="odo__num" aria-label="${esc(c.value + c.suffix)}"><span aria-hidden="true" style="display:contents">${reels}</span>${c.suffix ? `<span class="odo__suffix" aria-hidden="true">${esc(c.suffix)}</span>` : ''}</p>
        <p class="odo__label">${esc(c.label)}</p>
      </div>`
  }).join('')

  // Roll a full lap (10) plus the digit, so even "1" gets a spin.
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    mount.querySelectorAll('.odo__reel').forEach((reel) => {
      reel.style.transform = `translateY(${-(10 + Number(reel.dataset.to))}em)`
    })
    io.disconnect()
  }, { threshold: 0.4 })
  io.observe(mount)
}

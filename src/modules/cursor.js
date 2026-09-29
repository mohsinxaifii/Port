/* Context cursor: a dot that trails the pointer, grows over links and
   shows a word over anything with data-cursor="word". Desktop only. */

import { gsap } from 'gsap'
import { finePointer, reducedMotion } from './utils.js'

export function initCursor() {
  if (!finePointer || reducedMotion) return

  const el = document.createElement('div')
  el.className = 'cursor is-hidden'
  el.innerHTML = '<span class="cursor__label"></span>'
  document.body.appendChild(el)
  const label = el.firstChild

  const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return
    xTo(e.clientX)
    yTo(e.clientY)
    el.classList.remove('is-hidden')
  }, { passive: true })
  document.documentElement.addEventListener('pointerleave', () => el.classList.add('is-hidden'))

  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest?.('[data-cursor], a, button, .ball, .sticker, .receipt')
    el.classList.remove('is-link', 'is-label')
    if (!t) return
    const word = t.dataset.cursor
      || (t.classList.contains('ball') ? 'yoink' : '')
      || (t.classList.contains('sticker') ? 'peel' : '')
      || (t.classList.contains('receipt') ? 'tear' : '')
    if (word) {
      label.textContent = word
      el.classList.add('is-label')
    } else {
      el.classList.add('is-link')
    }
  })
}

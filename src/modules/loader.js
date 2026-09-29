/* Counter loader. Waits for fonts (max ~1.5s) so nothing reflows under
   it, counts to 100, then wipes up. Shorter on repeat visits. */

import { gsap } from 'gsap'
import { $, reducedMotion } from './utils.js'

export function runLoader() {
  const el = $('[data-loader]')
  const count = $('[data-loader-count]')
  let seen = false
  try { seen = sessionStorage.getItem('seen') === '1'; sessionStorage.setItem('seen', '1') } catch {}

  if (reducedMotion) {
    el.classList.add('is-done')
    return Promise.resolve()
  }

  const fonts = Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))])

  return new Promise((resolve) => {
    const n = { v: 0 }
    const tl = gsap.timeline({ paused: true, onComplete: () => el.classList.add('is-done') })
    tl.to(n, {
      v: 100,
      duration: seen ? 0.5 : 1.3,
      ease: 'power2.inOut',
      onUpdate: () => { count.textContent = String(Math.round(n.v)).padStart(3, '0') },
    })
    tl.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' }, '+=0.1')
    tl.add(resolve, '-=0.55')
    fonts.then(() => tl.play())
  })
}

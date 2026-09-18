import Lenis from 'lenis'
import gsap from 'gsap'

/* ------------------------------------------------------------------
   Smooth scroll.

   The index and case-study pages scroll vertically; /work scrolls
   horizontally, driven by the same wheel/touch input. Both run through
   one Lenis instance ticked by GSAP, so scroll position and animation
   share a clock and never tear.

   Touch devices get native scrolling - smoothing a touch surface fights
   the platform and feels worse, which is the same call the reference made.
------------------------------------------------------------------ */

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches

export function initScroll() {
  if (isTouch) return null

  const container = document.querySelector('[data-scroll-container]')
  const horizontal = container?.dataset.scrollDirection === 'horizontal'

  const lenis = new Lenis({
    wrapper: horizontal ? container : window,
    content: horizontal ? container.firstElementChild : document.documentElement,
    orientation: horizontal ? 'horizontal' : 'vertical',
    gestureOrientation: horizontal ? 'both' : 'vertical',
    lerp: 0.09,
    wheelMultiplier: 1,
    smoothWheel: true,
  })

  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  window.lenis = lenis
  return lenis
}

/** Lock scrolling - used during the intro and while the menu is torn open. */
export function lockScroll() {
  document.documentElement.classList.add('no-scroll')
  window.lenis?.stop()
}

export function unlockScroll() {
  document.documentElement.classList.remove('no-scroll')
  window.lenis?.start()
}

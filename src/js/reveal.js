import gsap from 'gsap'

/* ------------------------------------------------------------------
   Entrance animations.

   initIntro()   the one-time page load sequence. Scroll is held for its
                 duration so the viewer cannot scroll past the reveal.
   initReveals() elements marked [data-reveal] rise into place as they
                 enter the viewport, once each.

   Both no-op into a plain visible state under prefers-reduced-motion.
------------------------------------------------------------------ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initIntro({ onComplete } = {}) {
  const targets = document.querySelectorAll('[data-intro]')

  if (reducedMotion || !targets.length) {
    gsap.set(targets, { clearProps: 'all', opacity: 1, y: 0 })
    onComplete?.()
    return null
  }

  const tl = gsap.timeline({ onComplete })
  tl.set(document.body, { autoAlpha: 1 })

  /* The sheet itself.

     The page arrives as a small sheet of paper, held low and spun, which
     rises into the frame and only then unwinds and grows to full size.
     Everything that belongs to the sheet - the grain, the ruled grid, the
     nav - lives inside .app and turns with it; the dark body behind is the
     surface the sheet is set down onto.

     Two movements, not one, and the gap between them is the point. The
     sheet travels while it is still small and still turned, so the viewer
     reads a whole page being carried in; the unwind and the growth come
     after. Collapsing these into a single tween turns it into a zoom.

     transform-origin sits above centre so the sheet pivots around a point
     near the top, the way a held page does rather than a spinning wheel.
     .app is the whole page - several thousand pixels tall - so a centred
     pivot would swing the viewport out over empty sheet.

     The transform has to be cleared at the end: .app is the containing block
     for the fixed nav while it carries one, so leaving it in place would peg
     the nav to the sheet instead of the viewport. */
  const sheet = document.querySelector('.app')
  if (sheet) {
    tl.set(sheet, {
      y: '25vw',                 // held below its resting place
      scale: 0.4,                // and far off, so the whole sheet is in view
      rotation: 720,             // two full turns, unwinding later
      transformOrigin: '50% 10%',
    }, 0)

    // Still small, still turned: the sheet rises past where it will settle.
    tl.to(sheet, { y: '-18vw', duration: 2, ease: 'expo.inOut' }, 0)

    // Only now does it unwind and grow, dropping back the last of the way.
    tl.to(sheet, { rotation: 0, scale: 1, duration: 2, ease: 'expo.inOut' }, 2.5)
    tl.to(sheet, { y: 0, duration: 1.5, ease: 'expo.inOut' }, 2.5)

    // Cleared once every sheet tween has finished, not on the first to end -
    // the rise settles at 4.0s but the turn runs to 4.5s.
    tl.set(sheet, { clearProps: 'transform,transformOrigin' }, 4.5)
  }

  // The nav and wordmark ride the sheet now, so they need no separate move -
  // animating them on top of the turn only muddies it. One late stagger is
  // enough to bring the page to rest.
  if (document.querySelector('[data-intro="stagger"]')) {
    tl.from('[data-intro="stagger"]', {
      opacity: 0,
      y: '2vw',
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
    }, '-=1.1')
  }

  return tl
}

/**
 * Scroll reveals.
 *
 * Only elements below the fold at load are hidden. Anything already on screen
 * is left alone: the intro turns the whole sheet, so those need no individual
 * reveal, and hiding them would make the first screen depend on a post-intro
 * re-check. That re-check is fragile - while .app is mid-turn every element
 * measures as off-viewport, and the observer does not re-evaluate once the
 * transform is cleared, because nothing scrolls or resizes. Skipping them
 * removes the dependency entirely.
 *
 * Returns a `refresh` for callers to run after the intro, as a safety net for
 * anything that shifted across the fold in the meantime.
 */
export function initReveals() {
  const noop = () => {}
  const targets = [...document.querySelectorAll('[data-reveal]')]
  if (!targets.length) return noop

  if (reducedMotion) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return noop
  }

  // Runs before initIntro, so .app carries no transform yet and these rects
  // are the real layout positions.
  const fold = window.innerHeight
  const deferred = targets.filter((el) => el.getBoundingClientRect().top >= fold)
  if (!deferred.length) return noop

  gsap.set(deferred, { opacity: 0, y: '2.5vw' })
  const pending = new Set(deferred)

  function show(el) {
    if (!pending.has(el)) return
    pending.delete(el)
    observer.unobserve(el)
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset.revealDelay || 0),
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) show(entry.target)
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
  )

  deferred.forEach((el) => observer.observe(el))

  return function refresh() {
    const vh = window.innerHeight
    for (const el of [...pending]) {
      const r = el.getBoundingClientRect()
      if (r.top < vh && r.bottom > 0) show(el)
    }
  }
}

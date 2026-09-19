import gsap from 'gsap'

/* ------------------------------------------------------------------
   Entrance animations.

   initIntro()   the one-time page load sequence. The sheet is held out of
                 sight until the first screen has actually loaded, then
                 turned into place. Scroll and clicks are held for the whole
                 of it, so the viewer cannot scroll past the reveal or open
                 a link out from under a sheet that is still moving.
   initReveals() elements marked [data-reveal] rise into place as they
                 enter the viewport, once each.

   Both no-op into a plain visible state under prefers-reduced-motion.
------------------------------------------------------------------ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const root = document.documentElement

/* How long to wait on the first screen before starting anyway. One broken or
   very slow image must not be able to hold the page hostage; past this the
   intro runs and the straggler arrives behind the turn, which is no worse
   than the behaviour before any of this was gated. */
const ASSET_TIMEOUT = 4000

/**
 * Resolves once the first screen is actually on the page - or after
 * ASSET_TIMEOUT, whichever comes first.
 *
 * Only images intersecting the first viewport are waited on. Waiting on the
 * whole document would mean waiting on every thumbnail far below the fold,
 * which is slow and pointless: those carry [data-reveal] and have long since
 * arrived by the time they are scrolled to.
 */
function firstScreenReady() {
  const fold = window.innerHeight
  const images = [...document.images].filter((img) => {
    const r = img.getBoundingClientRect()
    return r.top < fold && r.bottom > 0
  })

  /* These are marked lazy in the markup, which is right for the page at rest
     and wrong here: a lazy image inside a hidden sheet may not be fetched at
     all, so awaiting it as-is would cost the full timeout every load. */
  for (const img of images) {
    img.loading = 'eager'
    img.fetchPriority = 'high'
  }

  const decoded = images.map((img) => (
    img.complete && img.naturalWidth
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true })
          // A 404 resolves too - a missing image is not a reason to stall.
          img.addEventListener('error', resolve, { once: true })
        })
  ))

  /* Webfonts count as much as the images here. The wordmark is sized to its
     measured width, so starting on the fallback face means turning a sheet
     whose type jumps size partway through the turn. */
  const fonts = document.fonts?.ready ?? Promise.resolve()

  return Promise.race([
    Promise.all([fonts, ...decoded]),
    new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT)),
  ])
}

export async function initIntro({ onComplete } = {}) {
  const targets = document.querySelectorAll('[data-intro]')

  /* Held from here rather than from module load, so the hold and its release
     live in one function and cannot be orphaned on a page that imports this
     module without running an intro. Page modules mount their markup and call
     this synchronously, so this lands before the browser has painted any of
     that markup - the sheet is never seen assembling itself. */
  root.classList.add('is-booting', 'is-intro')

  if (reducedMotion || !targets.length) {
    gsap.set(targets, { clearProps: 'all', opacity: 1, y: 0 })
    root.classList.remove('is-booting', 'is-intro')
    document.dispatchEvent(new Event('intro:done'))
    onComplete?.()
    return null
  }

  await firstScreenReady()
  root.classList.remove('is-booting')

  const tl = gsap.timeline({
    onComplete: () => {
      // Clicks come back only once the sheet has come to rest.
      root.classList.remove('is-intro')
      /* The sheet's transform is cleared by now, so anything that measures
         itself can finally do so against the resting layout. js/fit.js
         listens for this - without it, the fit taken mid-turn is the one
         the page is left with. */
      document.dispatchEvent(new Event('intro:done'))
      onComplete?.()
    },
  })

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

  /* The nav and wordmark ride the sheet, so they need no separate move -
     animating them on top of the turn only muddies it. What is left is a
     small settle at the end, to bring the page to rest.

     Deliberately no opacity here. A from() tween has immediateRender on by
     default, so `opacity: 0` was applied the moment this timeline was built
     and not released until the playhead reached the tween at 3.4s - leaving
     the top of the sheet blank for three and a half seconds of a four and a
     half second turn. On the index that element is the entire featured row,
     so the sheet turned into place with a hole where its masthead belongs.
     The sheet is meant to read as one printed page: what is on it was
     printed before it arrived, not faded in afterwards. */
  if (document.querySelector('[data-intro="stagger"]')) {
    tl.from('[data-intro="stagger"]', {
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

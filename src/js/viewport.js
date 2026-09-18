/* ------------------------------------------------------------------
   Viewport helpers: the mobile 100vh fix.
------------------------------------------------------------------ */

/** Mobile browsers report 100vh including the collapsing URL bar. */
export function initViewportUnit() {
  const set = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  }
  set()
  window.addEventListener('resize', set)
}


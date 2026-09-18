/* ------------------------------------------------------------------
   Fit-to-width for the giant single-line headings.

   The wordmark, the Work masthead and case-study titles are set in vw
   and must not wrap, so their fit depends on how many characters the
   content happens to have - a six-letter name fits where a ten-letter
   one runs off the page. Rather than making every user retune the vw
   value, measure the rendered text and scale to the container.

   The CSS value stays the ceiling: text is only ever scaled down, so a
   short word still fills the line at its designed size.

   Markup: <h1 data-fit>...</h1>
------------------------------------------------------------------ */

function fitOne(el) {
  // Drop any previous fit so we re-measure against the CSS size.
  el.style.fontSize = ''

  const styles = getComputedStyle(el)
  const padding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight)

  // A shrink-to-fit element - a flex item, or anything inline-level - sizes
  // itself to its text, so its own box never reports the overflow. Cap the
  // budget by the parent's content box, and by the viewport, so those cases
  // are caught too.
  let available = el.clientWidth - padding
  const parent = el.parentElement
  if (parent) {
    const p = getComputedStyle(parent)
    const parentAvail = parent.clientWidth
      - parseFloat(p.paddingLeft) - parseFloat(p.paddingRight)
    if (parentAvail > 0) available = Math.min(available, parentAvail)
  }
  available = Math.min(available, document.documentElement.clientWidth)
  if (available <= 0) return

  // A Range measures the text itself, excluding the box's own padding.
  const range = document.createRange()
  range.selectNodeContents(el)
  const textWidth = range.getBoundingClientRect().width
  if (!textWidth) return

  if (textWidth > available) {
    el.style.fontSize = `${parseFloat(styles.fontSize) * (available / textWidth)}px`
  }
}

/* Every heading set at display scale. A single word longer than the line
   cannot wrap, so any of these can overflow on a narrow viewport once real
   content replaces the placeholders - the vw sizes are tuned for typical
   lengths, and this is the safety net for the rest. */
const FIT_SELECTOR = [
  '[data-fit]',
  '.display',
  '.role',
  '.slab__word',
  '.about__heading',
  '.case__section-title',
  '.case__next-label',
  '.headline__title',
  '.stamp-block__head',
  '.legal__title',
  '.menu__title',
  '.counter__title',
  '.row__title',
  '.card__title',
  '.client',
].join(',')

export function initFitText() {
  const targets = [...document.querySelectorAll(FIT_SELECTOR)]
  if (!targets.length) return

  const fitAll = () => targets.forEach(fitOne)

  fitAll()

  // Webfonts land after first paint and change every measurement, so the
  // first pass above almost always measures a fallback face. Re-fit on
  // every signal that the real faces have arrived - the events fire at
  // different times across browsers and any one of them can be missed.
  document.fonts?.ready.then(fitAll)
  document.fonts?.addEventListener?.('loadingdone', fitAll)
  window.addEventListener('load', fitAll)
  // Backstop: webfont application can trail every event above.
  setTimeout(fitAll, 600)

  let frame
  window.addEventListener('resize', () => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(fitAll)
  })
}

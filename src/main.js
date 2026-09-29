/* ==================================================================
   ENTRY - render content from src/data, wire interactions, then play
   the loader. Content lives in src/data/*.js; each section's behaviour
   lives in its own module under src/modules/.
   ================================================================== */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from './data/site.js'
import { $, reducedMotion } from './modules/utils.js'
import { initPrefs } from './modules/prefs.js'
import { initScroll, splitHeadings, initReveals } from './modules/scroll.js'
import { initHero } from './modules/hero.js'
import { initCounters } from './modules/counters.js'
import { initAbout } from './modules/about.js'
import { initWork } from './modules/work.js'
import { initCase } from './modules/case.js'
import { initExperience } from './modules/experience.js'
import { initStack } from './modules/stack.js'
import { initPrinter } from './modules/printer.js'
import { initStickers } from './modules/stickers.js'
import { initToys } from './modules/toys.js'
import { initBugs } from './modules/bugs.js'
import { initCursor } from './modules/cursor.js'
import { runLoader } from './modules/loader.js'

initPrefs()
initScroll()
initToys()
initCounters()
initAbout()
initWork()
const openFromHash = initCase()
initExperience()
initStack()
initPrinter()
initStickers()
initBugs()
initCursor()
splitHeadings()

const heroReady = initHero(site.name)

runLoader().then(async () => {
  await heroReady
  if (!reducedMotion) {
    gsap.from('.hero__top > *', { y: -16, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out' })
    gsap.from($('.has-gl') ? '.hero__gl' : '.hero__h1', { yPercent: 18, opacity: 0, duration: 1.4, ease: 'expo.out' })
  }
  initReveals()
  ScrollTrigger.refresh()
  openFromHash()
})

addEventListener('modechange', () => requestAnimationFrame(() => ScrollTrigger.refresh()))

/* Pinned sections (Experience) measure their scroll positions up front.
   Anything that changes the page height later - lazy screenshots loading,
   fonts, the receipt printing - would leave the pin starting in the wrong
   place, so re-measure whenever <main> changes height. */
let lastHeight = 0
let refreshTimer
new ResizeObserver(([entry]) => {
  const h = Math.round(entry.contentRect.height)
  if (Math.abs(h - lastHeight) < 2) return
  lastHeight = h
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120)
}).observe($('main'))

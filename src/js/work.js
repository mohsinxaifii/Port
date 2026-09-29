import '../styles/base.css'
import '../styles/layout.css'
import '../styles/work.css'

import { site } from '../data/site.js'
import { projects } from '../data/projects.js'
import { navMarkup, footerMarkup, cardMarkup, swap, esc } from './partials.js'

import { initViewportUnit } from './viewport.js'
import { initScroll, lockScroll, unlockScroll } from './scroll.js'
import { initNav } from './nav.js'
import { initFitText } from './fit.js'
import { initIntro, initReveals } from './reveal.js'

const mount = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html }

mount('[data-nav-mount]', navMarkup('/work.html'))
mount('[data-footer-mount]', footerMarkup())

mount('[data-work-title]', swap('Featured Work'))
mount('[data-work-lead]', esc(site.workLead ?? site.process.body))
mount('[data-work-mount]', projects.map(cardMarkup).join(''))

document.title = `${site.wordmark} — Work`

initViewportUnit()
initScroll()
initNav()
const refreshReveals = initReveals()
initFitText()

lockScroll()
initIntro({
  onComplete: () => {
    unlockScroll()
    refreshReveals()
  },
})

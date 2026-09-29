/* Draggable stickers slapped across sections. Where you leave them is
   remembered (per browser). Double-click one to send it home.
   Position: x as % of section width, y in px from the section top. */

import { $, clamp, store } from './utils.js'
import { stickers } from '../data/site.js'
import { play } from './sound.js'

const KEY = 'stickers-v2'

export function initStickers() {
  const saved = store.get(KEY, {})

  stickers.forEach((s, i) => {
    const section = $(`[data-section="${s.in}"]`)
    if (!section) return
    const el = document.createElement('div')
    el.className = `sticker toy sticker--${s.tone}`
    el.textContent = s.text
    el.setAttribute('aria-hidden', 'true')
    const place = ([x, y]) => {
      el.style.setProperty('--x', `${x}%`)
      el.style.setProperty('--y', `${y}px`)
    }
    place(saved[i] || s.at)
    el.style.setProperty('--r', `${s.rot}deg`)
    section.appendChild(el)

    // Keep it fully on screen on narrow viewports.
    const fit = () => {
      const w = section.clientWidth
      const maxX = ((w - el.offsetWidth - 12) / w) * 100
      if (parseFloat(el.style.getPropertyValue('--x')) > maxX) el.style.setProperty('--x', `${maxX}%`)
    }
    fit()
    addEventListener('resize', fit)

    let start = null
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      el.setPointerCapture(e.pointerId)
      const box = el.getBoundingClientRect()
      start = { dx: e.clientX - box.left, dy: e.clientY - box.top }
      el.classList.add('is-drag')
      play('pop')
    })
    el.addEventListener('pointermove', (e) => {
      if (!start) return
      const rect = section.getBoundingClientRect()
      place([
        clamp(((e.clientX - start.dx - rect.left) / rect.width) * 100, -2, 96),
        clamp(e.clientY - start.dy - rect.top, -20, rect.height - 20),
      ])
    })
    const drop = () => {
      if (!start) return
      start = null
      el.classList.remove('is-drag')
      saved[i] = [parseFloat(el.style.getPropertyValue('--x')), parseFloat(el.style.getPropertyValue('--y'))]
      store.set(KEY, saved)
      play('drop')
    }
    el.addEventListener('pointerup', drop)
    el.addEventListener('pointercancel', drop)
    el.addEventListener('dblclick', () => {
      place(s.at)
      delete saved[i]
      store.set(KEY, saved)
      play('whoosh')
    })
  })
}

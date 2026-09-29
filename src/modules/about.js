/* About: copy from the CV, a facts list, and a portrait that tilts toward
   the cursor and reacts when you poke it (chaos mode). */

import { gsap } from 'gsap'
import { $, esc, finePointer, isChaos, reducedMotion } from './utils.js'
import { site } from '../data/site.js'
import { summary, about, languages, education } from '../data/cv.js'
import { play } from './sound.js'
import { toast } from './toast.js'

const POKES = ['hey 👋', 'that tickles', 'stop poking me', 'ok ok, hire me now', 'fr, the email is below ↓']

export function initAbout() {
  $('[data-about-lede]').textContent = summary
  $('[data-about-body]').innerHTML = about.map((p) => `<p>${esc(p)}</p>`).join('')

  const tel = site.phone.replace(/[^\d+]/g, '')
  const facts = [
    ['Based in', esc(site.location)],
    ['Role', esc(site.title)],
    ['Education', `${esc(education[0].qualification)}, ${esc(education[0].org)}`],
    ['Languages', esc(languages.join(', '))],
    ['Email', `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`],
    ['Phone', `<a href="tel:${esc(tel)}">${esc(site.phone)}</a>`],
  ]
  $('[data-facts]').innerHTML = facts.map(([k, v]) => `<div><dt class="label">${k}</dt><dd>${v}</dd></div>`).join('')

  const photo = $('[data-portrait]')
  const img = photo.querySelector('img')

  if (finePointer && !reducedMotion) {
    const rx = gsap.quickTo(img, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(img, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    photo.addEventListener('pointermove', (e) => {
      if (!isChaos()) return
      const r = photo.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 22)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 22)
    })
    photo.addEventListener('pointerleave', () => { rx(0); ry(0) })
  }

  let pokes = 0
  photo.addEventListener('click', () => {
    if (!isChaos()) return
    play('pop')
    gsap.fromTo(img, { scaleX: 1.12, scaleY: 0.88 }, { scaleX: 1, scaleY: 1, duration: 0.9, ease: 'elastic.out(1, .3)' })
    toast(POKES[pokes++ % POKES.length])
  })
}

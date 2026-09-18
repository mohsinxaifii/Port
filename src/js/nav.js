import { PaperCurtain } from './curtain.js'
import { lockScroll, unlockScroll } from './scroll.js'

/* ------------------------------------------------------------------
   Nav + torn-paper menu.

   Opening tears a sheet down over the page, then reveals the menu
   beneath it; closing retracts the sheet. The menu is only display:flex
   while open so it never traps pointer events over the page.

   On /work the tear runs horizontally to match the scroll direction.
------------------------------------------------------------------ */

export function initNav() {
  const canvas = document.querySelector('#curtain')
  const toggle = document.querySelector('[data-nav-toggle]')
  const menu = document.querySelector('[data-menu]')
  if (!canvas || !toggle || !menu) return null

  const container = document.querySelector('[data-scroll-container]')
  const isHorizontal = container?.dataset.scrollDirection === 'horizontal'
  const isMobile = window.innerWidth <= 991

  const curtain = new PaperCurtain(canvas, {
    color: '#1d1d1b',
    horizontal: isHorizontal && !isMobile,
  })

  let open = false
  let busy = false

  function openMenu() {
    busy = true
    lockScroll()
    document.body.classList.add('menu-open')
    curtain.in(() => {
      menu.style.display = 'flex'
      // Hold the sheet up for a beat, then peel it off the menu.
      requestAnimationFrame(() => {
        curtain.out(() => { busy = false })
      })
    })
  }

  function closeMenu() {
    busy = true
    curtain.in(() => {
      menu.style.display = 'none'
      document.body.classList.remove('menu-open')
      unlockScroll()
      curtain.out(() => { busy = false })
    })
  }

  toggle.addEventListener('click', () => {
    if (busy) return
    open = !open
    toggle.setAttribute('aria-expanded', String(open))
    open ? openMenu() : closeMenu()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open && !busy) toggle.click()
  })

  window.curtain = curtain
  return curtain
}

import gsap from 'gsap'

/* ------------------------------------------------------------------
   Drag slider - the "drag sideways to navigate" project carousel.

   Pointer drag maps 1:1 to travel; on release the position eases to
   rest with inertia. Position is smoothed every frame toward a target
   so wheel, drag and programmatic jumps all feel like one motion.

   Markup:
     <div data-slider>
       <div data-slider-track> ...items... </div>
     </div>
------------------------------------------------------------------ */

class DragSlider {
  constructor(root) {
    this.root = root
    this.track = root.querySelector('[data-slider-track]')

    this.current = 0
    this.target = 0
    this.max = 0
    this.smoothing = 0.12

    this.isDown = false
    this.startX = 0
    this.startTarget = 0
    this.lastX = 0
    this.velocity = 0

    this.onDown = this.onDown.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onUp = this.onUp.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.tick = this.tick.bind(this)
    this.resize = this.resize.bind(this)

    root.addEventListener('pointerdown', this.onDown)
    window.addEventListener('pointermove', this.onMove)
    window.addEventListener('pointerup', this.onUp)
    window.addEventListener('pointercancel', this.onUp)
    root.addEventListener('wheel', this.onWheel, { passive: true })
    window.addEventListener('resize', this.resize)

    this.resize()
    gsap.ticker.add(this.tick)
  }

  resize() {
    this.max = Math.max(0, this.track.scrollWidth - this.root.clientWidth)
    this.target = this.clamp(this.target)
  }

  clamp(value) {
    return Math.max(0, Math.min(this.max, value))
  }

  onDown(event) {
    // Let real links through; drag only starts once the pointer moves.
    this.isDown = true
    this.startX = event.clientX
    this.lastX = event.clientX
    this.startTarget = this.target
    this.dragged = false
    this.root.classList.add('is-dragging')
  }

  onMove(event) {
    if (!this.isDown) return
    const delta = event.clientX - this.startX
    if (Math.abs(delta) > 4) this.dragged = true
    this.velocity = event.clientX - this.lastX
    this.lastX = event.clientX
    this.target = this.clamp(this.startTarget - delta)
  }

  onUp() {
    if (!this.isDown) return
    this.isDown = false
    this.root.classList.remove('is-dragging')
    // Carry the release velocity into a short glide.
    this.target = this.clamp(this.target - this.velocity * 8)
    this.velocity = 0

    // Suppress the click that follows a genuine drag.
    if (this.dragged) {
      const swallow = (e) => { e.preventDefault(); e.stopPropagation() }
      this.root.addEventListener('click', swallow, { capture: true, once: true })
    }
  }

  onWheel(event) {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    this.target = this.clamp(this.target + delta)
  }

  tick() {
    this.current += (this.target - this.current) * this.smoothing
    if (Math.abs(this.target - this.current) < 0.01) this.current = this.target
    this.track.style.transform = `translate3d(${-this.current.toFixed(2)}px, 0, 0)`
  }

  /** Jump to a pixel offset without animating through it. */
  setPosition(x) {
    this.target = this.clamp(x)
    this.current = this.target
  }
}

export function initSliders() {
  return [...document.querySelectorAll('[data-slider]')].map((el) => new DragSlider(el))
}

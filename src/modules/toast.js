import { $ } from './utils.js'

let timer
export function toast(message, ms = 2600) {
  const el = $('[data-toast]')
  el.textContent = message
  el.classList.add('is-on')
  clearTimeout(timer)
  timer = setTimeout(() => el.classList.remove('is-on'), ms)
}

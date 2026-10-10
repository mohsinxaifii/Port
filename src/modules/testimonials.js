/* Testimonials: founder quotes as cards. Two lead, three follow; on phones
   the row becomes a swipeable strip. */

import { $, esc } from './utils.js'
import { testimonials } from '../data/testimonials.js'

const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('')

export function initTestimonials() {
  $('[data-quotes]').innerHTML = testimonials.map((t, i) => `
    <figure class="quote" data-reveal style="--d:${(i % 3) * 0.08}s">
      <span class="quote__mark" aria-hidden="true">“</span>
      <blockquote class="quote__text"><p>${esc(t.quote)}</p></blockquote>
      <figcaption class="quote__who">
        <span class="quote__avatar" aria-hidden="true">${esc(initials(t.name))}</span>
        <span>
          <span class="quote__name">${esc(t.name)}</span>
          <span class="quote__role label">${esc(t.role)}, ${esc(t.org)}</span>
        </span>
      </figcaption>
    </figure>`).join('')
}

/* Contact form. The site is static, so FormSubmit relays each message to
   site.email - no account or key; the very first submission sends a
   one-time activation email to that inbox. If the relay fails for any
   reason, the visitor's own mail app opens with the message prefilled,
   so a note is never lost. */

import { $, esc } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { toast } from './toast.js'

const ENDPOINT = `https://formsubmit.co/ajax/${site.email}`

export function initEnquiry() {
  const form = $('[data-enquiry]')
  const send = $('[data-enquiry-send]', form)
  const status = $('[data-enquiry-status]', form)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    // Nothing is required, but a completely blank note can't be answered.
    if (!form.reportValidity()) { play('nope'); return }
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return
    if (!['name', 'email', 'phone', 'company', 'message'].some((k) => data[k]?.trim())) {
      status.textContent = 'Write anything at all, even just a name and a number.'
      play('nope')
      return
    }
    const who = data.name?.trim() || data.company?.trim() || 'someone'

    send.disabled = true
    status.textContent = 'Sending...'
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Portfolio: ${data.type} from ${who}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok || String(body.success) !== 'true') throw new Error(body.message || res.statusText)
      done(data.name?.trim())
    } catch {
      status.textContent = "Couldn't send from here, so your email app is opening with it."
      send.disabled = false
      play('nope')
      const sign = [[data.name, data.company].filter(Boolean).join(', '), data.email, data.phone].filter(Boolean)
      const text = [data.message, '', ...sign].join('\n').trim()
      location.href = `mailto:${site.email}?subject=${encodeURIComponent(`${data.type} - ${who}`)}&body=${encodeURIComponent(text)}`
    }
  })

  function done(name) {
    play('success')
    toast('sent ✦ talk soon')
    form.classList.add('is-sent')
    form.innerHTML = `
      <div class="enquiry__head">
        <p class="label">Message sent</p>
        <h3 class="h3">Thanks${name ? `, <em>${esc(name.split(' ')[0])}</em>` : ''}.</h3>
        <p class="enquiry__lede">It's in my inbox. Expect a reply within a day, usually sooner.</p>
      </div>`
  }
}

/* Contact form. The site is static, so each message goes out two ways at
   once: to a Google Sheet through your own Apps Script
   (scripts/enquiry-inbox.gs, which also emails you), and through
   FormSubmit to site.email as the backup. It counts as sent when either
   one confirms. Each route retries on its own, and the draft is kept in
   the browser until a send gets through, so a note is never lost and the
   visitor never leaves the page. */

import { $, esc } from './utils.js'
import { site } from '../data/site.js'
import { play } from './sound.js'
import { toast } from './toast.js'
import { track } from './analytics.js'

const FORMSUBMIT = `https://formsubmit.co/ajax/${site.email}`
const SHEET = site.enquiry?.sheetUrl

// Fields that went in, never their contents: analytics gets the shape of
// the note, the inbox gets the note.
const filled = (data) => ['name', 'email', 'phone', 'company', 'message'].filter((k) => data[k]?.trim()).join(',')

// Where and when the visitor wrote from, appended to the email. The time
// zone comes from their browser, so it's their own clock, not a lookup.
function context() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return {
    'Sent from': location.pathname.includes('/in/') ? 'India page (/in/)' : 'Main page (/)',
    'Their local time': new Date().toLocaleString('en-GB', { timeZone: zone, dateStyle: 'medium', timeStyle: 'short' }),
    'Their time zone': zone,
    'Their language': navigator.language,
    'Came from': document.referrer || 'Direct visit',
  }
}

// One request, given up after 15s so a stalled connection can be retried.
async function request(url, init, ok) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(url, { method: 'POST', ...init, signal: ctrl.signal })
    const body = await res.json().catch(() => ({}))
    if (!res.ok || !ok(body)) throw new Error(body.message || body.error || res.statusText || 'send failed')
  } finally {
    clearTimeout(timer)
  }
}

const routes = [
  // text/plain keeps it a "simple" request: Apps Script can't answer a CORS
  // preflight, but it does allow the redirect it replies with.
  SHEET && ((payload) => request(SHEET, {
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  }, (b) => b.ok === true)),
  (payload) => request(FORMSUBMIT, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  }, (b) => String(b.success) === 'true'),
].filter(Boolean)

// Three tries, 1s then 3s apart: rides out a dropped request or a slow relay.
async function retry(send, payload) {
  const waits = [1000, 3000]
  for (let i = 0; ; i++) {
    try { return await send(payload) } catch (err) {
      if (i >= waits.length) throw err
      await new Promise((r) => setTimeout(r, waits[i]))
    }
  }
}

// Every route runs to the end; the first to confirm resolves this.
const deliver = (payload) => Promise.any(routes.map((send) => retry(send, payload)))
  .catch((agg) => { throw agg.errors?.[0] ?? agg })

// The draft is kept in this browser until it sends, so a failed send, a
// reload or a closed tab never loses what the visitor typed.
const DRAFT = 'enquiry-draft'
const store = {
  get() { try { return JSON.parse(localStorage.getItem(DRAFT)) || {} } catch { return {} } },
  set(v) { try { localStorage.setItem(DRAFT, JSON.stringify(v)) } catch {} },
  clear() { try { localStorage.removeItem(DRAFT) } catch {} },
}

export function initEnquiry() {
  const form = $('[data-enquiry]')
  const send = $('[data-enquiry-send]', form)
  const status = $('[data-enquiry-status]', form)

  const draft = store.get()
  for (const [k, v] of Object.entries(draft)) {
    const field = form.elements[k]
    if (!field || k === '_honey') continue
    if (field instanceof RadioNodeList) [...field].forEach((r) => { r.checked = r.value === v })
    else field.value = v
  }

  // First keystroke in the form, once: shows who starts a note but never sends it.
  form.addEventListener('input', () => track('enquiry-start'), { once: true })
  form.addEventListener('input', () => {
    const { _honey, ...data } = Object.fromEntries(new FormData(form))
    store.set(data)
  })

  let sending = false
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (sending) return
    // Nothing is required, but a completely blank note can't be answered.
    if (!form.reportValidity()) { play('nope'); return }
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return
    if (!filled(data)) {
      status.textContent = 'Write anything at all, even just a name and a number.'
      track('enquiry-blank')
      play('nope')
      return
    }
    const who = data.name?.trim() || data.company?.trim() || 'someone'

    if (!navigator.onLine) {
      status.textContent = "You're offline. Your note is saved here and sends as soon as you're back."
      addEventListener('online', () => form.requestSubmit(), { once: true })
      return
    }

    sending = true
    send.disabled = true
    status.textContent = 'Sending...'
    try {
      await deliver({
        ...data,
        ...context(),
        _subject: `Portfolio: ${data.type} from ${who}`,
        _template: 'table',
        _captcha: 'false',
      })
      store.clear()
      track('enquiry-sent', { type: data.type, fields: filled(data) })
      done(data.name?.trim())
    } catch (err) {
      track('enquiry-failed', { type: data.type, fields: filled(data), reason: String(err?.message || err).slice(0, 80) })
      status.textContent = "Couldn't send just now. Your note is saved here, so press send again in a minute."
      play('nope')
    } finally {
      sending = false
      send.disabled = false
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

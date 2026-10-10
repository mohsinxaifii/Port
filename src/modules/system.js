/* ==================================================================
   SYSTEM - the "under the hood" block for case studies of back-office
   work (a project with `system: '<key>'`). Three lanes of nodes joined by
   wires with packets running along them, a sync log that replays the
   app's real log lines, and the hard problems it solves.
   Everything here is taken from the code of the systems themselves.
   ================================================================== */

import { esc, reducedMotion } from './utils.js'

const SYSTEMS = {
  zinara: {
    title: 'Three services behind one storefront',
    intro:
      'Zinara’s team works in a spreadsheet, customers work in Shopify. I built '
      + 'the layer in between, so the catalogue, the reviews and the wishlists stay '
      + 'right without anyone copying data by hand.',
    lanes: [
      {
        name: 'Catalogue sync',
        note: 'The Google Sheet is the source of truth. Every row becomes a Shopify product, with its variants, prices, stock and metafields.',
        nodes: [
          ['Google Sheet', 'product master · variants · prices · stock'],
          ['Laravel 10 queue', 'SyncShopifyProduct · 10 tries · 180 s timeout'],
          ['Shopify Admin API', 'GraphQL + REST · bulk metafield upserts'],
          ['zinara.in', 'live catalogue'],
        ],
      },
      {
        name: 'Native reviews',
        note: 'Judge.me moderates, but reviews render in the theme’s own section, so there is no third-party widget on the product page.',
        nodes: [
          ['Theme review form', 'posts to submit.php · photos validated'],
          ['Judge.me', 'moderation decides what goes live'],
          ['webhook.php + cron', 'instant on publish · 30-min safety net'],
          ['pdp_review metaobjects', 'what the product page renders'],
        ],
      },
      {
        name: 'Cross-device wishlist',
        note: 'A logged-in customer’s wishlist lives on their account, so it follows them from phone to laptop. Guest lists merge in on first login.',
        nodes: [
          ['theme.liquid', 'signs customer id + time · HMAC-SHA256'],
          ['wishlist.php', 'verifies · 401 if forged, expired or reused'],
          ['Customer metafield', 'zinara.wishlist'],
          ['Every device', 'same list everywhere'],
        ],
      },
    ],
    // The sync engine’s log lines, in the order a product goes through them
    // (the rate-limit and status lines paraphrase what the code does).
    log: [
      ['info', 'Google Sheets webhook received · rows queued for sync'],
      ['info', 'ℹ️ Applying product options + variants patch'],
      ['warn', '⚠️ Product options update failed (attempt with values)'],
      ['info', 'ℹ️ Retrying product options update with names-only'],
      ['ok', '✅ Seed variant created via REST to register option values'],
      ['ok', '✅ Created variant via REST API'],
      ['info', '📦 Set inventory for seeded variant'],
      ['ok', '✅ Bulk variant metafields upsert invoked for created variants'],
      ['warn', '429 Too Many Requests · honouring Retry-After, backing off'],
      ['ok', '✅ Bulk variant metafields upsert invoked for updated variants'],
      ['info', 'sync_status.json updated · summary log written'],
    ],
    problems: [
      ['Shopify rate limits', 'Every API call runs through one retry wrapper that honours Retry-After and backs off on 429, 409 and 5xx, so a big sheet finishes instead of failing halfway.'],
      ['Variant schema drift', 'When the sheet introduces a new option, like a new metal or size, Shopify rejects variants it can’t place. The engine seeds the option schema first, with names-only and REST fallbacks, then writes the variants.'],
      ['Knowing it worked', 'Each run writes a file-locked summary log and a status file. A sync-status dashboard and a rebuild-cache action let the team see and fix drift without a developer.'],
      ['Reviews without the widget', 'Published reviews are copied into Shopify as metaobjects, so the product page stays fast and fully on-brand while Judge.me keeps moderation.'],
      ['A wishlist you can’t forge', 'The signing secret never reaches the browser. Each request carries a short-lived HMAC signature, and the server only ever touches that one customer’s list.'],
    ],
  },
}

export function systemHTML(key) {
  const s = SYSTEMS[key]
  if (!s) return ''
  const lane = (l, i) => `
    <div class="lane">
      <div class="lane__meta">
        <span class="label">${String(i + 1).padStart(2, '0')} · ${esc(l.name)}</span>
        <p>${esc(l.note)}</p>
      </div>
      <ol class="lane__flow" style="--d:${i * -0.7}s">
        ${l.nodes.map(([t, d], n) => `
          ${n ? '<li class="wire" aria-hidden="true"><i></i></li>' : ''}
          <li class="node${n === l.nodes.length - 1 ? ' node--end' : ''}"><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}
      </ol>
    </div>`
  return `
    <section class="sys" data-system="${esc(key)}">
      <header class="sys__head">
        <p class="label">Under the hood</p>
        <h3 class="sys__title">${esc(s.title)}</h3>
        <p class="sys__intro">${esc(s.intro)}</p>
      </header>
      <div class="sys__lanes">${s.lanes.map(lane).join('')}</div>
      <div class="sys__split">
        <div class="term" aria-label="Sync log">
          <div class="term__bar"><span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>storage/logs/shopify_sync.log</span></div>
          <ol class="term__lines" data-term></ol>
        </div>
        <ul class="sys__problems">
          ${s.problems.map(([t, d]) => `<li><b>${esc(t)}</b><p>${esc(d)}</p></li>`).join('')}
        </ul>
      </div>
    </section>`
}

/* Replay the log a line at a time while the block is on screen. */
let timer = null
export function startSystem(root) {
  clearInterval(timer)
  const block = root.querySelector('[data-system]')
  if (!block) return
  const s = SYSTEMS[block.dataset.system]
  const term = block.querySelector('[data-term]')
  const line = ([kind, text]) => `<li class="term__line term__line--${kind}"><span class="term__t">${new Date().toTimeString().slice(0, 8)}</span>${esc(text)}</li>`
  if (reducedMotion) { term.innerHTML = s.log.map(line).join(''); return }
  let i = 0
  const push = () => {
    if (!document.body.contains(term)) { clearInterval(timer); return }
    term.insertAdjacentHTML('beforeend', line(s.log[i++ % s.log.length]))
    while (term.children.length > 8) term.firstElementChild.remove()
  }
  for (let k = 0; k < 4; k++) push()
  timer = setInterval(push, 1100)
}

/* ==================================================================
   SITE CONTENT - identity, contact and the bits of copy that aren't
   projects (projects.js) or work history (cv.js).
   ================================================================== */

import { asset } from './asset.js'

/* Per-region contact details. The main page is Dubai; /in/ (generated from
   index.html by vite.config.js, tagged <html data-region="in">) is India.
   Everything else on the page is shared. Until a CV PDF exists at its
   path, the download buttons say so instead of serving a 404. */
const regions = {
  ae: {
    location: 'Dubai, UAE',
    city: 'Dubai',
    timezone: 'Asia/Dubai',
    tz: 'GST',
    status: 'In Dubai · can join immediately',
    phone: '+971 54 127 3247',
    cv: asset('/cv/Mohd-Mohsin-CV.pdf'),
  },
  in: {
    location: 'New Delhi, India',
    city: 'New Delhi',
    timezone: 'Asia/Kolkata',
    tz: 'IST',
    status: 'Available for work',
    phone: '+91 93196 17848',
    cv: asset('/cv/Mohd-Mohsin-CV-India.pdf'),
  },
}
const region = regions[globalThis.document?.documentElement.dataset.region] ?? regions.ae

export const site = {
  name: 'Mohsin',
  fullName: 'Mohd Mohsin',
  nameAr: 'محسن',
  ...region,
  email: 'mohsinxaifi@gmail.com',
  title: 'Full-Stack Developer / Software Developer',
  portrait: asset('/me.webp'),

  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mohsinxaifi' },
    { label: 'GitHub', url: 'https://github.com/mohsinxaifii' },
  ],

  /* Contact form delivery. Each message goes to both at once and counts as
     sent when either one gets it. `sheetUrl` is the Web app URL of
     scripts/enquiry-inbox.gs (saves every message to your Google Sheet and
     emails you); FormSubmit relays to `email` above as the backup. */
  enquiry: {
    sheetUrl: '',
  },

  /* Umami Cloud (cloud.umami.is): paste the Website ID from Settings ->
     Websites. Empty turns analytics off. It only loads in production
     builds, and only counts visits on `domains`. */
  analytics: {
    umamiId: 'a07b98d2-591a-40db-8632-38449a7d0f32',
    domains: 'mohsinxaifii.github.io',
  },
}

/* Impact line: the proof as one sentence instead of a row of stats.
   *Starred* words are the highlights. Every claim is one the CV supports. */
export const impact =
  'Storefronts rebuilt from the ground up until they *convert*. '
  + 'A whole *shelf* of live sites, designed, built and shipped. '
  + 'Commerce run *end to end*, from first pixel to checkout. '
  + 'And the *systems* behind the store - ERPs, inventory, operations - built solo, from scratch.'

/* Draggable stickers. `at` is where each starts inside the section named
   by `in`: [x as % of the section width, y in px from its top]. Pixels
   for y keep them in the whitespace above each headline. */
export const stickers = [
  { text: 'certified shipper', tone: 'lime', in: 'hero', at: [74, 150], rot: 8 },
  { text: 'receipts on request', tone: 'ink', in: 'impact', at: [84, 18], rot: -6 },
  { text: 'touch grass later', tone: 'pink', in: 'work', at: [48, 64], rot: 5 },
  { text: 'liquid? i speak it', tone: 'lime', in: 'experience', at: [58, 70], rot: -8 },
  { text: 'ctrl+z enjoyer', tone: 'blue', in: 'stack', at: [76, 64], rot: 7 },
  { text: 'it works on prod ✦', tone: 'pink', in: 'contact', at: [62, 150], rot: -5 },
]

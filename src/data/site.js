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
    phone: '+971 55 780 5809',
    cv: asset('/cv/Mohd-Mohsin-CV.pdf'),
  },
  in: {
    location: 'New Delhi, India',
    city: 'New Delhi',
    timezone: 'Asia/Kolkata',
    phone: '+91 93196 17848',
    cv: asset('/cv/Mohd-Mohsin-CV-India.pdf'),
  },
}
const region = regions[globalThis.document?.documentElement.dataset.region] ?? regions.ae

export const site = {
  name: 'Mohsin',
  fullName: 'Mohd Mohsin',
  ...region,
  email: 'mohsinxaifi@gmail.com',
  title: 'Full-Stack Developer / Software Developer',
  portrait: asset('/me.webp'),

  roles: ['Full-stack developer', 'Shopify engineer', 'Automation builder'],

  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mohsinxaifi' },
    { label: 'GitHub', url: 'https://github.com/mohsinxaifii' },
  ],
}

/* Odometer row. Every number is one the CV supports. */
export const counters = [
  { value: 8, suffix: 'x', label: 'Conversion lift after a ground-up storefront rebuild' },
  { value: 18, suffix: '', label: 'Live sites designed, built and shipped' },
  { value: 3, suffix: '+', label: 'Years building commerce end to end' },
  { value: 1, suffix: '', label: 'Company ERP built solo, from scratch' },
]

/* Draggable stickers. `at` is where each starts inside the section named
   by `in`: [x as % of the section width, y in px from its top]. Pixels
   for y keep them in the whitespace above each headline. */
export const stickers = [
  { text: 'certified shipper', tone: 'lime', in: 'hero', at: [74, 150], rot: 8 },
  { text: 'no cap: 8x', tone: 'ink', in: 'impact', at: [84, 18], rot: -6 },
  { text: 'touch grass later', tone: 'pink', in: 'work', at: [80, 64], rot: 5 },
  { text: 'liquid? i speak it', tone: 'lime', in: 'experience', at: [58, 70], rot: -8 },
  { text: 'ctrl+z enjoyer', tone: 'blue', in: 'stack', at: [76, 64], rot: 7 },
  { text: 'it works on prod ✦', tone: 'pink', in: 'contact', at: [62, 150], rot: -5 },
]

/* ==================================================================
   SITE CONTENT - edit this file, not the HTML.

   Everything identity-shaped lives here: name, location, roles, bio,
   contact, socials. The wordmark, page titles, nav and footer all read
   from it, so changing your name is a one-line edit.

   Content is taken from the CV. The image slots are null: the files
   that were in them are photographs of the designer whose site this
   layout was replicated from, and a stranger's face standing in for
   yours is worse than an empty frame. A hatched placeholder renders at
   the right aspect ratio until you drop your own in - see REFERENCE.md.
   ================================================================== */

export const site = {
  // The giant wordmark on the index page. Short reads best - it is set
  // at 31vw and fitted down by js/fit.js if it runs long.
  wordmark: 'Mohsin',

  fullName: 'Mohd Mohsin',
  location: 'Dubai, UAE',
  email: 'mohsinxaifi@gmail.com',

  // Cut-out portrait for the intro block. Drop a file in /public/ and
  // point at it, e.g. '/portrait.png'. It is multiply-blended into the
  // paper, so a PNG on a white or transparent ground works best.
  portrait: null,

  // Smaller cut-out in the intro's left column, under the headline.
  figure: null,

  // Wide plate under the Upcoming column.
  processFigure: null,

  // Two-line headline under the wordmark. The second line is the big one.
  headline: {
    lead: 'Full-stack',
    emphasis: 'Developer!',
  },

  // The drop-cap intro paragraph.
  intro:
    'I take end-to-end ownership of a business’s digital operation - the ' +
    'storefront customers see, the internal systems behind it, and the AI and ' +
    'automation layer that connects the two.',

  // The stacked role list. The last entry renders with the location rule.
  roles: [
    'Full-stack developer',
    'Shopify engineer',
    'Automation builder',
  ],

  // "Think, Create, Deliver" block.
  process: {
    lead: 'Build, Ship',
    emphasis: 'Measure',
    intro:
      'Work is worth what it moves. I build storefronts and the systems behind ' +
      'them, then measure whether the numbers actually changed.',
    body:
      'A rebuilt storefront that cut load times and lifted conversion eightfold. ' +
      'An internal ERP delivered solo, replacing manual process across every ' +
      'department. AI assistants that answer product questions and qualify leads ' +
      'without a human in the loop. The through-line is ownership: architecture ' +
      'to deployment, and the reporting that proves it worked.',
  },

  // The three-word slab above the awards testimonials.
  slab: {
    one: 'The',
    two: 'full',
    three: 'stack',
    four: 'artisan',
  },

  slabBody: {
    before: 'Three years building commerce systems end to end, from storefront ',
    link: 'to ERP to automation',
    after: ', currently owning the entire technology function at ',
    heading: 'Design Dimensions',
    tail: 'Shopify, Node, AWS, and the AI layer that ties the operation together.',
  },

  footer: {
    marquee: "Let's build something that ships",
    cta: 'Email Me',
    year: new Date().getFullYear(),
  },

  socials: [
    { label: 'linkedin', url: 'https://linkedin.com/in/mohsinxaifi' },
    { label: 'github', url: 'https://github.com/mohsinxaifii' },
    { label: 'email', url: 'mailto:mohsinxaifi@gmail.com' },
  ],
}

/* The counters on the index page. Keep to four - the row is a 4-up grid.
   Every number here is one the CV actually supports. */
export const counters = [
  { label: 'Conversion', title: 'Lifted', value: '8x' },
  { label: 'Years', title: 'Building', value: '3+' },
  { label: 'Roles', title: 'Shipped', value: '5' },
  { label: 'ERPs', title: 'Delivered', value: '1' },
]

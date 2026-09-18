/* ==================================================================
   SITE CONTENT - edit this file, not the HTML.

   Everything identity-shaped lives here: name, location, roles, bio,
   contact, socials. The wordmark, page titles, nav and footer all read
   from it, so changing your name is a one-line edit.

   PLACEHOLDER values are marked. Replace them with your CV details.
   ================================================================== */

export const site = {
  // The giant wordmark on the index page. Short reads best - it is set
  // at 36vw, so anything past ~9 characters will need the size tuned in
  // home.css (.wordmark font-size).
  wordmark: 'Mohsin',           // PLACEHOLDER

  fullName: 'Mohsin',           // PLACEHOLDER
  location: 'Your City, XX',    // PLACEHOLDER
  email: 'mohsinxaifi@gmail.com',

  // Cut-out portrait for the intro block. Drop a file in /public/ and
  // point at it, e.g. '/portrait.png'. It is multiply-blended into the
  // paper, so a PNG on a white or transparent ground works best.
  portrait: '/ref/site/avatar-1.jpeg',

  // Smaller cut-out in the intro's left column, under the headline.
  figure: '/ref/site/avatar-star.jpeg',

  // Wide plate under the Upcoming column.
  processFigure: '/ref/site/avatar-2.jpeg',

  // Two-line headline under the wordmark. The second line is the big one.
  headline: {
    lead: 'Interactive',        // PLACEHOLDER
    emphasis: 'Developer!',     // PLACEHOLDER
  },

  // The drop-cap intro paragraph.
  intro:
    'As a multidisciplinary developer, I build digital products that ' +
    'pair considered interface design with the engineering to back it ' +
    'up - for teams and clients wherever they are.',  // PLACEHOLDER

  // The stacked role list. The last entry renders with the location rule.
  roles: [
    'Full-stack developer',     // PLACEHOLDER
    'Interface engineer',       // PLACEHOLDER
    'Creative technologist',    // PLACEHOLDER
  ],

  // "Think, Create, Deliver" block.
  process: {
    lead: 'Think, Create',
    emphasis: 'Deliver',
    intro:
      'A strong project is created by deep collaboration. I design, ' +
      'build and ship products that hold up in production.',  // PLACEHOLDER
    body:
      'Like an artisan, I like to start from raw matter and give life to ' +
      'a product that makes your work stand out - starting from a clear ' +
      'strategy that guides every decision that follows.',    // PLACEHOLDER
  },

  // The three-word slab above the awards testimonials.
  slab: {
    one: 'The',
    two: 'pixel',
    three: 'perfect',
    four: 'artisan',
  },

  slabBody: {
    before: 'Over the past few years I have worked with teams and clients globally, earning ',
    link: 'mentions & recognition',
    after: ' across the industry, on platforms like ',   // PLACEHOLDER
    heading: 'Awwwards',                                  // PLACEHOLDER
    tail: 'Communication Arts, Site Inspire, Behance, Codrops and many others.',
  },

  footer: {
    marquee: "Let's create something together",
    cta: 'Email Me',
    year: new Date().getFullYear(),
  },

  socials: [
    { label: 'github', url: 'https://github.com/' },        // PLACEHOLDER
    { label: 'linkedin', url: 'https://linkedin.com/in/' }, // PLACEHOLDER
    { label: 'twitter', url: 'https://twitter.com/' },      // PLACEHOLDER
    { label: 'dribbble', url: 'https://dribbble.com/' },    // PLACEHOLDER
  ],
}

/* The counters on the index page. Keep to four - the row is a 4-up grid. */
export const counters = [
  { label: 'Projects', title: 'Shipped', value: '12' },   // PLACEHOLDER
  { label: 'Years', title: 'Building', value: '5' },      // PLACEHOLDER
  { label: 'Clients', title: 'Served', value: '8' },      // PLACEHOLDER
  { label: 'Open source', title: 'Releases', value: '4' },// PLACEHOLDER
]

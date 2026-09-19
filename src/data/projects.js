/* ==================================================================
   PROJECTS

   One entry per case study. `slug` becomes /work/<slug>.
   scripts/gen-cases.mjs wipes and regenerates /work on every dev and
   build run, so adding or removing an entry here is all it takes.

   `featured: true` puts it in the index carousel.
   `upcoming: true` puts it in the "Upcoming Next" slot (pick one).

   Every image slot is null. The artwork that was here is the client
   work of the designer whose site this layout was replicated from -
   Prada, AvroKO, WOW Concept and others - and pairing those screenshots
   with your own project names is a claim you cannot support. Null
   renders a hatched placeholder at the right aspect ratio, so the
   layout holds until your own screenshots go in:

     thumb: '/work/ayurveda/thumb.jpg',
     gallery: ['/work/ayurveda/01.jpg', '/work/ayurveda/02.jpg'],

   The five entries below are the real engagements from the CV. The
   background and story fields carry what the CV states; expand them
   with specifics only you know.
   ================================================================== */

export const projects = [
  {
    slug: 'ayurveda-storefront',
    title: 'Storefront Rebuild',
    client: 'The Ayurveda Co.',
    year: '2024',
    isNew: false,
    featured: true,
    upcoming: false,
    role: 'Full-stack development',
    stack: ['Shopify', 'Liquid', 'JavaScript', 'Core Web Vitals'],
    url: null,
    thumb: null,
    thumbAlt: null,
    logo: null,
    description:
      'A complete storefront rebuild on a custom theme that sharply cut page '
      + 'load times and drove an 8x increase in conversion rate.',
    background:
      'The existing store was slow enough that performance was costing sales. '
      + 'The brief was a rebuild from scratch on a custom theme rather than '
      + 'another round of patching, with Core Web Vitals and the customer '
      + 'journey treated as the measures of success.',
    story:
      'Rebuilt the theme from the ground up, then worked with product and '
      + 'marketing to tighten the journey end to end. Integrated third-party '
      + 'marketing tools, subscription models and advanced tracking pixels so '
      + 'attribution and engagement could actually be read. Conversion rate '
      + 'finished 8x higher than the store it replaced.',
  },
  {
    slug: 'oyela-erp',
    title: 'Internal ERP',
    client: 'Oyela Technologies',
    year: '2026',
    isNew: true,
    featured: true,
    upcoming: false,
    role: 'Sole developer',
    stack: ['Node.js', 'MySQL', 'REST APIs', 'AWS'],
    url: null,
    thumb: null,
    thumbAlt: null,
    logo: null,
    description:
      'A company-wide ERP built from scratch, replacing manual processes and '
      + 'streamlining daily operations across departments.',
    background:
      'Operations ran on manual process spread across teams, with no single '
      + 'system holding them. The company needed one built from nothing, by one '
      + 'developer, without pausing the work it was replacing.',
    story:
      'Designed the schema and system architecture, then built and deployed the '
      + 'ERP department by department. Partnered with the data and business '
      + 'intelligence teams on internal reporting, and separately optimised the '
      + 'company Shopify storefront for performance and conversion.',
  },
  {
    slug: 'studio-ai-assistants',
    title: 'AI Assistants & Sales Analytics',
    client: 'Design Dimensions',
    year: '2026',
    isNew: true,
    featured: true,
    upcoming: true,
    role: 'Technical lead',
    stack: ['OpenAI', 'Claude', 'Node.js', 'Workflow Automation'],
    url: null,
    thumb: null,
    thumbAlt: null,
    logo: null,
    description:
      'AI chat assistants trained on studio and client data that answer product '
      + 'queries, qualify inbound leads and resolve first-line support unaided.',
    background:
      'The studio carries a full client portfolio and no separate technical '
      + 'function. Support and lead qualification were taking time from people '
      + 'whose work was design and production.',
    story:
      'Built and deployed assistants trained on studio and client data, handling '
      + 'product questions and first-line support without escalation. Alongside '
      + 'them, designed sales tracking and analytics giving leadership real-time '
      + 'visibility into pipeline, revenue attribution and campaign performance.',
  },
  {
    slug: 'radiant-commerce',
    title: 'Custom Commerce Builds',
    client: 'Radiant Web Tech',
    year: '2025',
    isNew: false,
    featured: true,
    upcoming: false,
    role: 'Lead developer',
    stack: ['Shopify Admin API', 'Headless', 'Middleware', 'AJAX API'],
    url: null,
    thumb: null,
    thumbAlt: null,
    logo: null,
    description:
      'End-to-end delivery on custom e-commerce builds - architecture, backend '
      + 'workflows and headless implementations - while leading the team shipping them.',
    background:
      'A run of custom commerce builds, each needing technical architecture set '
      + 'before development started, and a team to be pointed at it. Client '
      + 'relationships sat with the same person owning delivery.',
    story:
      'Owned architecture, development and launch across builds, writing advanced '
      + 'backend workflows, custom middleware and headless implementations against '
      + 'the Shopify Admin, REST and AJAX APIs. Mentored a cross-functional team '
      + 'and translated commercial goals into technical milestones directly with '
      + 'clients, designers and marketers.',
  },
  {
    slug: 'lppr-site',
    title: 'Marketing Site',
    client: 'LPPR',
    year: '2023',
    isNew: false,
    featured: false,
    upcoming: false,
    role: 'Development & design',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Figma'],
    url: null,
    thumb: null,
    thumbAlt: null,
    logo: null,
    description:
      'A responsive, accessible, SEO-optimised site delivered end to end from '
      + 'Figma and Illustrator layouts.',
    background:
      'A design handoff that needed taking all the way to production, with '
      + 'accessibility and search visibility part of the brief rather than a '
      + 'later pass.',
    story:
      'Translated the Figma and Illustrator layouts into scalable production '
      + 'code, responsive across breakpoints and built to be accessible and '
      + 'indexable from the first deploy.',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
export const upcomingProject = projects.find((p) => p.upcoming) ?? projects[0]

export function projectBySlug(slug) {
  return projects.find((p) => p.slug === slug) ?? null
}

/** The project after this one, wrapping at the end - used by "Next project". */
export function nextProject(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return projects[0]
  return projects[(i + 1) % projects.length]
}

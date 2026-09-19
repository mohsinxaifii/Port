/* ==================================================================
   CV - drives the /about page.

   Four blocks, in page order:
     recognition  the awards/recognition slider
     experience   work history
     press        talks, interviews, features (numbered list)
     testimonials the stacked quote cards on the index page

   Content here is taken from the CV. Three arrays are deliberately
   empty - recognition, press and testimonials - because the CV records
   no awards, no published pieces and no quotes, and inventing any of
   them is the one kind of placeholder that cannot be safely left in.
   Each empty array hides its own section; fill one and it reappears.
   ================================================================== */

export const availability = {
  headline: 'Open to',
  emphasis: 'new opportunities!',
  status: 'Available now',
  body:
    "Whether you're looking for someone to build a storefront, the systems " +
    'behind it, or the automation that connects them, you can reach me by clicking',
  linkLabel: 'here',
}

export const bio = {
  short:
    'Full-stack developer working across storefronts, internal systems and ' +
    'the AI layer that connects them.',
  long:
    "Full-stack developer trusted with end-to-end ownership of a business's " +
    'digital operation: the customer-facing storefront, the internal systems ' +
    'behind it, and the AI and automation layer that ties them together. ' +
    'Three years shipping work that moves commercial numbers.',
}

/* Recognition / awards. Empty is fine - the section hides itself.
   Nothing in the CV to put here; add real entries when you have them. */
export const recognition = []

/* Work history, newest first. `current: true` renders the live marker. */
export const experience = [
  {
    role: 'Software Developer',
    org: 'Design Dimensions',
    from: 'Jul 2026',
    to: 'Present',
    current: true,
    clients: ['Full client portfolio'],
    summary:
      'Sole technical decision-maker for the studio and every client account - ' +
      'architecture, build, integration and optimisation, plus AI chat assistants ' +
      'and the sales analytics behind them.',
  },
  {
    role: 'Software Developer',
    org: 'Oyela Technologies',
    from: 'Apr 2026',
    to: 'Jul 2026',
    current: false,
    clients: [],
    summary:
      'Built the internal ERP from scratch, replacing manual processes across ' +
      'departments, and optimised the company Shopify storefront for performance ' +
      'and conversion.',
  },
  {
    role: 'Lead Software Developer',
    org: 'Radiant Web Tech',
    from: 'Jul 2024',
    to: 'Apr 2026',
    current: false,
    clients: [],
    summary:
      'Led end-to-end delivery on custom e-commerce builds while mentoring a ' +
      'cross-functional team and owning client relationships directly.',
  },
  {
    role: 'Full Stack Web Developer',
    org: 'The Ayurveda Co.',
    from: 'Aug 2023',
    to: 'Jul 2024',
    current: false,
    clients: [],
    summary:
      'Rebuilt the storefront from scratch on a custom theme, sharply cutting ' +
      'load times and driving an 8x increase in conversion rate.',
  },
  {
    role: 'Web Developer & Designer',
    org: 'LPPR',
    from: 'Feb 2023',
    to: 'May 2023',
    current: false,
    clients: [],
    summary:
      'Delivered a responsive, accessible, SEO-optimised site end to end, ' +
      'translating Figma and Illustrator layouts into production code.',
  },
]

export const education = [
  {
    qualification: 'Bachelor of Computer Applications',
    org: 'IGNOU',
    from: '2023',
    to: '2026',
  },
  {
    qualification: 'Higher Secondary School',
    org: 'S.B.V. Noor Nagar',
    from: '2021',
    to: '2023',
  },
  {
    qualification: 'Secondary School',
    org: 'J.N. International School',
    from: '2019',
    to: '2021',
  },
]

export const skills = [
  {
    group: 'E-commerce',
    items: [
      'Shopify Theme Development', 'Custom Shopify Development', 'Liquid',
      'Admin API', 'Storefront API', 'Shopify Apps', 'Metafields',
      'Headless Commerce', 'Checkout', 'Subscriptions',
    ],
  },
  {
    group: 'Development',
    items: [
      'JavaScript (ES6+)', 'React', 'HTML5', 'CSS3', 'AJAX', 'Node.js',
      'REST APIs', 'Webhooks', 'MySQL', 'System Architecture', 'ERP Systems',
    ],
  },
  {
    group: 'AI & Automation',
    items: [
      'OpenAI', 'Claude', 'AI Assistants', 'Prompt Engineering',
      'LLM Integration', 'Workflow Automation', 'Lead Qualification',
    ],
  },
  {
    group: 'Design & UX',
    items: [
      'Figma', 'Adobe Illustrator', 'UI Design', 'UX Design',
      'Responsive Design', 'Design Systems', 'Wireframing', 'Prototyping',
    ],
  },
  {
    group: 'Cloud',
    items: ['AWS EC2', 'AWS RDS', 'Linux', 'Deployment', 'DNS', 'Production'],
  },
  {
    group: 'Performance',
    items: [
      'Conversion Rate Optimisation', 'Website Audits', 'A/B Testing', 'GA4',
      'Core Web Vitals', 'Attribution', 'Customer Journey Analysis',
    ],
  },
  {
    group: 'Languages',
    items: ['English', 'Hindi', 'Urdu'],
  },
]

/* Press, talks, interviews. Empty hides the section. */
export const press = []

/* The stacked quote cards on the index.

   Empty on purpose. The slots previously held invented quotes attached to
   photographs of three real, named designers, which reads as a fabricated
   endorsement - the hardest kind of placeholder to walk back once it is
   live. Ask past colleagues for real ones; each needs quote, name and role,
   and `avatar` may be null for a monogram. */
export const testimonials = []

/* Places the work was done. Employers, not clients won independently. */
export const clients = [
  'Design Dimensions',
  'Oyela Technologies',
  'Radiant Web Tech',
  'The Ayurveda Co.',
]

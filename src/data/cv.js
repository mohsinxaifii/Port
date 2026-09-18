/* ==================================================================
   CV - drives the /about page.

   Four blocks, in page order:
     recognition  the awards/recognition slider
     experience   work history
     press        talks, interviews, features (numbered list)
     testimonials the stacked quote cards on the index page
   ================================================================== */

export const availability = {
  headline: 'Looking for',
  emphasis: 'new opportunities!',
  status: 'Available now',                                  // PLACEHOLDER
  body:
    "Whether you're looking for someone to build a project - or have a " +
    'full-time role in mind, you can reach me by clicking',
  linkLabel: 'here',
}

export const bio = {
  short:
    'Independent developer with a focus on interface engineering, ' +
    'motion and product design.',                           // PLACEHOLDER
  long:
    'As a multidisciplinary developer, I care about building things that ' +
    'are as considered under the hood as they are on the surface.',
}

/* Recognition / awards. Empty is fine - the section hides itself. */
export const recognition = [
  { org: 'Award or platform', year: '2026', detail: 'What it was for' }, // PLACEHOLDER
  { org: 'Award or platform', year: '2025', detail: 'What it was for' },
  { org: 'Award or platform', year: '2025', detail: 'What it was for' },
]

/* Work history. `current: true` renders the live marker. */
export const experience = [
  {
    role: 'Independent / Freelance',                        // PLACEHOLDER
    org: 'Self-employed',
    from: '2023',
    to: 'Present',
    current: true,
    clients: ['Client A', 'Client B', 'Client C'],
    summary: 'What you do in this role, in one line.',
  },
  {
    role: 'Previous Role',                                  // PLACEHOLDER
    org: 'Company Name',
    from: '2021',
    to: '2023',
    current: false,
    clients: [],
    summary: 'What you did there, in one line.',
  },
]

export const education = [
  {
    qualification: 'Your Degree',                           // PLACEHOLDER
    org: 'Institution',
    from: '2017',
    to: '2021',
  },
]

export const skills = [
  { group: 'Languages', items: ['JavaScript', 'TypeScript', 'Python'] },     // PLACEHOLDER
  { group: 'Frontend', items: ['React', 'Next.js', 'GSAP', 'WebGL'] },
  { group: 'Backend', items: ['Node', 'PostgreSQL', 'REST', 'GraphQL'] },
  { group: 'Tooling', items: ['Git', 'Docker', 'CI/CD', 'Figma'] },
]

/* Press, talks, interviews. Rendered as a numbered list. */
export const press = [
  { source: 'Publication', year: '2026', title: 'Title of the piece', url: '#' }, // PLACEHOLDER
  { source: 'Publication', year: '2025', title: 'Title of the piece', url: '#' },
]

/* The stacked quote cards. Three or four reads best. Photos optional -
   a monogram placeholder renders when `avatar` is null. */
export const testimonials = [
  {
    quote:
      'A quote from someone you have worked with. Real ones land far ' +
      'harder than invented ones - ask for these before you launch.',
    name: 'Their Name',                                     // PLACEHOLDER
    role: 'Their Role',
    org: null,
    orgUrl: null,
    avatar: '/ref/site/sam-day.jpg',
  },
  {
    quote: 'A second quote goes here.',
    name: 'Their Name',
    role: 'Their Role',
    org: null,
    orgUrl: null,
    avatar: '/ref/site/sofia-papadopoulou.jpg',
  },
  {
    quote: 'A third quote goes here.',
    name: 'Their Name',
    role: 'Their Role',
    org: null,
    orgUrl: null,
    avatar: '/ref/site/bruno-arizio.jpg',
  },
]

export const clients = ['Client A', 'Client B', 'Client C', 'Client D']  // PLACEHOLDER

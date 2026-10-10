/* ==================================================================
   PROJECTS

   One entry per case study, in display order. `slug` becomes
   /work/<slug>. scripts/gen-cases.mjs wipes and regenerates /work on
   every dev and build run, so adding or removing an entry here is all
   it takes.

   Order is hand-picked and is the order the site shows. The first four
   are featured.

   `featured: true` puts it on the index (the first four fill the lead
   block and the closing strip).
   `market` (optional) tags work for a client outside India, e.g. Dubai.
   `live: false` hides the outbound links for work that isn't on its
   domain yet (`url` still feeds the browser bar).
   `upcoming: true` puts it in the "Upcoming Next" slot (pick one).

   Images live in public/work/<slug>/: thumb.jpg is 5:2 (card + case
   hero), gallery-*.jpg are 16:9 desktop captures of the live site.
   `year` is optional - null hides it everywhere.
   ================================================================== */

import { asset } from './asset.js'

const ROLE = 'Design, development & delivery'
const SHOPIFY = ['Shopify', 'Liquid', 'JavaScript', 'CSS']

// Every project follows the same image layout, so build the paths once.
const shots = (slug, count = 3) => ({
  thumb: asset(`/work/${slug}/thumb.jpg`),
  gallery: Array.from({ length: count }, (_, i) => asset(`/work/${slug}/gallery-${i + 1}.jpg`)),
})

export const projects = [
  {
    slug: 'the-bikaneri-kitchen',
    title: 'The Bikaneri Kitchen',
    client: 'The Bikaneri Kitchen',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://thebikanerikitchen.com',
    ...shots('the-bikaneri-kitchen', 4),
    thumbAlt: 'The Bikaneri Kitchen - campaign portraits with the bhujia thali and red tin',
    logo: null,
    description:
      'A heritage storefront for Bikaneri bhujia - a story-led Shopify build '
      + 'that sells a snack with 150 years of history behind it.',
    background:
      'Bikaneri bhujia traces back to the royal kitchen of Maharaja Dungar '
      + 'Singh in 1877, and the brand makes it the old way: slow-cooked in a '
      + 'bhatti, by hand, in small batches. The challenge was a shop that felt '
      + 'like that history rather than a packet on a grocery shelf.',
    story:
      'Built on Shopify with a deep maroon-and-parchment system, woodcut-style '
      + 'illustration and serif type that let the product read as an heirloom. '
      + 'Products sit inside the narrative - Paraat Bhujia and Handmade Bhujia '
      + 'each get their own editorial plate with add-to-cart built in - '
      + 'alongside The Bhandaar shop, a Rituals journal, the Archive and '
      + 'Behind the Craft profiles of the karigars who make it.',
  },
  {
    slug: 'solethreads',
    title: 'Solethreads',
    client: 'Solethreads',
    year: null,
    isNew: true,
    featured: true,
    upcoming: false,
    role: 'Research, design & development',
    stack: SHOPIFY,
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://solethreads.com',
    ...shots('solethreads'),
    thumbAlt: 'Solethreads - "We bring in the sneaker revolution" campaign section',
    logo: null,
    description:
      'A full revamp of an Indian footwear brand - sneakers, slides and '
      + 'clogs - with a loud, streetwear-first Shopify store built mobile-first.',
    background:
      'Solethreads sells everything from everyday slides to limited sneaker '
      + 'drops, across several sub-brands like Gelatoe and Marshmellow. The old '
      + 'store treated them all the same, so the drops had no hype and the '
      + 'comfort lines had no personality. I led the research, then designed '
      + 'and built the whole thing.',
    story:
      'Designed mobile-first at 375px, then adapted for desktop: a homepage '
      + 'with "What’s Hot" rails and drop countdowns, a sneaker landing page '
      + 'split into high tops, low tops and canvas, and a dedicated world for '
      + 'each comfort line - Gelatoe gets melting-ice-cream drips. Behind it: '
      + 'filterable listings, a size guide, product pages with care '
      + 'instructions and reviews, a community page and the full account area.',
  },
  {
    slug: 'kachori-story',
    title: 'The Kachori Story',
    client: 'The Kachori Story',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: ['React', 'Vite', 'JavaScript', 'CSS animation'],
    url: 'https://kachoristory.com',
    ...shots('kachori-story'),
    // Illustrated cover: people round a table sharing kachoris. Cropped
    // from 30% down so the headline and the plate both stay in frame.
    thumb: asset('/work/kachori-story/cover.jpg'),
    thumbPosition: '50% 30%',
    thumbAlt: 'The Kachori Story illustration: "From the heart of the streets to your table", a row of people sharing kachoris, chai and samosas',
    logo: null,
    description:
      'A custom-built site for a Gurugram street-food brand - an appetite-first '
      + 'menu that carries the brand’s hand-drawn, playful identity from the '
      + 'counter onto the screen.',
    background:
      'The Kachori Story serves Rajasthani and North Indian street food - '
      + 'kachoris, chaat, thalis, sharbats - out of Gurugram, with a franchise '
      + 'programme looking to take it further. The brand already had a loud, '
      + 'illustrated personality, and a stock template would have flattened it '
      + 'into another restaurant listing.',
    story:
      'Designed and built from scratch in React on Vite rather than on a theme, '
      + 'so every section could be art-directed: full-bleed food, a yellow-and-'
      + 'black menu that reads like the packaging, and the street-scene '
      + 'illustration that closes the page. Recommended dishes, the full menu, '
      + 'the brand story and a dedicated franchise route sit behind a single '
      + 'navigation, turning the site into both a menu and a lead channel.',
  },
  {
    slug: 'the-trost',
    title: 'The Trost',
    client: 'The Trost',
    year: null,
    isNew: false,
    featured: true,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://thetrost.com',
    ...shots('the-trost'),
    thumbAlt: 'The Trost - Hemp Based Wellness hero over cannabis leaves',
    logo: null,
    description:
      'A premium storefront for a New Delhi hemp-wellness brand - cinematic, '
      + 'dark and calm, built to make a new category feel trustworthy.',
    background:
      'The Trost sells cannabis-leaf-extract gummies, hemp herbal smokes, oils '
      + 'and hemp nutrition in a market where most shoppers are meeting the '
      + 'category for the first time. “Trost” is German for solace, and the '
      + 'brand pairs Ayurvedic wisdom with Swiss formulation - the site had to '
      + 'carry that calm, and the credibility, at the same time.',
    story:
      'A Shopify build on a near-black palette with full-bleed foliage, restrained '
      + 'type and warm orange product cards. A Find Your Calm Ritual section '
      + 'guides first-timers, sub-brands like Mello and Kosha get room of '
      + 'their own, and the site extends past the shop into a journal, '
      + 'partner enquiries and a store locator for offline stockists.',
  },
  {
    slug: 'rasayanam',
    title: 'Rasayanam',
    client: 'Rasayanam',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://rasayanam.in',
    ...shots('rasayanam'),
    thumbAlt: 'Rasayanam - Feel the calm, see the change - ashwagandha hero',
    logo: null,
    description:
      'A high-volume Shopify store for a clean-supplements brand trusted by '
      + 'over ten lakh customers - built to convert, and to prove what’s in '
      + 'the bottle.',
    background:
      'Rasayanam makes vegetarian, purity-tested supplements - ashwagandha, '
      + 'magnesium, shilajit and more - and sells them at scale, with a 4.5 star '
      + 'rating across more than 20,000 reviews. In a category full of '
      + 'questionable claims, the site had to sell hard and earn trust at once.',
    story:
      'A Shopify storefront where shoppers start from how they feel: a '
      + 'shop-by-concern rail answers “what’s stopping you from feeling your '
      + 'best?” before it shows a single SKU. Build-your-own-box bundles, a '
      + 'Verify Order page and review-led social proof run through every page.',
  },
  {
    slug: 'zinara',
    title: 'Zinara',
    client: 'Zinara',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://zinara.in',
    ...shots('zinara'),
    thumbAlt: 'Zinara - Double Take, two stones in 18K gold vermeil',
    logo: null,
    description:
      'A soft, editorial Shopify store for a lab-grown diamond jewellery brand - '
      + 'certified stones, everyday pieces, easy to shop.',
    background:
      'Zinara makes lab-grown diamond jewellery certified by IGI and SGL and '
      + 'hallmarked by BIS, designed to be worn every day. Buying diamonds '
      + 'online asks for a lot of trust, so certification had to sit as close '
      + 'to the product as the price.',
    story:
      'Built on Shopify in blush and wine, with campaign heroes, a shop-by-'
      + 'category row and filterable collection pages for rings, earrings, '
      + 'pendants and bracelets. The Zinara Experience strip - certified '
      + 'diamonds, lifetime exchange, insured shipping - sits under the fold '
      + 'where hesitation usually starts.',
  },
  {
    slug: 'beyond-beyond',
    title: 'Beyond Beyond',
    client: 'Beyond Beyond Skincare',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://beyondbeyond.co.in',
    ...shots('beyond-beyond'),
    thumbAlt: 'Beyond Beyond - clean clinical skincare, About hero',
    logo: null,
    description:
      'The launch storefront for India’s first NAD+ skincare line - clean, '
      + 'clinical and built around shopping by skin concern.',
    background:
      'Beyond Beyond brought NAD+ skincare to India for the first time - a '
      + 'science-first ingredient most customers had never heard of. The site '
      + 'had to introduce the ingredient, and still make choosing a product '
      + 'simple.',
    story:
      'A Shopify build on a white, clinical system with the brand’s orange '
      + 'packaging doing the colour work. Navigation splits by concern, '
      + 'bestsellers and sets, a dedicated NAD+ section explains the science, '
      + 'and a “No Nasties. No Compromises.” free-from strip answers the '
      + 'ingredient questions before they are asked.',
  },
  {
    slug: 'design-dimensions',
    title: 'Design Dimensions',
    client: 'Design Dimensions',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://designdimensions.in',
    ...shots('design-dimensions', 2),
    thumbAlt: 'Design Dimensions - homepage with Snack Factory packaging',
    logo: null,
    description:
      'A holding site for a branding and packaging studio that still shows the '
      + 'work - a portfolio carousel carrying the studio while its full site is rebuilt.',
    background:
      'Design Dimensions is a branding, packaging and space-design studio with '
      + 'clients from Suryagarh to CATCH. While its full site is rebuilt, '
      + 'a bare “coming soon” page would have hidden the studio’s best asset: '
      + 'the portfolio.',
    story:
      'Hand-built in HTML, CSS and GSAP: an animated preloader, a looping '
      + 'discipline ticker and a “Design is, As Design Does” headline, over a '
      + 'running carousel of case cards - identity, packaging, campaigns and '
      + 'spaces - each with a one-line brief - a holding page that is still a '
      + 'real portfolio.',
  },
  {
    slug: 'twisty-designs',
    title: 'Twisty Designs',
    client: 'Twisty Designs',
    year: null,
    isNew: false,
    featured: false,
    upcoming: true,
    role: ROLE,
    stack: ['Webflow', 'JavaScript', 'Interactions'],
    url: 'https://www.twistydesigns.co',
    ...shots('twisty-designs'),
    thumbAlt: 'Twisty Designs - See it, want it, buy it',
    logo: null,
    description:
      'A kinetic Webflow site for an e-commerce design agency working across '
      + 'India, Germany and the USA - loud type, live marquees, zero boredom.',
    background:
      'Twisty helps e-commerce brands sell with product personalisation, '
      + 'visualisation, branding and performance creative. An agency that '
      + 'promises to make other brands’ products irresistible needed a site '
      + 'that proved it in the first scroll.',
    story:
      'Built in Webflow on a black-and-lime system with oversized condensed '
      + 'type, scrolling marquees and a “See it, want it, buy it!” voice that '
      + 'runs through the copy. Service pages, 150-plus portfolio projects, the '
      + 'team of designers who code and a consultation booking flow each get '
      + 'their own section, with a call to action never far away.',
  },
  {
    slug: 'niche-star-advertising',
    title: 'Niche Star',
    client: 'Niche Star Advertising',
    year: null,
    market: 'Dubai, UAE',
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://nichestaradvertising.com',
    ...shots('niche-star-advertising'),
    thumbAlt: 'Niche Star - Advertising, events, visual merchandising and retail displays',
    logo: null,
    description:
      'A bold, motion-led site for the production arm of Niche Marketing '
      + 'Management - displays, events, fabrication and print.',
    background:
      'Niche Star builds the physical side of advertising - point-of-sale '
      + 'displays, gondola ends, exhibition branding, signage and large-format '
      + 'print - from its own 4,000 sq ft facility. The site needed to sell '
      + 'capability to brands and agencies at a glance.',
    story:
      'Hand-built with GSAP on a red-and-white system anchored by the brand’s '
      + 'arrow mark, with heavy display type and scroll-driven reveals. A '
      + 'services menu across eight disciplines, a video gallery of finished '
      + 'work, a five-step process walkthrough and live Google reviews take a '
      + 'visitor from “who are you” to “contact us” in one page.',
  },
  {
    slug: 'the-casabella',
    title: 'The Casabella',
    client: 'The Casabella',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://www.thecasabella.in',
    ...shots('the-casabella'),
    thumbAlt: 'The Casabella - Elevate your walls with timeless elegance',
    logo: null,
    description:
      'A heritage home-décor store - jharokhas, pichwai and hand-carved wall '
      + 'art - presented with the restraint of a gallery.',
    background:
      'The Casabella sells artisan-made décor rooted in Indian craft: carved '
      + 'jharokhas, gopurams, corbels, pichwai and sacred pieces. The pieces '
      + 'are ornate, so the store around them needed to step back.',
    story:
      'A Shopify build on warm ivory with serif headlines and arched product '
      + 'frames that echo the jharokhas themselves. Collections are split by '
      + 'room and intent - wall décor, mirrors and lighting, the wood edit, puja '
      + 'and sacred, gifting - with New Arrivals and Best Sellers carousels '
      + 'doing the merchandising on the homepage.',
  },
  {
    slug: 'ocher-studio',
    title: 'Ocher Studio',
    client: 'Ocher Studio',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://ocherstudio.in',
    ...shots('ocher-studio'),
    thumbAlt: 'Ocher Studio - Made to live with, handcrafted Indian décor',
    logo: null,
    description:
      'A storefront for contemporary Indian craft - handmade décor and gifts '
      + 'made with artisan communities, for homes and for business.',
    background:
      'Ocher Studio works with artisan communities to make décor, desk pieces, '
      + 'jewellery and gifts in contemporary Indian craft. It sells to two '
      + 'audiences at once: people furnishing a home, and companies ordering '
      + 'gifts in bulk.',
    story:
      'A Shopify build in warm terracotta and cream with lifestyle-first '
      + 'imagery. Retail shoppers browse by room and by craft, while dedicated '
      + 'Bulk Gifting and For Business journeys, festive gifting edits and '
      + 'Ocher Signature pieces serve the corporate side without cluttering '
      + 'the main shop.',
  },
  {
    slug: 'amino-forge',
    title: 'Amino Forge',
    client: 'Amino Forge',
    year: null,
    isNew: true,
    featured: false,
    upcoming: false,
    role: 'Research, design & development',
    stack: SHOPIFY,
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://aminoforge.in',
    ...shots('amino-forge'),
    // Composed presentation shots (several pages on a brand backdrop), so no browser bar.
    frame: false,
    thumbAlt: 'Amino Forge - AF 9 advance liposomal amino supplement',
    logo: null,
    description:
      'A science-led Shopify store for AF 9, pitched as India’s first '
      + 'liposomal amino supplement.',
    background:
      'Amino Forge launched with one product and a lot of science to explain. '
      + 'Supplement buyers are sceptical, so the store had to make the '
      + 'research approachable and put the founders and the formulation front '
      + 'and centre, without reading like a lab report.',
    story:
      'Soft lavender and violet with a sunny yellow call to action. Our Story '
      + 'introduces the founders and walks through "The Science Inside Amino '
      + 'Forge" with plain-language benefit cards, then lands on the AF 9 '
      + 'product reveal. A blog on amino acids and recovery and a categorised '
      + 'FAQ handle the questions before they become support tickets.',
  },
  {
    slug: 'vivahnam',
    title: 'Vivahnam',
    client: 'Vivahnam',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['Laravel', 'PHP', 'Bootstrap', 'JavaScript'],
    url: 'https://www.vivahnam.com',
    ...shots('vivahnam'),
    thumbAlt: 'Vivahnam - Estimate your destination wedding cost',
    logo: null,
    description:
      'A destination-wedding planning platform - 500-plus verified venues, '
      + 'availability checks and a live cost estimator, built on Laravel.',
    background:
      'Vivahnam connects families with destination wedding venues across India '
      + 'and abroad. Planning one usually means weeks of calls to hotels just to '
      + 'learn what is available and what it will cost - the platform set out '
      + 'to collapse that into a few clicks.',
    story:
      'A custom Laravel application with venues browsable by destination and '
      + 'country, a shortlist-and-check-availability flow that routes date '
      + 'requests to the planning team, and a wedding cost calculator that '
      + 'turns guest count, rooms and ceremony details into a personalised '
      + 'estimate. Planner consultations are booked straight from the page.',
  },
  {
    slug: 'echo-india',
    title: 'ECHO India',
    client: 'ECHO India',
    year: null,
    isNew: true,
    featured: false,
    upcoming: false,
    role: 'Research, design & development',
    stack: ['UX research', 'Figma', 'WordPress'],
    // This design isn't on the domain yet, so the case study doesn't link out.
    live: false,
    url: 'https://echoindia.in',
    ...shots('echo-india'),
    // Composed presentation shots (several pages on a brand backdrop), so no browser bar.
    frame: false,
    thumbAlt: 'ECHO India - Empowering communities with knowledge',
    logo: null,
    description:
      'A redesign for a non-profit that trains frontline health, education '
      + 'and livelihood workers across India.',
    background:
      'ECHO India runs the Project ECHO "all teach, all learn" model through '
      + 'hundreds of knowledge hubs nationwide. The old site buried that scale. '
      + 'Donors, partners and trainees each needed a clear way in, across '
      + 'dozens of programmes and years of results.',
    story:
      'A full information architecture and design across the homepage, Who '
      + 'We Are and every What We Do vertical. Impact numbers lead each page, '
      + 'the ECHO model is explained as a hub-and-spoke diagram, and case '
      + 'studies, a programme timeline, partners and testimonials build trust '
      + 'before the "Take action" asks: attend, donate, partner, join.',
  },
  {
    slug: 'niche-cape',
    title: 'Niche Cape',
    client: 'Niche Cape Shipping Services',
    year: null,
    market: 'Dubai, UAE',
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    url: 'https://nichecape.com',
    ...shots('niche-cape'),
    thumbAlt: 'Niche Cape - Your global logistics partner in excellence',
    logo: null,
    description:
      'A bilingual English-Arabic site for a UAE freight and logistics company '
      + 'serving 15-plus countries across the GCC and beyond.',
    background:
      'Niche Cape is the logistics division of Niche Marketing Management, '
      + 'moving air, sea and land freight, clearing customs and running '
      + 'warehousing for brands across the region. Its buyers read in English '
      + 'and Arabic and compare rates before they call.',
    story:
      'A hand-built GSAP site with a full English and Arabic interface. Each service - air and sea freight, '
      + 'land transport, customs, warehousing, packaging - gets its own page, '
      + 'and a match-rates call to action sits in the navigation so the '
      + 'quote request is never more than one click away.',
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

/** "https://www.example.com/" -> "example.com", for display. */
export function domainOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

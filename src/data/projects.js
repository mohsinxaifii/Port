/* ==================================================================
   PROJECTS

   One entry per case study, in display order. `slug` becomes
   /work/<slug>. scripts/gen-cases.mjs wipes and regenerates /work on
   every dev and build run, so adding or removing an entry here is all
   it takes.

   `featured: true` puts it on the index (the first four fill the lead
   block and the closing strip).
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
    ...shots('the-bikaneri-kitchen'),
    thumbAlt: 'The Bikaneri Kitchen - Paraat Bhujia tin on a woven basket',
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
    featured: true,
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
    slug: 'twisty-designs',
    title: 'Twisty Designs',
    client: 'Twisty Designs',
    year: null,
    isNew: false,
    featured: true,
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
    thumbAlt: 'Beyond Beyond - All-Day Comfort NAD+ day cream',
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
    thumbAlt: 'Design Dimensions - Design is, As Design Does',
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
    thumbAlt: 'Zinara - Double Take lab-grown diamond campaign',
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
    slug: 'niche-star-advertising',
    title: 'Niche Star',
    client: 'Niche Star Advertising',
    year: null,
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
    slug: 'niche-cape',
    title: 'Niche Cape',
    client: 'Niche Cape Shipping Services',
    year: null,
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
    slug: 'sana-khan-luxe',
    title: 'Sana Khan Luxe',
    client: 'Sana Khan Luxe',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://www.sanakhanluxe.com',
    ...shots('sana-khan-luxe'),
    thumbAlt: 'Sana Khan Luxe - editorial couture campaign',
    logo: null,
    description:
      'An editorial, international storefront for a couture label - two '
      + 'collection tiers, sold in USD to a global clientele.',
    background:
      'Sana Khan Luxe makes hand-embellished occasionwear in two tiers - Luxe '
      + 'and Premium Luxe - with pieces up to $1,700. Customers buy from '
      + 'abroad, so the store had to feel like a fashion house and handle '
      + 'international currency cleanly.',
    story:
      'A Shopify build that gets out of the garments’ way: white space, a '
      + 'script wordmark and full-width campaign photography. The homepage '
      + 'splits straight into the two tiers, a Most Loved row does the '
      + 'merchandising, and region and currency selection keep pricing '
      + 'native for international buyers.',
  },
  {
    slug: 'zever4u',
    title: 'Zever4u',
    client: 'Zever4u',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://zever4u.com',
    ...shots('zever4u'),
    thumbAlt: 'Zever4u - New Fashion, silver jewellery sale',
    logo: null,
    description:
      'A wide-catalogue Shopify store for silver jewellery - rings to bridal '
      + 'sets, shipped across India.',
    background:
      'Zever4u sells authentic silver jewellery across a very broad range: '
      + 'rings, earrings, bracelets, mangalsutras, bridal sets, spiritual '
      + 'pieces, men’s jewellery and gifting. With that many categories, '
      + 'finding the right piece was the whole problem.',
    story:
      'Built on Shopify with a mega-menu by category and occasion, a row of '
      + 'illustrated category shortcuts under the hero, and Bestsellers and '
      + 'New Arrivals rails that keep the homepage moving.',
  },
  {
    slug: 'furnish-creations',
    title: 'Furnish Creations',
    client: 'Furnish Creations',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: ['PHP', 'HTML', 'CSS', 'GSAP'],
    url: 'https://furnishcreations.in',
    ...shots('furnish-creations'),
    thumbAlt: 'Furnish Creations - Sofa repair and upholstery in Gurugram',
    logo: null,
    description:
      'A lead-generation site for a Gurugram sofa repair and upholstery '
      + 'service - the enquiry form is the hero.',
    background:
      'Furnish Creations has spent more than 25 years repairing and '
      + 'reupholstering sofas, recliners, chairs and beds across Gurugram and '
      + 'Delhi. The business runs on local enquiries, so every visit needed to '
      + 'end in a call, a WhatsApp or a form.',
    story:
      'A custom PHP site with GSAP motion, built around a quick-enquiry form '
      + 'placed in the hero beside the headline. Call and WhatsApp buttons '
      + 'stay pinned in the header, a “Why replace when you can repair for '
      + 'less?” section makes the case, and a before-and-after gallery by '
      + 'furniture type plus Google reviews close it.',
  },
  {
    slug: 'agashe',
    title: 'Agashe',
    client: 'Agashe',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://www.agashestore.com',
    ...shots('agashe'),
    thumbAlt: 'Agashe - women, men, kids, perfumery, accessories and jewellery',
    logo: null,
    description:
      'A multi-designer fashion store from Delhi - established labels and '
      + 'emerging designers under one clean, image-led roof.',
    background:
      'Agashe is a multi-designer store stocking established labels and '
      + 'emerging designers across womenswear, menswear, kidswear, perfumery, '
      + 'accessories and jewellery. Many labels, one store - the site had to '
      + 'let each designer shine without the shop turning into noise.',
    story:
      'A Shopify build with a quiet monochrome frame so the designers’ imagery '
      + 'carries the colour. The homepage opens straight into six '
      + 'department tiles, department landing pages lead with designer '
      + 'campaigns, and a designer index, in-store appointment booking and '
      + 'store locations connect the online shop to the boutique.',
  },
  {
    slug: 'code-to-couture',
    title: 'Code to Couture',
    client: 'Code to Couture',
    year: null,
    isNew: false,
    featured: false,
    upcoming: false,
    role: ROLE,
    stack: SHOPIFY,
    url: 'https://www.codetocouture.com',
    ...shots('code-to-couture'),
    thumbAlt: 'Code to Couture - Your growth, our strategy',
    logo: null,
    description:
      'The agency site for a fashion-focused digital marketing firm - case '
      + 'studies, services and proof, built to win the next label.',
    background:
      'Code to Couture has spent eight-plus years running websites, '
      + 'performance marketing and campaign imagery for fashion labels such as '
      + 'Gopi Vaid. Its own site needed to speak fluent fashion and still read '
      + 'as a numbers-driven partner.',
    story:
      'Built on Shopify with a dark, editorial palette, a typed hero line and '
      + 'animated counters for partners, ROI growth and years of work. Service '
      + 'tiles cover web design, UI/UX, performance marketing and more, with '
      + 'case studies, careers, team and client testimonials rounding it out.',
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

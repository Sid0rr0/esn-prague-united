/**
 * Sample content for a fresh dataset, so the site has something to render while it's
 * built. Text is stored in the translated shape (ADR 0002) with English only.
 */

type Doc = { _type: string; [field: string]: unknown }
export type Singleton = Doc & { _id: string }
/** A document found again on re-runs by its web address, so it's never created twice. */
export type SluggedDoc = Doc & { slug: { _type: 'slug'; current: string } }

const DAY_MS = 24 * 60 * 60 * 1000
const UPCOMING_EVENT_IN_DAYS = 30
const PAST_EVENT_DAYS_AGO = 21

const en = (value: string) => ({ _type: 'localeString', en: value })
const enText = (value: string) => ({ _type: 'localeText', en: value })
const enRichText = (...paragraphs: string[]) => ({
  _type: 'localeRichText',
  en: paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `p${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `p${i}s`, text, marks: [] }],
  })),
})
const slug = (current: string) => ({ _type: 'slug' as const, current })

/** An evening `days` from `now`, as an ISO date-time (18:00 UTC). */
const eveningInDays = (now: Date, days: number) => {
  const date = new Date(now.getTime() + days * DAY_MS)
  date.setUTCHours(18, 0, 0, 0)
  return date.toISOString()
}

export const singletons = (): Singleton[] => [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    siteName: 'ESN Prague United',
    navigation: [
      { _key: 'events', label: en('Events'), href: '/events' },
      { _key: 'sections', label: en('Sections'), href: '/sections' },
      { _key: 'gallery', label: en('Gallery'), href: '/gallery' },
      { _key: 'faq', label: en('FAQ'), href: '/faq' },
      { _key: 'contacts', label: en('Contacts'), href: '/contacts' },
    ],
    footerText: enText('Five sections, one city.'),
  },
  {
    _id: 'homepage',
    _type: 'homepage',
    hero: {
      heading: en('Your exchange in Prague starts here'),
      subheading: enText('Trips, parties, language exchanges and a local buddy from day one.'),
      primaryButton: {
        _type: 'cta',
        label: en('Find your section'),
        url: 'https://example.com/sections',
      },
    },
    about: {
      heading: en('What is ESN Prague United?'),
      text: enRichText(
        'Five ESN sections at Prague universities, working together for international students.',
      ),
      stats: [
        { _key: 'sections', value: '5', label: en('sections') },
        { _key: 'universities', value: '5', label: en('universities') },
      ],
    },
    showSections: true,
    showGallery: true,
  },
  {
    _id: 'faqPage',
    _type: 'faqPage',
    title: en('Frequently asked questions'),
    groups: [
      {
        _key: 'card',
        _type: 'faqGroup',
        title: en('ESN card'),
        items: [
          {
            _key: 'what',
            _type: 'faqEntry',
            question: en('What is the ESN card?'),
            answer: enRichText('A membership card that gives you discounts at our events.'),
          },
        ],
      },
    ],
  },
  {
    _id: 'contactsPage',
    _type: 'contactsPage',
    title: en('Contact us'),
    intro: enText('Questions about your exchange? Write to your section.'),
    showSectionContacts: true,
  },
  {
    _id: 'linksPage',
    _type: 'linksPage',
    title: en('ESN Prague United'),
    intro: en('Everything we share, in one place.'),
    links: [
      {
        _key: 'events',
        _type: 'linkItem',
        label: en('Upcoming events'),
        url: 'https://example.com/events',
        icon: 'calendar',
        highlight: true,
      },
    ],
  },
]

const SECTIONS = [
  { slug: 'esn-cu', shortName: 'ESN CU', name: 'ESN CU Prague', university: 'Charles University' },
  {
    slug: 'esn-ctu',
    shortName: 'ESN CTU',
    name: 'ESN CTU in Prague',
    university: 'Czech Technical University in Prague',
  },
  {
    slug: 'esn-vse',
    shortName: 'ESN VŠE',
    name: 'ESN VŠE Prague',
    university: 'Prague University of Economics and Business',
  },
  {
    slug: 'esn-czu',
    shortName: 'ESN CULS',
    name: 'ESN CULS Prague',
    university: 'Czech University of Life Sciences Prague',
  },
  {
    slug: 'esn-uct',
    shortName: 'ESN UCT',
    name: 'ESN UCT Prague',
    university: 'University of Chemistry and Technology, Prague',
  },
]

export const sections = (): SluggedDoc[] =>
  SECTIONS.map((section, i) => ({
    _type: 'section',
    name: en(section.name),
    shortName: section.shortName,
    slug: slug(section.slug),
    university: en(section.university),
    tagline: en(`International students at ${section.university}.`),
    about: enRichText(`${section.name} welcomes exchange students with a buddy and events.`),
    order: i + 1,
  }))

export const events = (now: Date): SluggedDoc[] => [
  {
    _type: 'event',
    title: en('Welcome Party'),
    slug: slug('welcome-party'),
    startsAt: eveningInDays(now, UPCOMING_EVENT_IN_DAYS),
    venue: { name: 'Sample venue', transport: enText('Tram to the city centre.') },
    summary: enText('Meet the other exchange students and all five sections.'),
    description: enRichText('Music, drinks and new friends. Bring your ESN card.'),
    programme: [
      { _key: 'doors', _type: 'programmeItem', time: '20:00', title: en('Doors open') },
      { _key: 'party', _type: 'programmeItem', time: '21:00', title: en('Party starts') },
    ],
    faq: [
      {
        _key: 'card',
        _type: 'faqEntry',
        question: en('Do I need an ESN card?'),
        answer: enRichText('No, but card holders get a discount.'),
      },
    ],
    ticketUrl: 'https://example.com/tickets/welcome-party',
    priceTiers: [
      { _key: 'card', _type: 'priceTier', label: en('With ESN card'), amount: 150 },
      { _key: 'no-card', _type: 'priceTier', label: en('Without ESN card'), amount: 250 },
    ],
  },
  {
    _type: 'event',
    title: en('Orientation Week Trip'),
    slug: slug('orientation-week-trip'),
    startsAt: eveningInDays(now, -PAST_EVENT_DAYS_AGO),
    summary: enText('A day trip out of Prague for new students.'),
    ticketNote: en('Free for new students, no ticket needed'),
  },
]

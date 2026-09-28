/** Small builders for Sanity documents in the shape the Studio stores them. */

type Doc = { _id: string; _type: string; [key: string]: unknown }

/** A translated field as the Studio stores it: English, and Czech when given. */
export const localised = (en: unknown, cs?: unknown) => ({
  _type: 'localeString',
  en,
  ...(cs === undefined ? {} : { cs }),
})

export const siteSettings = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'ESN Prague United',
  navigation: [
    { _key: 'n1', label: localised('Events'), href: '/events' },
    { _key: 'n2', label: localised('Sections'), href: '/sections' },
    { _key: 'n3', label: localised('Gallery'), href: '/gallery' },
  ],
  socials: { instagram: 'https://instagram.com/esnprague' },
  ...overrides,
})

export const homepage = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'homepage',
  _type: 'homepage',
  hero: {
    heading: localised('Your exchange in Prague starts here'),
    subheading: localised('Trips, parties and a local buddy.'),
    primaryButton: { label: localised('Find your section'), url: 'https://example.com/sections' },
    secondaryButton: { label: localised('Get an ESN card'), url: 'https://esncard.org' },
  },
  ...overrides,
})

export const event = (id: string, overrides: Record<string, unknown> = {}): Doc => ({
  _id: id,
  _type: 'event',
  title: localised(`Event ${id}`),
  slug: { current: id },
  startsAt: '2026-11-26T17:00:00Z',
  ...overrides,
})

/** Rich text as the Studio stores it: one block per paragraph, translated as a whole. */
export const richText = (...paragraphs: string[]) =>
  localised(
    paragraphs.map((text, i) => ({
      _type: 'block',
      _key: `b${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
    })),
  )

/** A question in an FAQ topic or an Event FAQ, answered in one paragraph. */
export const faqEntry = (key: string, question: string, answer: string) => ({
  _key: key,
  _type: 'faqEntry',
  question: localised(question),
  answer: richText(answer),
})

/** The FAQ Singleton with three general topics, in order. */
export const faqPage = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'faqPage',
  _type: 'faqPage',
  title: localised('Frequently asked questions'),
  intro: localised('Everything about ESN Prague United in one place.'),
  groups: [
    {
      _key: 'card',
      _type: 'faqGroup',
      title: localised('ESN card'),
      items: [
        faqEntry('q1', 'Where do I get an ESN card?', 'At any Section office.'),
        faqEntry('q2', 'How much is it?', '300 CZK.'),
      ],
    },
    {
      _key: 'buddy',
      _type: 'faqGroup',
      title: localised('Buddy programme'),
      items: [faqEntry('q3', 'How do I get a buddy?', 'Sign up on your Section page.')],
    },
    {
      _key: 'join',
      _type: 'faqGroup',
      title: localised('Joining ESN'),
      items: [faqEntry('q4', 'Can I volunteer?', 'Yes, write to your Section.')],
    },
  ],
  ...overrides,
})

export const section = (
  slug: string,
  order: number,
  overrides: Record<string, unknown> = {},
): Doc => ({
  _id: `section-${slug}`,
  _type: 'section',
  name: localised(`ESN ${slug.toUpperCase()} Prague`),
  shortName: `ESN ${slug.toUpperCase()}`,
  slug: { current: `esn-${slug}` },
  university: localised(`University ${slug.toUpperCase()}`),
  tagline: localised(`Tagline of ${slug.toUpperCase()}.`),
  order,
  ...overrides,
})

/** The five Sections in website order, as seeded. */
export const allSections = () =>
  ['cu', 'ctu', 'vse', 'czu', 'uct'].map((slug, i) => section(slug, i + 1))

/** A photo in an Album, with its image asset document so the page can build its URLs. */
export const photo = (id: string) => ({
  photo: {
    _key: id,
    _type: 'imageWithAlt',
    asset: { _type: 'reference', _ref: `image-${id}-1200x800-jpg` },
    alt: localised(`Photo ${id}`),
  },
  asset: {
    _id: `image-${id}-1200x800-jpg`,
    _type: 'sanity.imageAsset',
    url: `https://cdn.sanity.io/images/p/d/${id}-1200x800.jpg`,
  },
})

export const album = (slug: string, overrides: Record<string, unknown> = {}): Doc => ({
  _id: `album-${slug}`,
  _type: 'album',
  title: localised(`Album ${slug}`),
  slug: { current: slug },
  date: '2026-09-12',
  ...overrides,
})

/** The Contacts Singleton with the general email, address and socials, listing Section contacts. */
export const contactsPage = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'contactsPage',
  _type: 'contactsPage',
  title: localised('Get in touch'),
  intro: localised('Write to ESN Prague United or to your Section.'),
  generalEmail: 'hello@esnprague.cz',
  address: 'Vodičkova 36\n110 00 Praha 1',
  showSectionContacts: true,
  socials: { instagram: 'https://instagram.com/esnprague' },
  ...overrides,
})

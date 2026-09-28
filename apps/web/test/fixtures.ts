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

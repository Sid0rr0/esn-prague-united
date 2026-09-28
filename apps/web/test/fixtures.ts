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
  hero: { heading: localised('Your exchange in Prague starts here') },
  ...overrides,
})

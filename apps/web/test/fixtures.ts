/** Small builders for Sanity documents in the shape the Studio stores them. */

type Doc = { _id: string; _type: string; [key: string]: unknown }

export const siteSettings = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'ESN Prague United',
  navigation: [
    { _key: 'n1', label: 'Events', href: '/events' },
    { _key: 'n2', label: 'Sections', href: '/sections' },
    { _key: 'n3', label: 'Gallery', href: '/gallery' },
  ],
  socials: { instagram: 'https://instagram.com/esnprague' },
  ...overrides,
})

export const homepage = (overrides: Record<string, unknown> = {}): Doc => ({
  _id: 'homepage',
  _type: 'homepage',
  hero: { heading: 'Your exchange in Prague starts here' },
  ...overrides,
})

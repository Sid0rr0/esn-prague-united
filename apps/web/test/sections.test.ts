import { describe, expect, it } from 'vitest'
import SectionsPage from '../src/pages/sections/index.astro'
import SectionPage from '../src/pages/sections/[slug].astro'
import { renderPage } from './seam'
import {
  allSections,
  event,
  localised,
  richText,
  section,
  sectionLogo,
  siteSettings,
} from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

/** Each Section's brand colour, fixed in code (see CONTEXT.md). */
const COLOURS = {
  cu: 'var(--color-esn-magenta)',
  ctu: 'var(--color-esn-blue)',
  vse: 'var(--color-esn-orange)',
  czu: 'var(--color-esn-green)',
  uct: 'var(--color-esn-cyan)',
}

const tilesOf = (html: string) => html.match(/<a[^>]*data-section-tile[\s\S]*?<\/a>/g) ?? []
const contactCardOf = (html: string) =>
  html.match(/<section[^>]*aria-labelledby="get-in-touch"[\s\S]*?<\/section>/)?.[0] ?? ''

const renderSection = (
  doc: ReturnType<typeof section>,
  ...others: { _id: string; _type: string }[]
) =>
  renderPage(SectionPage, {
    now: NOW,
    params: { slug: (doc.slug as { current: string }).current },
    documents: [siteSettings(), doc, ...others],
  })

describe('Sections list', () => {
  it('lists all 5 Sections in website order, each in its fixed colour', async () => {
    const [cu, ctu, vse, czu, uct] = allSections()

    const html = await renderPage(SectionsPage, {
      now: NOW,
      documents: [siteSettings(), uct, vse, cu, czu, ctu],
    })
    const tiles = tilesOf(html)

    expect(tiles).toHaveLength(5)
    Object.entries(COLOURS).forEach(([slug, colour], i) => {
      const name = `ESN ${slug.toUpperCase()} Prague`
      expect(tiles[i]).toContain(name)
      expect(tiles[i]).toContain(`href="/sections/esn-${slug}"`)
      expect(tiles[i]).toContain(colour)
      expect(tiles[i]).toContain(`University ${slug.toUpperCase()}`)
      expect(tiles[i]).toContain(`Tagline of ${slug.toUpperCase()}.`)
    })
  })

  it('shows no Section logo or logo placeholder on any tile, even when every Section has a logo', async () => {
    const html = await renderPage(SectionsPage, {
      now: NOW,
      documents: [siteSettings(), ...allSections()],
    })
    const tiles = tilesOf(html)

    expect(tiles).toHaveLength(5)
    tiles.forEach((tile) => {
      expect(tile).not.toContain('<img')
      expect(tile).not.toContain('<div')
      expect(tile).not.toContain('/logo')
    })
  })
})

describe('Section page logo', () => {
  it('shows no Section logo, even when the Section has one', async () => {
    const html = await renderSection(section('ctu', 2, { logo: sectionLogo('ctu') }))

    expect(html).toContain('ESN CTU Prague')
    expect(html).not.toContain('/logoctu')
  })
})

describe('Section page', () => {
  it('shows the hero text and the About us prose', async () => {
    const ctu = section('ctu', 2, { about: richText('About 40 volunteers at CTU.') })

    const html = await renderSection(ctu)

    expect(html).toContain('ESN CTU Prague')
    expect(html).toContain('University CTU')
    expect(html).toContain('Tagline of CTU.')
    expect(html).toContain(COLOURS.ctu)
    expect(html).toMatch(/SECTIONS \/\s*University CTU/i)
    expect(html).toContain('About us')
    expect(html).toContain('<p>About 40 volunteers at CTU.</p>')
  })

  it('lists email, Instagram and website in a Get in touch card, the two links opening in a new tab', async () => {
    const cu = section('cu', 1, {
      email: 'info@esncuprague.cz',
      socials: {
        instagram: 'https://www.instagram.com/esncuprague/?hl=en',
        website: 'https://www.esncuprague.cz/about',
        whatsapp: 'https://wa.example/cu',
      },
    })

    const html = await renderSection(cu)

    expect(html).toContain('Get in touch')
    expect(html).toMatch(
      /<a[^>]*href="mailto:info@esncuprague\.cz"[^>]*>[\s\S]*?info@esncuprague\.cz/,
    )
    expect(html).toMatch(
      /<a[^>]*href="https:\/\/www\.instagram\.com\/esncuprague\/\?hl=en"[^>]*target="_blank"[^>]*>[\s\S]*?@esncuprague/,
    )
    expect(html).toMatch(
      /<a[^>]*href="https:\/\/www\.esncuprague\.cz\/about"[^>]*target="_blank"[^>]*>[\s\S]*?>\s*esncuprague\.cz\s*</,
    )
    expect(html).not.toContain('wa.example')
  })

  it('hides a contact row when its field is empty', async () => {
    const html = await renderSection(
      section('cu', 1, {
        email: 'info@esncuprague.cz',
        socials: { website: 'https://esncuprague.cz' },
      }),
    )

    const card = contactCardOf(html)

    expect(card).toContain('Email')
    expect(card).toContain('Website')
    expect(card).not.toContain('Instagram')
  })

  it('hides the Get in touch card when the Section has no contact details, and About takes the full width', async () => {
    const html = await renderSection(section('cu', 1, { about: richText('About CU.') }))

    expect(html).not.toContain('Get in touch')
    expect(html).toContain('About CU.')
    expect(html).not.toContain('lg:grid-cols-[minmax(0,1fr)_400px]')
  })

  it('shows only the hero when there is neither about nor contact details', async () => {
    const html = await renderSection(section('cu', 1))

    expect(html).toContain('Tagline of CU.')
    expect(html).not.toContain('About us')
    expect(html).not.toContain('Get in touch')
  })

  it('shows no buddy button, office, map link or Follow us block, even when the Section has them', async () => {
    const html = await renderSection(
      section('ctu', 2, {
        buddyProgramUrl: 'https://buddy.example/ctu',
        office: localised('Masarykova kolej, room 012'),
        mapUrl: 'https://maps.example/ctu',
        socials: { facebook: 'https://facebook.example/ctu' },
      }),
    )

    for (const text of [
      'Get a buddy',
      'buddy.example',
      'Masarykova',
      'Open in Maps',
      'maps.example',
      'Follow us',
      'facebook.example',
    ]) {
      expect(html).not.toContain(text)
    }
  })

  it('underlines Sections in the header in the Section colour', async () => {
    const html = await renderSection(section('cu', 1))

    expect(html).toContain('--nav-accent: var(--color-esn-magenta)')
  })

  it.each([
    ['cu', 'text-white', 'text-white'],
    ['ctu', 'text-white', 'text-on-blue-muted'],
    ['vse', 'text-ink', 'text-ink font-light'],
    ['czu', 'text-ink', 'text-ink font-light'],
    ['uct', 'text-ink', 'text-ink font-light'],
  ])('sets %s band text to %s and its university line to %s', async (slug, band, university) => {
    const html = await renderSection(section(slug, 1))

    const bandTag = html.match(/<section[^>]*style="background: [^"]*"[^>]*>/)?.[0] ?? ''
    expect(bandTag).toContain(band)
    const universityTag = html.match(/<p[^>]*data-section-university[^>]*>/)?.[0] ?? ''
    for (const cls of university.split(' ')) expect(universityTag).toContain(cls)
  })

  it('keeps small grey text off the magenta band: bold, 19px or bigger', async () => {
    const html = await renderSection(section('cu', 1))

    const universityTag = html.match(/<p[^>]*data-section-university[^>]*>/)?.[0] ?? ''
    const taglineTag = html.match(/<p[^>]*data-section-tagline[^>]*>/)?.[0] ?? ''
    for (const tag of [universityTag, taglineTag]) {
      expect(tag).toContain('font-bold')
      expect(tag).toContain('text-[19px]')
      expect(tag).not.toMatch(/text-muted/)
    }
  })

  it('shows no events or albums, even for a Section that still holds them', async () => {
    const party = event('party', { title: localised('Welcome Party') })
    const album = {
      _id: 'album-trip',
      _type: 'album',
      title: localised('Krumlov trip'),
      slug: { current: 'krumlov' },
    }
    const ctu = section('ctu', 2, {
      events: [{ _key: 'e1', _type: 'reference', _ref: party._id }],
      albums: [{ _key: 'a1', _type: 'reference', _ref: album._id }],
    })

    const html = await renderSection(ctu, party, album)

    expect(html).not.toContain('Welcome Party')
    expect(html).not.toContain('Krumlov trip')
    expect(html).not.toContain('/events/')
    expect(html).not.toContain('/gallery/')
  })
})

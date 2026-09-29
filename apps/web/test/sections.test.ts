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
  it('shows about, buddy sign-up, office as prose, email, Open in Maps and socials', async () => {
    const ctu = section('ctu', 2, {
      about: richText('About 40 volunteers at CTU.'),
      buddyProgramUrl: 'https://buddy.example/ctu',
      office: localised('Tue, Thu 14:00–16:00\nMasarykova kolej, room 012'),
      email: 'ctu@esnprague.cz',
      mapUrl: 'https://maps.example/ctu',
      socials: { instagram: 'https://instagram.com/esnctu', whatsapp: 'https://wa.example/ctu' },
    })

    const html = await renderSection(ctu)

    expect(html).toContain('ESN CTU Prague')
    expect(html).toContain('University CTU')
    expect(html).toContain('Tagline of CTU.')
    expect(html).toContain(COLOURS.ctu)
    expect(html).toContain('<p>About 40 volunteers at CTU.</p>')
    expect(html).toMatch(/href="https:\/\/buddy\.example\/ctu"[^>]*>\s*Get a buddy/)
    expect(html).toContain('Tue, Thu 14:00–16:00\nMasarykova kolej, room 012')
    expect(html).toMatch(/href="mailto:ctu@esnprague\.cz"[^>]*>\s*ctu@esnprague\.cz/)
    expect(html).toMatch(/href="https:\/\/maps\.example\/ctu"[^>]*>\s*Open in Maps/)
    expect(html).toMatch(/href="https:\/\/instagram\.com\/esnctu"[^>]*>\s*Instagram/)
    expect(html).toMatch(/href="https:\/\/wa\.example\/ctu"[^>]*>\s*WhatsApp/)
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

  it('shows socials under a Follow us heading, above the office rather than by the footer', async () => {
    const ctu = section('ctu', 2, {
      office: localised('Masarykova kolej'),
      socials: { instagram: 'https://instagram.com/esnctu' },
    })

    const html = await renderSection(ctu)

    const followUs = html.indexOf('Follow us')
    expect(followUs).toBeGreaterThan(-1)
    expect(followUs).toBeLessThan(html.indexOf('instagram.com/esnctu'))
    expect(html.indexOf('instagram.com/esnctu')).toBeLessThan(html.indexOf('>Office<'))
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

  it('hides Get a buddy when there is no buddy sign-up link', async () => {
    const html = await renderSection(section('ctu', 2))

    expect(html).not.toContain('Get a buddy')
  })
})

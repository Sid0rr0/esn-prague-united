import { describe, expect, it } from 'vitest'
import GalleryPage from '../src/pages/gallery/index.astro'
import AlbumPage from '../src/pages/gallery/[slug].astro'
import { renderPage } from './seam'
import { album, event, localised, photo, section, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

type Doc = ReturnType<typeof album>

const photosOf = (...ids: string[]) => {
  const made = ids.map(photo)
  return { photos: made.map((p) => p.photo), assets: made.map((p) => p.asset) }
}

const cardsOf = (html: string) => html.match(/<a[^>]*data-album-card[\s\S]*?<\/a>/g) ?? []
const headerOf = (html: string) =>
  html.match(/<header[^>]*data-album-header[\s\S]*?<\/header>/)?.[0] ?? ''

const renderAlbum = (doc: Doc, ...others: { _id: string; _type: string }[]) =>
  renderPage(AlbumPage, {
    now: NOW,
    params: { slug: (doc.slug as { current: string }).current },
    documents: [siteSettings(), doc, ...others],
  })

describe('Gallery', () => {
  it('lists every Album newest first, each with its cover, date and photo count', async () => {
    const three = photosOf('a', 'b', 'c')
    const one = photosOf('d')
    const older = album('welcome-week', {
      title: localised('Welcome week'),
      date: '2026-09-05',
      photos: three.photos,
    })
    const newer = album('krumlov', {
      title: localised('Český Krumlov trip'),
      date: '2026-09-20',
      cover: one.photos[0],
      photos: one.photos,
    })
    const empty = album('quiz', { title: localised('Pub quiz'), date: '2026-08-01' })

    const html = await renderPage(GalleryPage, {
      now: NOW,
      documents: [siteSettings(), older, empty, newer, ...three.assets, ...one.assets],
    })
    const cards = cardsOf(html)

    expect(cards).toHaveLength(3)
    expect(cards[0]).toContain('Český Krumlov trip')
    expect(cards[0]).toContain('href="/gallery/krumlov"')
    expect(cards[0]).toMatch(/<img[^>]*d-1200x800\.jpg/)
    expect(cards[0]).toContain('20 September 2026')
    expect(cards[0]).toContain('1 photo')
    expect(cards[0]).not.toContain('1 photos')
    expect(cards[1]).toContain('Welcome week')
    expect(cards[1]).toContain('3 photos')
    expect(cards[2]).toContain('Pub quiz')
    expect(cards[2]).toContain('0 photos')
  })

  it('shows no Section on Album cards, even for an Album that still holds one', async () => {
    const ctu = section('ctu', 2)
    const trip = album('krumlov', {
      sections: [{ _key: 's1', _type: 'reference', _ref: ctu._id }],
    })

    const html = await renderPage(GalleryPage, {
      now: NOW,
      documents: [siteSettings(), ctu, trip],
    })

    expect(cardsOf(html)[0]).not.toContain('ESN CTU')
    expect(html).not.toContain('/sections/')
  })
})

describe('Album page', () => {
  it('shows the date, title, photo count and a grid of the photos', async () => {
    const { photos, assets } = photosOf('a', 'b')
    const trip = album('krumlov', {
      title: localised('Český Krumlov trip'),
      date: '2026-09-20',
      photos,
    })

    const html = await renderAlbum(trip, ...assets)
    const header = headerOf(html)

    expect(header).toContain('Český Krumlov trip')
    expect(header).toContain('20 September 2026')
    expect(header).toContain('2 photos')
    expect(html).toContain('alt="Photo a"')
    expect(html).toContain('alt="Photo b"')
  })

  it('shows the photo credit and Full album ↗ when they are set', async () => {
    const trip = album('krumlov', {
      photographer: 'Jana Nováková',
      fullAlbumUrl: 'https://photos.example/krumlov',
    })

    const header = headerOf(await renderAlbum(trip))

    expect(header).toContain('Photos by Jana Nováková')
    expect(header).toMatch(/href="https:\/\/photos\.example\/krumlov"[^>]*>\s*Full album ↗/)
  })

  it('hides the photo credit and Full album ↗ when they are not set', async () => {
    const header = headerOf(await renderAlbum(album('krumlov')))

    expect(header).not.toContain('Photos by')
    expect(header).not.toContain('Full album')
  })

  it('links to the Event page when an Event links to the Album', async () => {
    const trip = album('krumlov')
    const krumlov = event('krumlov-trip', {
      title: localised('Krumlov trip'),
      album: { _type: 'reference', _ref: trip._id },
    })

    const header = headerOf(await renderAlbum(trip, krumlov))

    expect(header).toMatch(/href="\/events\/krumlov-trip"[^>]*>\s*Event page/)
  })

  it('shows no Event page link when no Event links to the Album', async () => {
    const trip = album('krumlov')
    const other = event('party', { album: { _type: 'reference', _ref: 'album-other' } })

    const html = await renderAlbum(trip, other)

    expect(html).not.toContain('Event page')
    expect(html).not.toContain('/events/party')
  })

  it('shows no Section, even for an Album that still holds one', async () => {
    const ctu = section('ctu', 2)
    const trip = album('krumlov', {
      sections: [{ _key: 's1', _type: 'reference', _ref: ctu._id }],
    })

    const html = await renderAlbum(trip, ctu)

    expect(html).not.toContain('ESN CTU')
    expect(html).not.toContain('/sections/')
  })

  it('gives the photo viewer every photo in order, with a counter and its controls', async () => {
    const { photos, assets } = photosOf('a', 'b', 'c')

    const html = await renderAlbum(album('krumlov', { photos }), ...assets)
    const viewer = html.match(/<dialog[^>]*data-viewer[\s\S]*?<\/dialog>/)?.[0] ?? ''
    const tiles = html.match(/<a[^>]*data-photo=[\s\S]*?<\/a>/g) ?? []

    expect(tiles).toHaveLength(3)
    tiles.forEach((tile, i) => expect(tile).toContain(`data-photo="${i}"`))
    expect(viewer).toContain('1 / 3')
    expect(viewer).toMatch(/aria-label="Previous photo"/)
    expect(viewer).toMatch(/aria-label="Next photo"/)
    expect(viewer).toMatch(/aria-label="Close"/)
  })

  it('renders no photo viewer for an Album without photos', async () => {
    const html = await renderAlbum(album('krumlov'))

    expect(html).not.toContain('data-viewer')
  })
})

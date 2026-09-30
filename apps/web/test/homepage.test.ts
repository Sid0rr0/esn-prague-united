import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import {
  album,
  allSections,
  event,
  homepage,
  instagramPost,
  instagramPostRef,
  localised,
  richText,
  siteSettings,
} from './fixtures'

const NOW = '2026-10-01T10:00:00Z'
const FUTURE = '2026-11-26T17:00:00Z'

const tiers = [
  { _key: 't1', label: localised('With ESN card'), amount: 590 },
  { _key: 't2', label: localised('Without ESN card'), amount: 690 },
]

type Doc = ReturnType<typeof event>

const featuring = (featured: Doc | null, ...others: Doc[]) =>
  renderPage(Home, {
    now: NOW,
    documents: [
      siteSettings(),
      homepage(featured ? { featuredEvent: { _type: 'reference', _ref: featured._id } } : {}),
      ...(featured ? [featured] : []),
      ...others,
    ],
  })

const heroOf = (html: string) => html.match(/<section[^>]*data-hero[\s\S]*?<\/section>/)?.[0] ?? ''
const upcomingOf = (html: string) =>
  html.match(/<section[^>]*data-upcoming[\s\S]*?<\/section>/)?.[0] ?? ''

describe('homepage hero', () => {
  it('shows a Featured event with a ticket link as Buy ticket plus the first tier price', async () => {
    const ball = event('ball', {
      title: localised('Czech Ball'),
      summary: localised('A formal night of waltz.'),
      ticketUrl: 'https://tickets.example/ball',
      priceTiers: tiers,
    })

    const hero = heroOf(await featuring(ball))

    expect(hero).toContain('Czech Ball')
    expect(hero).toContain('A formal night of waltz.')
    expect(hero).toContain('Thursday 26 November · 18:00')
    expect(hero).toMatch(/href="https:\/\/tickets\.example\/ball"[^>]*>[\s\S]*Buy ticket/)
    expect(hero).toContain('590 CZK')
    expect(hero).not.toContain('690 CZK')
  })

  it('shows Choose a date linking to the Event page Sessions anchor when the Featured event has upcoming Sessions', async () => {
    const salsa = event('salsa', {
      ticketUrl: 'https://tickets.example/salsa',
      priceTiers: tiers,
      sessions: [{ _key: 'a', _type: 'session', startsAt: FUTURE }],
    })

    const hero = heroOf(await featuring(salsa))

    expect(hero).toMatch(/href="\/events\/salsa#sessions"[^>]*>\s*Choose a date/)
    expect(hero).toContain('590 CZK')
    expect(hero).not.toContain('Buy ticket')
    expect(hero).not.toContain('tickets.example')
  })

  it('shows Buy ticket without a price pill when the Featured event has no tiers', async () => {
    const ball = event('ball', { ticketUrl: 'https://tickets.example/ball' })

    const hero = heroOf(await featuring(ball))

    expect(hero).toContain('Buy ticket')
    expect(hero).not.toContain('CZK')
  })

  it('shows the Ticket note instead of Buy ticket when there is no ticket link', async () => {
    const ball = event('ball', {
      ticketNote: localised('Sold out. Watch Instagram'),
      priceTiers: tiers,
    })

    const hero = heroOf(await featuring(ball))

    expect(hero).toContain('Sold out. Watch Instagram')
    expect(hero).not.toContain('Buy ticket')
    expect(hero).not.toContain('CZK')
  })

  it('shows neither Buy ticket nor a note when there is no ticket link and no note', async () => {
    const hero = heroOf(await featuring(event('ball', { title: localised('Czech Ball') })))

    expect(hero).toContain('Czech Ball')
    expect(hero).not.toContain('Buy ticket')
    expect(hero).not.toContain('data-ticket-note')
  })

  it('shows no Buy ticket, price or Ticket note once the Featured event has ended', async () => {
    const ball = event('ball', {
      title: localised('Czech Ball'),
      startsAt: '2026-09-30T18:00:00Z',
      ticketUrl: 'https://tickets.example/ball',
      ticketNote: localised('Sold out'),
      priceTiers: tiers,
    })

    const hero = heroOf(await featuring(ball))

    expect(hero).toContain('Czech Ball')
    expect(hero).not.toContain('Buy ticket')
    expect(hero).not.toContain('Sold out')
    expect(hero).not.toContain('CZK')
  })

  it('shows the Homepage’s own ESN Prague United content when nothing is featured', async () => {
    const hero = heroOf(await featuring(null))

    expect(hero).toContain('Your exchange in Prague starts here')
    expect(hero).toContain('Trips, parties and a local buddy.')
    expect(hero).toContain('href="https://example.com/sections"')
    expect(hero).toContain('Get an ESN card')
    expect(hero).not.toContain('Buy ticket')
  })
})

describe('homepage upcoming events', () => {
  it('never lists the Featured event and caps the list at 4, soonest first', async () => {
    const ball = event('ball', { title: localised('Czech Ball') })
    const upcoming = ['e5', 'e3', 'e1', 'e4', 'e2'].map((id) =>
      event(id, { title: localised(`Trip ${id}`), startsAt: `2026-10-1${id[1]}T10:00:00Z` }),
    )

    const block = upcomingOf(await featuring(ball, ...upcoming))

    expect(block).not.toContain('Czech Ball')
    expect(block.match(/Trip e\d/g)).toEqual(['Trip e1', 'Trip e2', 'Trip e3', 'Trip e4'])
  })

  it('shows only the date and title of each Event', async () => {
    const next = event('next', {
      title: localised('Kutná Hora trip'),
      summary: localised('A day among the bones.'),
      startsAt: FUTURE,
    })

    const block = upcomingOf(await featuring(null, next))

    expect(block).toContain('Kutná Hora trip')
    expect(block).toContain('26 Nov')
    expect(block).not.toContain('A day among the bones.')
  })

  it('shows the date range for an Event with Sessions', async () => {
    const salsa = event('salsa', {
      title: localised('Salsa classes'),
      startsAt: '2026-10-05T17:00:00Z',
      endsAt: '2026-12-15T21:00:00Z',
      sessions: [{ _key: 's1', _type: 'session', startsAt: '2026-10-05T17:00:00Z' }],
    })

    const block = upcomingOf(await featuring(null, salsa))

    expect(block).toContain('5 Oct – 15 Dec')
  })

  it('leaves out Events that have ended', async () => {
    const past = event('past', {
      title: localised('Welcome party'),
      startsAt: '2026-09-20T18:00:00Z',
    })
    const next = event('next', { title: localised('Kutná Hora trip'), startsAt: FUTURE })

    const block = upcomingOf(await featuring(null, past, next))

    expect(block).toContain('Kutná Hora trip')
    expect(block).not.toContain('Welcome party')
  })

  it('is hidden when only the Featured event is upcoming', async () => {
    const html = await featuring(event('ball'))

    expect(upcomingOf(html)).toBe('')
    expect(html).not.toContain('New events coming soon')
  })

  it('says New events coming soon, with no Instagram link, when nothing is upcoming or featured', async () => {
    const block = upcomingOf(await featuring(null))

    expect(block).toContain('New events coming soon')
    expect(block).not.toMatch(/instagram/i)
  })

  it('has no Full calendar link', async () => {
    const html = await featuring(null, event('next', { startsAt: FUTURE }))

    expect(html).not.toMatch(/full calendar/i)
  })
})

describe('homepage content blocks', () => {
  it('renders About with at most 4 numbers and at most 4 Quick links', async () => {
    const stats = [1, 2, 3, 4, 5].map((n) => ({
      _key: `s${n}`,
      value: `${n}00+`,
      label: localised(`stat ${n}`),
    }))
    const links = [1, 2, 3, 4, 5].map((n) => ({
      _key: `l${n}`,
      label: localised(`Quick ${n}`),
      url: `https://example.com/${n}`,
    }))
    const html = await renderPage(Home, {
      now: NOW,
      documents: [
        siteSettings(),
        homepage({
          about: {
            heading: localised('About ESN Prague United'),
            text: richText('Five sections, one city.'),
            stats,
          },
          highlightedLinks: links,
        }),
      ],
    })

    expect(html).toContain('About ESN Prague United')
    expect(html).toContain('<p>Five sections, one city.</p>')
    expect(html).toContain('400+')
    expect(html).not.toContain('500+')
    expect(html).toContain('href="https://example.com/4"')
    expect(html).not.toContain('Quick 5')
  })

  it('leaves out Quick links past their Hide after date', async () => {
    const expired = {
      _key: 'old',
      label: localised('Orientation week'),
      url: 'https://example.com/ow',
      visibleUntil: '2026-09-30T00:00:00Z',
    }
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ highlightedLinks: [expired] })],
    })

    expect(html).not.toContain('Orientation week')
  })
})

describe('homepage Sections block', () => {
  const sectionsOf = (html: string) =>
    html.match(/<section[^>]*data-sections[\s\S]*?<\/section>/)?.[0] ?? ''

  it('shows the 5 Sections in website order in the same colours as the Sections list', async () => {
    const [cu, ctu, vse, czu, uct] = allSections()

    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage(), czu, uct, cu, vse, ctu],
    })
    const block = sectionsOf(html)

    expect(block).toMatch(
      /ESN CU Prague[\s\S]*ESN CTU Prague[\s\S]*ESN VSE Prague[\s\S]*ESN CZU Prague[\s\S]*ESN UCT Prague/,
    )
    expect(block).toMatch(/href="\/sections\/esn-cu"[^>]*var\(--color-esn-magenta\)/)
    expect(block).toMatch(/href="\/sections\/esn-ctu"[^>]*var\(--color-esn-blue\)/)
    expect(block).toMatch(/href="\/sections\/esn-vse"[^>]*var\(--color-esn-orange\)/)
    expect(block).toMatch(/href="\/sections\/esn-czu"[^>]*var\(--color-esn-green\)/)
    expect(block).toMatch(/href="\/sections\/esn-uct"[^>]*var\(--color-esn-cyan\)/)
  })

  it('shows no Section logo or logo placeholder, even when every Section has a logo', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage(), ...allSections()],
    })
    const tiles = sectionsOf(html).match(/<a[^>]*data-section-tile[\s\S]*?<\/a>/g) ?? []

    expect(tiles).toHaveLength(5)
    tiles.forEach((tile) => {
      expect(tile).not.toContain('<img')
      expect(tile).not.toContain('<div')
      expect(tile).not.toContain('/logo')
    })
  })

  it('is hidden when the Homepage turns the Sections block off', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showSections: false }), ...allSections()],
    })

    expect(html).not.toContain('data-sections')
    expect(html).not.toContain('ESN CU Prague')
  })
})

describe('homepage Latest albums block', () => {
  const albumsOf = (html: string) =>
    html.match(/<section[^>]*data-latest-albums[\s\S]*?<\/section>/)?.[0] ?? ''

  const albums = ['2026-09-01', '2026-09-20', '2026-08-15', '2026-09-10', '2026-07-30'].map(
    (date, i) => album(`album-${i}`, { title: localised(`Album from ${date}`), date }),
  )

  it('shows the 4 latest Albums, newest first, when Show latest photo albums is on', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showGallery: true }), ...albums],
    })
    const block = albumsOf(html)

    expect(block).toMatch(
      /Album from 2026-09-20[\s\S]*Album from 2026-09-10[\s\S]*Album from 2026-09-01[\s\S]*Album from 2026-08-15/,
    )
    expect(block).not.toContain('Album from 2026-07-30')
    expect(block).toContain('href="/gallery"')
  })

  it('is shown when the Homepage has never set Show latest photo albums', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage(), ...albums],
    })

    expect(albumsOf(html)).toContain('Album from 2026-09-20')
  })

  it('shows no Albums when Show latest photo albums is off', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showGallery: false }), ...albums],
    })

    expect(html).not.toContain('data-latest-albums')
    expect(html).not.toContain('Album from')
  })

  it('is hidden when there are no Albums yet', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showGallery: true })],
    })

    expect(html).not.toContain('data-latest-albums')
  })
})

describe('homepage Updates block', () => {
  const updatesOf = (html: string) =>
    html.match(/<section[^>]*data-updates[\s\S]*?<\/section>/)?.[0] ?? ''

  const posts = [
    instagramPost('a', 'https://www.instagram.com/p/AAA111/'),
    instagramPost('b', 'https://instagram.com/reel/BBB222?igsh=tracking'),
    instagramPost('c', 'https://www.instagram.com/p/CCC333'),
  ]

  const withUpdates = (updates: Record<string, unknown> | undefined, ...others: Doc[]) =>
    renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage(updates ? { updates } : {}), ...posts, ...others],
    })

  const picked = (...ids: string[]) => ({ posts: ids.map(instagramPostRef) })

  it('is hidden when no Instagram posts are picked', async () => {
    const html = await withUpdates(undefined)

    expect(html).not.toContain('data-updates')
    expect(await withUpdates({ heading: localised('Updates'), posts: [] })).not.toContain(
      'data-updates',
    )
  })

  it('is hidden when Show the Updates block is off, even with posts picked', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showUpdates: false, updates: picked('a') }), ...posts],
    })

    expect(html).not.toContain('data-updates')
    expect(html).not.toContain('data-instagram-post')
  })

  it('comes after the Sections block and before Latest albums, with posts in the editor’s order', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [
        siteSettings(),
        homepage({ updates: picked('c', 'a', 'b') }),
        ...posts,
        ...allSections(),
        album('ball', { title: localised('Czech Ball photos') }),
      ],
    })

    const sectionsAt = html.indexOf('data-sections')
    const updatesAt = html.indexOf('data-updates')
    const albumsAt = html.indexOf('data-latest-albums')
    expect(sectionsAt).toBeGreaterThan(-1)
    expect(updatesAt).toBeGreaterThan(sectionsAt)
    expect(albumsAt).toBeGreaterThan(updatesAt)
    expect(updatesOf(html).match(/data-instagram-post="[^"]*"/g)).toEqual([
      'data-instagram-post="https://www.instagram.com/p/CCC333/"',
      'data-instagram-post="https://www.instagram.com/p/AAA111/"',
      'data-instagram-post="https://www.instagram.com/reel/BBB222/"',
    ])
  })

  it('shows the editor’s heading, and Updates when none is set', async () => {
    const renamed = updatesOf(
      await withUpdates({ heading: localised('Czech Ball news'), ...picked('a') }),
    )
    const unnamed = updatesOf(await withUpdates(picked('a')))

    expect(renamed).toMatch(/<h2[^>]*>\s*Czech Ball news\s*<\/h2>/)
    expect(unnamed).toMatch(/<h2[^>]*>\s*Updates\s*<\/h2>/)
  })

  it('shows one post without arrows, and two or more with arrows', async () => {
    const one = updatesOf(await withUpdates(picked('a')))
    const two = updatesOf(await withUpdates(picked('a', 'b')))

    expect(one).toContain('data-instagram-post=')
    expect(one).not.toContain('data-carousel-prev')
    expect(one).not.toContain('data-carousel-next')
    expect(two).toMatch(/<button[^>]*data-carousel-prev[^>]*aria-label="Previous post"/)
    expect(two).toMatch(/<button[^>]*data-carousel-next[^>]*aria-label="Next post"/)
  })

  it('links each card to the normalised post link in a new tab, with no Instagram script or iframe', async () => {
    const html = await withUpdates(picked('b'))
    const block = updatesOf(html)

    expect(block).toMatch(
      /<a[^>]*href="https:\/\/www\.instagram\.com\/reel\/BBB222\/"[^>]*target="_blank"[^>]*>\s*View on Instagram/,
    )
    expect(block).not.toContain('igsh')
    expect(html).not.toMatch(/instagram\.com\/embed|<iframe/)
  })

  it('shows a post once when two picked Instagram posts link to it', async () => {
    const copy = instagramPost('copy', 'https://instagram.com/p/AAA111?igsh=other')
    const block = updatesOf(await withUpdates(picked('a', 'copy', 'c'), copy))

    expect(block.match(/data-instagram-post="[^"]*"/g)).toEqual([
      'data-instagram-post="https://www.instagram.com/p/AAA111/"',
      'data-instagram-post="https://www.instagram.com/p/CCC333/"',
    ])
  })

  it('skips a broken reference or an invalid link, and is hidden when none remain', async () => {
    const profile = instagramPost('profile', 'https://www.instagram.com/esnprague/')
    const mixed = updatesOf(await withUpdates(picked('a', 'deleted', 'profile', 'c'), profile))
    const noneLeft = await withUpdates(picked('deleted', 'profile'), profile)

    expect(mixed.match(/data-instagram-post="[^"]*"/g)).toEqual([
      'data-instagram-post="https://www.instagram.com/p/AAA111/"',
      'data-instagram-post="https://www.instagram.com/p/CCC333/"',
    ])
    expect(noneLeft).not.toContain('data-updates')
  })
})

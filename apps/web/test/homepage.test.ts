import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import { allSections, event, homepage, localised, richText, siteSettings } from './fixtures'

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

  it('says New events coming soon with the Instagram link when nothing is upcoming or featured', async () => {
    const block = upcomingOf(await featuring(null))

    expect(block).toContain('New events coming soon')
    expect(block).toContain('href="https://instagram.com/esnprague"')
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

  it('is hidden when the Homepage turns the Sections block off', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [siteSettings(), homepage({ showSections: false }), ...allSections()],
    })

    expect(html).not.toContain('data-sections')
    expect(html).not.toContain('ESN CU Prague')
  })
})

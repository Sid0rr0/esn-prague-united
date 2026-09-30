import { describe, expect, it } from 'vitest'
import EventPage from '../src/pages/events/[slug].astro'
import { renderPage } from './seam'
import { event, localised, siteSettings } from './fixtures'
import { uiString } from '../src/lib/ui-strings'

const NOW = '2026-10-01T10:00:00Z'
const ENDED = { startsAt: '2026-09-30T18:00:00Z', endsAt: '2026-09-30T23:00:00Z' }
const UPCOMING = { startsAt: '2026-12-01T18:00:00Z' }

type Doc = ReturnType<typeof event>

const relate = (...ids: string[]) =>
  ids.map((id) => ({ _key: id, _type: 'reference', _ref: id, _weak: true }))

const render = (page: Doc, ...others: Doc[]) =>
  renderPage(EventPage, {
    now: NOW,
    params: { slug: page._id },
    documents: [siteSettings(), page, ...others],
  })

const blockOf = (html: string) =>
  html.match(/<section[^>]*data-related-events[\s\S]*?<\/section>/)?.[0] ?? ''
const cardLinksOf = (html: string) =>
  [...blockOf(html).matchAll(/<a[^>]*data-event-card[^>]*href="([^"]*)"/g)].map((m) => m[1])

describe('Related events on the Event page', () => {
  it('renders no block when an Event has none', async () => {
    const html = await render(event('ball'))

    expect(html).not.toContain('Related events')
    expect(html).not.toContain('See all events')
  })

  it('renders Event cards linking to their pages, in the editor order, whatever their dates', async () => {
    const ball = event('ball', { ...UPCOMING, relatedEvents: relate('later', 'earlier') })
    const earlier = event('earlier', {
      title: localised('Earlier'),
      startsAt: '2026-11-01T18:00:00Z',
    })
    const later = event('later', { title: localised('Later'), startsAt: '2027-01-01T18:00:00Z' })

    const html = await render(ball, earlier, later)

    expect(blockOf(html)).toContain('Related events')
    expect(cardLinksOf(html)).toEqual(['/events/later', '/events/earlier'])
  })

  it('shows a Related event that has ended next to an upcoming one', async () => {
    const ball = event('ball', { ...UPCOMING, relatedEvents: relate('last-year', 'afterparty') })
    const lastYear = event('last-year', ENDED)
    const afterparty = event('afterparty', UPCOMING)

    const html = await render(ball, lastYear, afterparty)

    expect(cardLinksOf(html)).toEqual(['/events/last-year', '/events/afterparty'])
  })

  it('still shows the Related events on a Past event page', async () => {
    const ball = event('ball', { ...ENDED, relatedEvents: relate('next-year') })

    const html = await render(ball, event('next-year', UPCOMING))

    expect(cardLinksOf(html)).toEqual(['/events/next-year'])
  })

  it('skips an entry pointing to a missing Event or one with no slug, and renders the rest', async () => {
    const ball = event('ball', { relatedEvents: relate('gone', 'no-slug', 'fine') })
    const noSlug = { ...event('no-slug'), slug: undefined }

    const html = await render(ball, noSlug, event('fine'))

    expect(cardLinksOf(html)).toEqual(['/events/fine'])
  })

  it('renders no block when every entry is broken', async () => {
    const ball = event('ball', { relatedEvents: relate('gone', 'no-slug') })
    const noSlug = { ...event('no-slug'), slug: undefined }

    const html = await render(ball, noSlug)

    expect(html).not.toContain('Related events')
    expect(html).not.toContain('See all events')
  })

  it('links to the Events list from the block', async () => {
    const ball = event('ball', { relatedEvents: relate('other') })

    const html = await render(ball, event('other'))

    expect(blockOf(html)).toMatch(/<a[^>]*href="\/events"[^>]*>\s*See all events\s*<\/a>/)
  })

  it('is one-way: the picked Event shows nothing for it', async () => {
    const ball = event('ball', { relatedEvents: relate('other') })

    const html = await render(event('other'), ball)

    expect(html).not.toContain('Related events')
  })
})

describe('Related events copy', () => {
  it('has Czech translations for the heading and the link', () => {
    expect(uiString('relatedEventsHeading', 'cs')).toBe('Související akce')
    expect(uiString('seeAllEvents', 'cs')).toBe('Všechny akce')
  })

  it('shows the date range on a Related event with Sessions', async () => {
    const ball = event('ball', { ...UPCOMING, relatedEvents: relate('salsa') })
    const salsa = event('salsa', {
      startsAt: '2026-10-05T17:00:00Z',
      endsAt: '2026-12-15T21:00:00Z',
      sessions: [{ _key: 's1', _type: 'session', startsAt: '2026-10-05T17:00:00Z' }],
    })

    const html = await render(ball, salsa)

    expect(blockOf(html)).toContain('From 5 Oct')
  })
})

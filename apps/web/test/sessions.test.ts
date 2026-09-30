import { describe, expect, it } from 'vitest'
import EventPage from '../src/pages/events/[slug].astro'
import { renderPage } from './seam'
import { event, localised, siteSettings } from './fixtures'
import { readEvent } from '../src/lib/events'
import { uiString } from '../src/lib/ui-strings'

const NOW = '2026-10-01T10:00:00Z'
const UPCOMING = { startsAt: '2026-10-05T18:00:00Z', endsAt: '2026-12-15T21:00:00Z' }
const ENDED = { startsAt: '2026-09-01T18:00:00Z', endsAt: '2026-09-30T23:00:00Z' }

type Doc = ReturnType<typeof event>

const session = (key: string, startsAt: string, overrides: Record<string, unknown> = {}) => ({
  _key: key,
  _type: 'session',
  startsAt,
  ...overrides,
})

const render = (page: Doc) =>
  renderPage(EventPage, {
    now: NOW,
    params: { slug: page._id },
    documents: [siteSettings(), page],
  })

const sectionOf = (html: string) =>
  html.match(/<section[^>]*data-sessions[\s\S]*?<\/section>/)?.[0] ?? ''
const rowsOf = (html: string) =>
  [...sectionOf(html).matchAll(/<li[^>]*data-session-row[\s\S]*?<\/li>/g)].map((m) => m[0])
const textOf = (fragment: string) =>
  fragment
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

describe('Sessions on the Event page', () => {
  it('renders no "Dates & tickets" section for an Event without Sessions', async () => {
    const html = await render(event('ball', UPCOMING))

    expect(html).not.toContain('Dates &amp; tickets')
    expect(sectionOf(html)).toBe('')
  })

  it('renders upcoming Sessions as rows sorted by Starts, whatever order they were entered in', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [
        session('c', '2026-11-12T18:00:00Z'),
        session('a', '2026-11-05T18:00:00Z'),
        session('b', '2026-11-08T18:00:00Z'),
      ],
    })

    const rows = rowsOf(await render(salsa)).map(textOf)

    expect(rows).toHaveLength(3)
    expect(rows[0]).toContain('Thu 5 Nov')
    expect(rows[1]).toContain('Sun 8 Nov')
    expect(rows[2]).toContain('Thu 12 Nov')
  })

  it('puts the section after the description and before the programme', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      programme: [{ _key: 'p', time: '19:00', title: localised('Warm-up') }],
      sessions: [session('a', '2026-11-05T18:00:00Z')],
    })

    const html = await render(salsa)

    expect(html.indexOf('data-sessions')).toBeGreaterThan(-1)
    expect(html.indexOf('data-sessions')).toBeLessThan(html.indexOf('Programme'))
    expect(sectionOf(html)).toMatch(/<h2[^>]*>\s*Dates &amp; tickets\s*<\/h2>/)
    expect(sectionOf(html)).toContain('id="sessions"')
  })

  it('does not show an ended Session; a Session without Ends counts as ended once its Starts has passed', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [
        session('ended-with-end', '2026-09-30T18:00:00Z', { endsAt: '2026-09-30T20:00:00Z' }),
        session('ended-no-end', '2026-10-01T08:00:00Z'),
        session('running', '2026-10-01T08:00:00Z', { endsAt: '2026-10-01T12:00:00Z' }),
        session('later', '2026-11-05T18:00:00Z'),
      ],
    })

    const rows = rowsOf(await render(salsa)).map(textOf)

    expect(rows).toHaveLength(2)
    expect(rows[0]).toContain('Thu 1 Oct')
    expect(rows[1]).toContain('Thu 5 Nov')
  })

  it('shows Buy ticket linking to the Ticket link, or the Note when there is no link', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [
        session('a', '2026-11-05T18:00:00Z', { ticketUrl: 'https://tickets.example/a' }),
        session('b', '2026-11-08T18:00:00Z', { note: localised('Sold out') }),
        session('c', '2026-11-12T18:00:00Z'),
      ],
    })

    const [linked, noted, bare] = rowsOf(await render(salsa))

    expect(linked).toMatch(/<a[^>]*href="https:\/\/tickets\.example\/a"[^>]*>\s*Buy ticket\s*<\/a>/)
    expect(noted).toContain('Sold out')
    expect(noted).not.toContain('Buy ticket')
    expect(noted).not.toContain('<a ')
    expect(bare).not.toContain('Buy ticket')
    expect(bare).not.toContain('<a ')
  })

  it('shows "19:00–20:30" with Ends and "19:00" without', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [
        session('a', '2026-11-05T18:00:00Z', { endsAt: '2026-11-05T19:30:00Z' }),
        session('b', '2026-11-08T18:00:00Z'),
      ],
    })

    const [withEnd, withoutEnd] = rowsOf(await render(salsa)).map(textOf)

    expect(withEnd).toContain('19:00–20:30')
    expect(withoutEnd).toContain('19:00')
    expect(withoutEnd).not.toContain('–')
  })

  it('renders no section when every Session has ended', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [session('a', '2026-09-20T18:00:00Z'), session('b', '2026-09-27T18:00:00Z')],
    })

    const html = await render(salsa)

    expect(sectionOf(html)).toBe('')
    expect(html).not.toContain('Dates &amp; tickets')
  })

  it('renders no section on a Past event page', async () => {
    const salsa = event('salsa', {
      ...ENDED,
      sessions: [session('a', '2026-11-05T18:00:00Z')],
    })

    expect(sectionOf(await render(salsa))).toBe('')
  })

  it('leaves the Ticket area as it was', async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      ticketUrl: 'https://tickets.example/salsa',
      sessions: [session('a', '2026-11-05T18:00:00Z')],
    })

    const html = await render(salsa)

    expect(html).toContain('data-ticket-sidebar')
    expect(html).toContain('href="https://tickets.example/salsa"')
  })
})

describe('Sessions in Czech', () => {
  it('has a Czech heading', () => {
    expect(uiString('sessionsHeading')).toBe('Dates & tickets')
    expect(uiString('sessionsHeading', 'cs')).toBe('Termíny a vstupenky')
  })

  it("reads each Session's Note in Czech", async () => {
    const salsa = event('salsa', {
      ...UPCOMING,
      sessions: [
        session('a', '2026-11-05T18:00:00Z', { note: localised('Sold out', 'Vyprodáno') }),
      ],
    })
    await render(salsa)

    const czech = await readEvent('salsa', 'cs')

    expect(czech?.sessions?.map((s) => s.note)).toEqual(['Vyprodáno'])
  })
})

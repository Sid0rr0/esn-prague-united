import { describe, expect, it } from 'vitest'
import EventsPage from '../src/pages/events/index.astro'
import { renderPage } from './seam'
import { event, homepage, localised, photo, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const render = (...documents: { _id: string; _type: string }[]) =>
  renderPage(EventsPage, { now: NOW, documents: [siteSettings(), ...documents] })

const cardsOf = (html: string) => html.match(/<a[^>]*data-event-card[\s\S]*?<\/a>/g) ?? []
const upcomingOf = (html: string) =>
  html.match(/<section[^>]*data-upcoming[\s\S]*?<\/section>/)?.[0] ?? ''
const pastOf = (html: string) => html.match(/<section[^>]*data-past[\s\S]*?<\/section>/)?.[0] ?? ''

describe('Events list page', () => {
  it('renders inside the shared header and footer with the Events page header', async () => {
    const html = await render()

    expect(html).toMatch(/<header[^>]*>[\s\S]*href="\/gallery"[\s\S]*<\/header>/)
    expect(html).toContain('<footer')
    expect(html).toMatch(/<h1[^>]*>Events<\/h1>/)
    expect(html).toContain('Balls, trips and parties run by ESN Prague United.')
    expect(html).toContain('bg-cyan-50')
  })

  it('lists Upcoming events soonest first, each card linking to its Event page with image, title, date and venue', async () => {
    const hero = photo('ball')
    const later = event('ball', {
      title: localised('Czech Ball'),
      startsAt: '2026-11-26T17:00:00Z',
      venue: { name: localised('Žofín Palace') },
      heroImage: hero.photo,
    })
    const sooner = event('kutna-hora', {
      title: localised('Kutná Hora trip'),
      startsAt: '2026-10-10T07:00:00Z',
    })
    const ended = event('welcome', {
      title: localised('Welcome party'),
      startsAt: '2026-09-20T18:00:00Z',
    })

    const cards = cardsOf(upcomingOf(await render(later, ended, sooner, hero.asset)))

    expect(cards).toHaveLength(2)
    expect(cards[0]).toContain('Kutná Hora trip')
    expect(cards[0]).toContain('href="/events/kutna-hora"')
    expect(cards[0]).toContain('Saturday 10 October')
    expect(cards[1]).toContain('Czech Ball')
    expect(cards[1]).toContain('href="/events/ball"')
    expect(cards[1]).toMatch(/<img[^>]*ball-1200x800\.jpg/)
    expect(cards[1]).toContain('Thursday 26 November')
    expect(cards[1]).toContain('Žofín Palace')
  })

  it('shows no price or Ticket note on cards, even when the Event has them', async () => {
    const tiers = [{ _key: 't1', label: localised('With ESN card'), amount: 590 }]
    const onSale = event('ball', { ticketUrl: 'https://tickets.example/ball', priceTiers: tiers })
    const soldOut = event('trip', { ticketNote: localised('Sold out. Watch Instagram') })

    const cards = cardsOf(await render(onSale, soldOut))

    expect(cards).toHaveLength(2)
    cards.forEach((card) => {
      expect(card).not.toContain('CZK')
      expect(card).not.toContain('Sold out')
      expect(card).not.toContain('Buy ticket')
    })
  })

  it('lists the Featured event in the Upcoming group as a normal card', async () => {
    const ball = event('ball', { title: localised('Czech Ball'), startsAt: '2026-11-26T17:00:00Z' })
    const trip = event('trip', {
      title: localised('Kutná Hora trip'),
      startsAt: '2026-10-10T07:00:00Z',
    })
    const home = homepage({ featuredEvent: { _type: 'reference', _ref: ball._id } })

    const cards = cardsOf(upcomingOf(await render(home, ball, trip)))

    expect(cards).toHaveLength(2)
    expect(cards[1]).toContain('Czech Ball')
  })

  it('keeps the Upcoming heading and says New events coming soon when nothing is upcoming', async () => {
    const past = event('welcome', { startsAt: '2026-09-20T18:00:00Z' })

    const block = upcomingOf(await render(past))

    expect(block).toMatch(/<h2[^>]*>\s*Upcoming\s*<\/h2>/)
    expect(block).toContain('New events coming soon')
    expect(block).not.toMatch(/instagram/i)
    expect(cardsOf(block)).toHaveLength(0)
  })

  it('lists Past events below Upcoming events, newest first', async () => {
    const upcoming = event('ball', { title: localised('Czech Ball') })
    const older = event('welcome', {
      title: localised('Welcome party'),
      startsAt: '2026-09-02T18:00:00Z',
    })
    const newer = event('pub-crawl', {
      title: localised('Pub crawl'),
      startsAt: '2026-09-20T18:00:00Z',
    })

    const html = await render(older, upcoming, newer)
    const cards = cardsOf(pastOf(html))

    expect(html.indexOf('data-past')).toBeGreaterThan(html.indexOf('data-upcoming'))
    expect(pastOf(html)).toMatch(/<h2[^>]*>\s*Past\s*<\/h2>/)
    expect(cards).toHaveLength(2)
    expect(cards[0]).toContain('Pub crawl')
    expect(cards[0]).toContain('href="/events/pub-crawl"')
    expect(cards[1]).toContain('Welcome party')
  })

  it('orders Past events by when they ended, so a long trip that ended later comes first', async () => {
    const trip = event('trip', {
      title: localised('Balkan trip'),
      startsAt: '2026-09-10T07:00:00Z',
      endsAt: '2026-09-25T20:00:00Z',
    })
    const party = event('party', {
      title: localised('Welcome party'),
      startsAt: '2026-09-20T18:00:00Z',
    })

    const cards = cardsOf(pastOf(await render(party, trip)))

    expect(cards[0]).toContain('Balkan trip')
    expect(cards[1]).toContain('Welcome party')
  })

  it('treats an Event whose end time has passed as past, even if it started recently', async () => {
    const ended = event('brunch', {
      title: localised('Brunch'),
      startsAt: '2026-10-01T08:00:00Z',
      endsAt: '2026-10-01T09:30:00Z',
    })

    const html = await render(ended)

    expect(cardsOf(pastOf(html))).toHaveLength(1)
    expect(cardsOf(upcomingOf(html))).toHaveLength(0)
  })

  it('treats an Event with no end time as past once its start time has passed', async () => {
    const started = event('party', { startsAt: '2026-10-01T09:00:00Z' })

    const html = await render(started)

    expect(cardsOf(pastOf(html))).toHaveLength(1)
    expect(cardsOf(upcomingOf(html))).toHaveLength(0)
  })

  it('keeps an Event that has started but not ended in Upcoming', async () => {
    const running = event('trip', {
      startsAt: '2026-09-30T07:00:00Z',
      endsAt: '2026-10-02T20:00:00Z',
    })

    const html = await render(running)

    expect(cardsOf(upcomingOf(html))).toHaveLength(1)
    expect(pastOf(html)).toBe('')
  })

  it('hides the Past heading when there are no Past events', async () => {
    const withUpcomingOnly = await render(event('ball'))
    const withNoEvents = await render()

    for (const html of [withUpcomingOnly, withNoEvents]) {
      expect(html).not.toContain('data-past')
      expect(html).not.toMatch(/<h2[^>]*>\s*Past\s*<\/h2>/)
    }
    expect(upcomingOf(withNoEvents)).toContain('New events coming soon')
  })
})

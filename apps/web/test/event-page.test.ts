import { describe, expect, it } from 'vitest'
import EventPage from '../src/pages/events/[slug].astro'
import { renderPage, renderPageResponse } from './seam'
import { event, localised, richText, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'
const PAST_START = '2026-09-30T18:00:00Z'
const PAST_END = '2026-09-30T23:00:00Z'
const LATER_TODAY = '2026-10-01T22:00:00Z'

const tiers = [
  { _key: 't1', label: localised('With ESN card'), amount: 590 },
  { _key: 't2', label: localised('Without ESN card'), amount: 690 },
  { _key: 't3', label: localised('Door sale'), amount: 790 },
]

const album = {
  _id: 'album-ball',
  _type: 'album',
  title: localised('Czech Ball 2026'),
  slug: { current: 'czech-ball-2026' },
}

type Doc = ReturnType<typeof event>

const renderEvent = (doc: Doc, ...others: Doc[]) =>
  renderPage(EventPage, {
    now: NOW,
    params: { slug: doc._id },
    documents: [siteSettings(), doc, ...others],
  })

const blockOf = (html: string, marker: string) =>
  html.match(new RegExp(`<(aside|div)[^>]*${marker}[\\s\\S]*?</\\1>`))?.[0] ?? ''
const sidebarOf = (html: string) => blockOf(html, 'data-ticket-sidebar')
const stickyBarOf = (html: string) => blockOf(html, 'data-sticky-bar')
/**
 * The extra room at the bottom on mobile that keeps the sticky bar off the last content,
 * reset on desktop. Rendered HTML only shows it as padding classes, so those stand in for it.
 */
const hasRoomForStickyBar = (html: string) => /\bpb-28 lg:pb-14\b/.test(html)

/** The ticket UI a visitor could act on: Buy button, any price, Ticket note, sticky bar. */
const expectNoTicketUi = (html: string) => {
  expect(html).not.toContain('Buy ticket')
  expect(html).not.toContain('CZK')
  expect(html).not.toContain('Sold out')
  expect(html).not.toContain('data-sticky-bar')
}

describe('Event page', () => {
  it('shows the hero facts, programme, dress code, getting there and the Event FAQ', async () => {
    const ball = event('ball', {
      title: localised('Czech Ball'),
      startsAt: '2026-11-26T17:00:00Z',
      endsAt: '2026-11-27T01:00:00Z',
      venue: {
        name: 'Radiopalác',
        address: 'Vinohradská 40, Praha 2',
        mapUrl: 'https://maps.example/radiopalac',
        transport: localised('Tram 11 to Vinohradská tržnice.'),
      },
      programme: [
        { _key: 'p1', time: '18:00', title: localised('Doors open') },
        { _key: 'p2', time: '19:30', title: localised('Opening waltz') },
      ],
      dressCode: richText('Black tie. Ball gowns welcome.'),
      faq: [
        {
          _key: 'q1',
          question: localised('Can I bring a friend?'),
          answer: richText('Yes, with their own ticket.'),
        },
      ],
    })

    const html = await renderEvent(ball)

    expect(html).toContain('Czech Ball')
    expect(html).toContain('Thursday 26 November')
    expect(html).toContain('18:00–02:00')
    expect(html).toContain('Radiopalác')
    expect(html).toMatch(/18:00[\s\S]*Doors open[\s\S]*19:30[\s\S]*Opening waltz/)
    expect(html).toContain('<p>Black tie. Ball gowns welcome.</p>')
    expect(html).toContain('Vinohradská 40, Praha 2')
    expect(html).toContain('Tram 11 to Vinohradská tržnice.')
    expect(html).toMatch(/href="https:\/\/maps\.example\/radiopalac"[^>]*>\s*Open in Maps/)
    expect(html).toMatch(/id="questions"[\s\S]*<details[\s\S]*Can I bring a friend\?/)
    expect(html).toContain('<p>Yes, with their own ticket.</p>')
  })

  it('lists every Price tier in the sidebar and the first tier’s price in the sticky bar', async () => {
    const ball = event('ball', {
      ticketUrl: 'https://tickets.example/ball',
      priceTiers: tiers,
      ticketInfo: richText('Sales end on 20 November.'),
    })

    const html = await renderEvent(ball)
    const sidebar = sidebarOf(html)
    const sticky = stickyBarOf(html)

    expect(sidebar).toMatch(
      /With ESN card[\s\S]*590 CZK[\s\S]*Without ESN card[\s\S]*690 CZK[\s\S]*Door sale[\s\S]*790 CZK/,
    )
    expect(sidebar).toMatch(/Buy ticket[\s\S]*Sales end on 20 November\./)
    expect(sticky).toMatch(/href="https:\/\/tickets\.example\/ball"[^>]*>[\s\S]*Buy ticket/)
    expect(sticky).toContain('590 CZK')
    expect(sticky).not.toContain('690 CZK')
  })

  it('shows the Ticket note instead of Buy ticket in the sidebar and the sticky bar', async () => {
    const ball = event('ball', { ticketNote: localised('Sold out. Watch Instagram') })

    const html = await renderEvent(ball)

    expect(sidebarOf(html)).toContain('Sold out. Watch Instagram')
    expect(stickyBarOf(html)).toContain('Sold out. Watch Instagram')
    expect(html).not.toContain('Buy ticket')
  })

  it('shows neither Buy ticket nor a note when there is no ticket link and no note', async () => {
    const html = await renderEvent(event('ball'))

    expect(html).not.toContain('Buy ticket')
    expect(html).not.toContain('data-ticket-note')
    expect(html).not.toContain('data-sticky-bar')
  })

  it('shows Buy ticket with no price when there is a ticket link but no tiers', async () => {
    const html = await renderEvent(event('ball', { ticketUrl: 'https://tickets.example/ball' }))

    expect(sidebarOf(html)).toContain('Buy ticket')
    expect(stickyBarOf(html)).toContain('Buy ticket')
    expect(html).not.toContain('CZK')
  })

  it('still shows the ticket sidebar with the ticket info when that is all an Event has', async () => {
    const ball = event('ball', { ticketInfo: richText('Tickets go on sale on 1 November.') })

    const html = await renderEvent(ball)

    expect(sidebarOf(html)).toContain('Tickets go on sale on 1 November.')
    expectNoTicketUi(html)
    expect(html).not.toContain('data-ticket-note')
  })

  it.each([
    { with: 'Buy ticket', fields: { ticketUrl: 'https://tickets.example/ball' }, showsBar: true },
    { with: 'a Ticket note', fields: { ticketNote: localised('Sold out') }, showsBar: true },
    {
      with: 'Price tiers and ticket info but no ticket action',
      fields: { priceTiers: tiers, ticketInfo: richText('Sales end on 20 November.') },
      showsBar: false,
    },
    {
      with: 'a ticket link but an end time that has passed',
      fields: { startsAt: PAST_START, endsAt: PAST_END, ticketUrl: 'https://tickets.example/ball' },
      showsBar: false,
    },
  ])(
    'leaves room at the bottom on mobile only while the sticky bar shows: $with',
    async ({ fields, showsBar }) => {
      const html = await renderEvent(event('ball', fields))

      expect(html.includes('data-sticky-bar')).toBe(showsBar)
      expect(hasRoomForStickyBar(html)).toBe(showsBar)
    },
  )

  it('links to the Album and shows no ticket UI once the end time has passed', async () => {
    const ball = event('ball', {
      startsAt: PAST_START,
      endsAt: PAST_END,
      ticketUrl: 'https://tickets.example/ball',
      ticketNote: localised('Sold out'),
      priceTiers: tiers,
      album: { _type: 'reference', _ref: album._id },
    })

    const html = await renderEvent(ball, album)

    expect(html).toMatch(/href="\/gallery\/czech-ball-2026"/)
    expectNoTicketUi(html)
  })

  it('treats an Event with no end time as ended once its start time has passed', async () => {
    const ball = event('ball', {
      startsAt: PAST_START,
      ticketUrl: 'https://tickets.example/ball',
      priceTiers: tiers,
      album: { _type: 'reference', _ref: album._id },
    })

    const html = await renderEvent(ball, album)

    expect(html).toMatch(/href="\/gallery\/czech-ball-2026"/)
    expectNoTicketUi(html)
  })

  it('still sells tickets while an Event that has started has not reached its end time', async () => {
    const ball = event('ball', {
      startsAt: PAST_START,
      endsAt: LATER_TODAY,
      ticketUrl: 'https://tickets.example/ball',
      album: { _type: 'reference', _ref: album._id },
    })

    const html = await renderEvent(ball, album)

    expect(html).toContain('Buy ticket')
    expect(html).not.toContain('/gallery/czech-ball-2026')
  })

  it('shows no ticket UI and no Album link for an ended Event without an Album', async () => {
    const ball = event('ball', {
      startsAt: PAST_START,
      ticketNote: localised('Sold out'),
      ticketInfo: richText('Sales end on 20 November.'),
      priceTiers: tiers,
    })

    const html = await renderEvent(ball)

    expectNoTicketUi(html)
    expect(html).not.toContain('/gallery/')
    expect(html).not.toContain('Sales end on 20 November.')
  })

  it('renders no organisers', async () => {
    const ball = event('ball', {
      organisers: [{ _key: 'o1', _type: 'reference', _ref: 'section-cu' }],
    })
    const section = {
      _id: 'section-cu',
      _type: 'section',
      name: localised('ESN CU Prague'),
      slug: { current: 'cu' },
    }

    const html = await renderEvent(ball, section)

    expect(html).not.toMatch(/organi[sz]ed by/i)
    expect(html).not.toContain('ESN CU Prague')
  })
})

describe('Event page for an unknown slug', () => {
  it('answers 404', async () => {
    const response = await renderPageResponse(EventPage, {
      now: NOW,
      params: { slug: 'no-such-event' },
      documents: [siteSettings(), event('czech-ball')],
    })

    expect(response.status).toBe(404)
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { CONTACTS_QUERY, EVENT_QUERY, SECTION_QUERY } from '../src/lib/queries'
import { queryInMemory, renderPage } from './seam'

const NOW = '2026-10-01T10:00:00Z'

// Documents still holding data from before the design dropped it.
const section = { _id: 'sec-ctu', _type: 'section', name: 'ESN CTU', slug: { current: 'esn-ctu' } }
const event = {
  _id: 'ev-ball',
  _type: 'event',
  title: 'Czech Ball',
  slug: { current: 'czech-ball' },
  startsAt: '2026-11-20T19:00:00Z',
  organisers: [{ _key: 'o1', _type: 'reference', _ref: 'sec-ctu' }],
}
const album = {
  _id: 'alb-ball',
  _type: 'album',
  title: 'Czech Ball 2025',
  slug: { current: 'czech-ball-2025' },
  sections: [{ _key: 's1', _type: 'reference', _ref: 'sec-ctu' }],
}
const contactsPage = {
  _id: 'contactsPage',
  _type: 'contactsPage',
  title: 'Contact us',
  showSectionContacts: true,
  people: [{ _key: 'p1', _type: 'contactPerson', name: 'Jana' }],
}

beforeEach(async () => {
  await renderPage(Home, { now: NOW, documents: [section, event, album, contactsPage] })
})

describe('data the design dropped', () => {
  it('leaves organisers out of the Event', async () => {
    const result = await queryInMemory<Record<string, unknown>>(EVENT_QUERY, { slug: 'czech-ball' })

    expect(result.title).toBe('Czech Ball')
    expect(result).not.toHaveProperty('organisers')
  })

  it("leaves the Section's events and albums out of the Section", async () => {
    const result = await queryInMemory<Record<string, unknown>>(SECTION_QUERY, { slug: 'esn-ctu' })

    expect(result.name).toBe('ESN CTU')
    expect(result).not.toHaveProperty('events')
    expect(result).not.toHaveProperty('albums')
  })

  it('leaves people out of Contacts', async () => {
    const result = await queryInMemory<Record<string, unknown>>(CONTACTS_QUERY)

    expect(result.title).toBe('Contact us')
    expect(result).not.toHaveProperty('people')
    expect(result.sections).toEqual([expect.objectContaining({ name: 'ESN CTU' })])
  })
})

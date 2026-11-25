import { describe, expect, it } from 'vitest'
import EventPage from '../src/pages/events/[slug].astro'
import { renderPage } from './seam'
import { event, faqEntry, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'
const ENDED = { startsAt: '2026-09-30T18:00:00Z', endsAt: '2026-09-30T23:00:00Z' }

/** A Partner with its logo's image asset, as the Studio stores them. */
const partner = (id: string, overrides: Record<string, unknown> = {}) => ({
  partner: {
    _id: id,
    _type: 'partner',
    name: `Partner ${id}`,
    logo: { _type: 'image', asset: { _type: 'reference', _ref: `image-${id}-200x100-png` } },
    ...overrides,
  },
  asset: {
    _id: `image-${id}-200x100-png`,
    _type: 'sanity.imageAsset',
    url: `https://cdn.sanity.io/images/p/d/${id}-200x100.png`,
  },
})

const credit = (id: string, partnerGroup = 'partner') => ({
  _key: `credit-${id}`,
  _type: 'partnerCredit',
  partner: { _type: 'reference', _ref: id },
  partnerGroup,
})

const renderBall = (
  overrides: Record<string, unknown>,
  ...partners: ReturnType<typeof partner>[]
) =>
  renderPage(EventPage, {
    now: NOW,
    params: { slug: 'ball' },
    documents: [
      siteSettings(),
      event('ball', overrides),
      event('other'),
      ...partners.flatMap((p) => [p.partner, p.asset]),
    ],
  })

const sectionOf = (html: string) =>
  html.match(/<section[^>]*data-partners[\s\S]*?<\/section>/)?.[0] ?? ''
const itemsOf = (html: string) => sectionOf(html).match(/<li[\s\S]*?<\/li>/g) ?? []

describe('Partners on the Event page', () => {
  it('renders no Partners section for an Event without Partners', async () => {
    const html = await renderBall({})

    expect(html).not.toContain('data-partners')
  })

  it('renders Partners after the Event FAQ and before Related events, in the editor order', async () => {
    const html = await renderBall(
      {
        faq: [faqEntry('q1', 'Can I bring a friend?', 'Yes.')],
        relatedEvents: [{ _key: 'o', _type: 'reference', _ref: 'other', _weak: true }],
        partners: [credit('b'), credit('a')],
      },
      partner('a'),
      partner('b'),
    )

    expect(sectionOf(html)).toContain('Partners')
    expect(html.indexOf('Can I bring a friend?')).toBeLessThan(html.indexOf('data-partners'))
    expect(html.indexOf('data-partners')).toBeLessThan(html.indexOf('data-related-events'))
    expect(itemsOf(html).map((item) => item.match(/alt="([^"]*)"/)?.[1])).toEqual([
      'Partner b',
      'Partner a',
    ])
  })

  it('links a Partner with a website in a new tab as sponsored, and leaves one without plain', async () => {
    const html = await renderBall(
      { partners: [credit('a'), credit('b')] },
      partner('a', { website: 'https://a.example/' }),
      partner('b'),
    )
    const [withLink, without] = itemsOf(html)

    expect(withLink).toMatch(/<a[^>]*href="https:\/\/a\.example\/"/)
    expect(withLink).toMatch(/<a[^>]*target="_blank"/)
    expect(withLink).toMatch(/<a[^>]*rel="[^"]*\bsponsored\b/)
    expect(without).not.toContain('<a')
  })

  it('still shows the Partners of a Past event', async () => {
    const html = await renderBall({ ...ENDED, partners: [credit('a')] }, partner('a'))

    expect(itemsOf(html)).toHaveLength(1)
  })

  it('skips a credit whose Partner is missing or has no logo, and renders the rest', async () => {
    const html = await renderBall(
      { partners: [credit('gone'), credit('no-logo'), credit('fine')] },
      partner('no-logo', { logo: undefined }),
      partner('fine'),
    )

    expect(itemsOf(html).map((item) => item.match(/alt="([^"]*)"/)?.[1])).toEqual(['Partner fine'])
  })

  it('renders no section when every credit is broken', async () => {
    const html = await renderBall({ partners: [credit('gone')] })

    expect(html).not.toContain('data-partners')
  })

  describe('Partner groups', () => {
    const groupsOf = (html: string) =>
      [...sectionOf(html).matchAll(/data-partner-group="(\w+)"/g)].map((m) => m[1])
    const subHeadings = (html: string) =>
      [...sectionOf(html).matchAll(/<h3[^>]*>\s*([^<]*?)\s*<\/h3>/g)].map((m) => m[1])

    it('orders groups General partner, Partner, Media partner and keeps editor order within a group', async () => {
      const html = await renderBall(
        {
          partners: [
            credit('m1', 'media'),
            credit('p1', 'partner'),
            credit('g1', 'general'),
            credit('p2', 'partner'),
            credit('g2', 'general'),
          ],
        },
        ...['m1', 'p1', 'g1', 'p2', 'g2'].map((id) => partner(id)),
      )

      expect(groupsOf(html)).toEqual(['general', 'partner', 'media'])
      expect(itemsOf(html).map((item) => item.match(/alt="([^"]*)"/)?.[1])).toEqual([
        'Partner g1',
        'Partner g2',
        'Partner p1',
        'Partner p2',
        'Partner m1',
      ])
    })

    it('shows no group sub-heading when only one group has Partners', async () => {
      const html = await renderBall({ partners: [credit('a', 'media')] }, partner('a'))

      expect(subHeadings(html)).toEqual([])
    })

    it('shows a sub-heading for each used group only, when two or more are used', async () => {
      const html = await renderBall(
        { partners: [credit('m', 'media'), credit('g', 'general')] },
        partner('m'),
        partner('g'),
      )

      expect(subHeadings(html)).toEqual(['General partner', 'Media partner'])
    })

    it('marks General partner logos as the larger size', async () => {
      const html = await renderBall(
        { partners: [credit('g', 'general'), credit('p')] },
        partner('g'),
        partner('p'),
      )

      expect(html).toMatch(/data-partner-group="general"[^>]*data-size="large"/)
      expect(html).toMatch(/data-partner-group="partner"[^>]*data-size="regular"/)
    })
  })
})

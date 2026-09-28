import { describe, expect, it } from 'vitest'
import LinksPage from '../src/pages/links.astro'
import { renderPage } from './seam'
import { linkItem, linksPage, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const renderLinks = (links: ReturnType<typeof linkItem>[]) =>
  renderPage(LinksPage, { now: NOW, documents: [siteSettings(), linksPage({ links })] })

const highlightedOf = (html: string) =>
  html.match(/<a[^>]*data-link="highlight"[\s\S]*?<\/a>/g) ?? []
const plainOf = (html: string) => html.match(/<a[^>]*data-link="plain"[\s\S]*?<\/a>/g) ?? []

describe('Links page', () => {
  it('shows the intro in the header band', async () => {
    const html = await renderLinks([])

    expect(html).toContain('ESN Prague United')
    expect(html).toContain('Events, trips and your buddy, all in one place.')
  })

  it('names the site once in the tab title when the page title is the site name', async () => {
    const html = await renderLinks([])

    expect(html).toContain('<title>ESN Prague United</title>')
  })

  it('shows highlighted links as big buttons above the plain rows, each in editor order', async () => {
    const html = await renderLinks([
      linkItem('insta', 'Instagram'),
      linkItem('ball', 'Czech Ball tickets', { highlight: true }),
      linkItem('card', 'Get an ESN card'),
      linkItem('buddy', 'Buddy sign-up', { highlight: true }),
    ])
    const highlighted = highlightedOf(html)
    const plain = plainOf(html)

    expect(highlighted).toHaveLength(2)
    expect(highlighted[0]).toContain('Czech Ball tickets')
    expect(highlighted[0]).toContain('href="https://example.com/ball"')
    expect(highlighted[1]).toContain('Buddy sign-up')
    expect(plain).toHaveLength(2)
    expect(plain[0]).toContain('Instagram')
    expect(plain[1]).toContain('Get an ESN card')
    expect(html.lastIndexOf('data-link="highlight"')).toBeLessThan(
      html.indexOf('data-link="plain"'),
    )
  })

  it('leaves out a link past its Hide after date', async () => {
    const html = await renderLinks([
      linkItem('old', 'Welcome week sign-up', { visibleUntil: '2026-09-30T23:59:00Z' }),
      linkItem('oldHighlight', 'Summer trip', {
        highlight: true,
        visibleUntil: '2026-10-01T09:59:00Z',
      }),
    ])

    expect(html).not.toContain('Welcome week sign-up')
    expect(html).not.toContain('Summer trip')
  })

  it('shows a link before its Hide after date', async () => {
    const html = await renderLinks([
      linkItem('ball', 'Czech Ball tickets', {
        highlight: true,
        visibleUntil: '2026-10-01T10:01:00Z',
      }),
      linkItem('card', 'Get an ESN card', { visibleUntil: '2026-12-31T00:00:00Z' }),
    ])

    expect(highlightedOf(html)[0]).toContain('Czech Ball tickets')
    expect(plainOf(html)[0]).toContain('Get an ESN card')
  })

  it('renders without the site header, menu or footer, with a small link back to the site', async () => {
    const html = await renderLinks([linkItem('card', 'Get an ESN card')])

    expect(html).not.toContain('<footer')
    expect(html).not.toContain('aria-label="Main"')
    // /events is in the siteSettings() fixture's header menu.
    expect(html).not.toContain('href="/events"')
    expect(html).toMatch(/<a[^>]*href="\/"/)
  })
})

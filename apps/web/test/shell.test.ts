import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import { homepage, localised, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const withBanner = (announcement: Record<string, unknown>) =>
  renderPage(Home, {
    now: NOW,
    documents: [
      homepage(),
      siteSettings({
        announcement: {
          enabled: true,
          text: localised('Czech Ball tickets are on sale'),
          url: 'https://tickets.example/ball',
          ...announcement,
        },
      }),
    ],
  })

describe('site shell', () => {
  it('renders the header menu from Site settings without a language switch', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })

    expect(html).toContain('href="/events"')
    expect(html).toContain('>Sections<')
    expect(html).not.toMatch(/\bCZ\b/)
  })

  it('names the organisation ESN Prague United in the title and footer', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })

    expect(html).toMatch(/<title>[^<]*ESN Prague United<\/title>/)
    expect(html).toContain('<footer')
    expect(html).not.toMatch(/ESN Prague(?! United)/)
  })

  it('renders the footer when Site settings has no social links', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [homepage(), siteSettings({ socials: undefined })],
    })

    expect(html).toContain('<footer')
    expect(html).not.toContain('aria-label="Instagram"')
  })
})

describe('top banner', () => {
  it('shows while enabled and before its Hide after date', async () => {
    const html = await withBanner({ visibleUntil: '2026-10-02T00:00:00Z' })

    expect(html).toContain('Czech Ball tickets are on sale')
    expect(html).toContain('href="https://tickets.example/ball"')
  })

  it('shows while enabled with no Hide after date', async () => {
    expect(await withBanner({})).toContain('Czech Ball tickets are on sale')
  })

  it('hides after its Hide after date', async () => {
    const html = await withBanner({ visibleUntil: '2026-09-30T23:59:00Z' })

    expect(html).not.toContain('Czech Ball tickets are on sale')
  })

  it('hides when disabled', async () => {
    const html = await withBanner({ enabled: false })

    expect(html).not.toContain('Czech Ball tickets are on sale')
  })
})

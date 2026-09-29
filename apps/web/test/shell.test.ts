import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import { homepage, localised, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const footerOf = (html: string) => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? ''

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

  it('shows no social links in the footer, even when Site settings still holds some', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [
        homepage(),
        siteSettings({
          socials: { instagram: 'https://instagram.com/esnprague', facebook: 'https://fb.example' },
        }),
      ],
    })
    const footer = footerOf(html)

    expect(footer).not.toBe('')
    expect(footer).not.toContain('instagram.com')
    expect(footer).not.toContain('fb.example')
  })

  it('links to the Privacy policy page from the footer', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })
    const footer = footerOf(html)

    expect(footer).toMatch(/<a[^>]*href="\/privacy-policy"[^>]*>\s*Privacy policy\s*<\/a>/)
  })

  it('has a Cookie settings button in the footer', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })
    const footer = footerOf(html)

    expect(footer).toMatch(/<button[^>]*data-consent-settings[^>]*>\s*Cookie settings\s*<\/button>/)
  })

  it('hides the Privacy policy and Cookie settings links while the Updates block is hidden', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [homepage({ showUpdates: false }), siteSettings()],
    })
    const footer = footerOf(html)

    expect(footer).not.toBe('')
    expect(footer).not.toContain('href="/privacy-policy"')
    expect(footer).not.toContain('data-consent-settings')
  })
})

describe('consent banner markup', () => {
  const consentBannerOf = (html: string) =>
    html.match(/<(\w+)[^>]*data-consent-banner[\s\S]*?<\/\1>/)?.[0] ?? ''

  it('starts hidden, asks about Instagram and links to the Privacy policy', async () => {
    const html = await renderPage(Home, { now: NOW, documents: [homepage(), siteSettings()] })
    const banner = consentBannerOf(html)

    expect(banner).toMatch(/data-consent-banner[^>]*\bhidden\b|\bhidden\b[^>]*data-consent-banner/)
    expect(banner).toContain('Instagram')
    expect(banner).toMatch(/<a[^>]*href="\/privacy-policy"/)
    expect(banner).toMatch(/<button[^>]*data-consent-accept[^>]*>\s*Accept\s*<\/button>/)
    expect(banner).toMatch(/<button[^>]*data-consent-reject[^>]*>\s*Reject\s*<\/button>/)
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

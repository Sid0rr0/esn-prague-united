import { describe, expect, it } from 'vitest'
import PrivacyPolicyPage from '../src/pages/privacy-policy.astro'
import { renderPage } from './seam'
import { privacyPolicy, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const renderPrivacyPolicy = (documents = [siteSettings(), privacyPolicy()]) =>
  renderPage(PrivacyPolicyPage, { now: NOW, documents })

describe('Privacy policy page', () => {
  it('renders its heading and rich text', async () => {
    const html = await renderPrivacyPolicy()

    expect(html).toMatch(/<h1[^>]*>Privacy policy<\/h1>/)
    expect(html).toMatch(/<title>Privacy policy · ESN Prague United<\/title>/)
    expect(html).toContain('<p>We only store your Instagram content choice in your browser.</p>')
    expect(html).toContain('<p>Write to us to ask what we know about you.</p>')
  })

  it('falls back to the default heading before an editor writes the policy', async () => {
    const html = await renderPrivacyPolicy([siteSettings()])

    expect(html).toMatch(/<h1[^>]*>Privacy policy<\/h1>/)
  })
})

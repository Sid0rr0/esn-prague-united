import { describe, expect, it } from 'vitest'
import ContactsPage from '../src/pages/contacts.astro'
import FaqPage from '../src/pages/faq.astro'
import LinksPage from '../src/pages/links.astro'
import PrivacyPolicyPage from '../src/pages/privacy-policy.astro'
import { renderPage } from './seam'

const NOW = '2026-10-01T10:00:00Z'

const footerOf = (html: string) => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? ''

// Before an editor creates any Singleton, not even Site settings.
const renderWithoutContent = (page: Parameters<typeof renderPage>[0]) =>
  renderPage(page, { now: NOW, documents: [] })

describe('Singleton pages before their Singleton exists', () => {
  it('renders the shell with its footer links', async () => {
    const html = await renderWithoutContent(PrivacyPolicyPage)

    expect(footerOf(html)).toContain('href="/privacy-policy"')
  })

  it('renders the FAQ with its default heading and no topics', async () => {
    const html = await renderWithoutContent(FaqPage)

    expect(html).toMatch(/<h1[^>]*>Frequently asked questions<\/h1>/)
    expect(html).not.toContain('aria-label="Topics"')
    expect(html).toMatch(/href="\/contacts"[^>]*>\s*Contact us/)
  })

  it('renders Contacts with its default heading and no Section contacts', async () => {
    const html = await renderWithoutContent(ContactsPage)

    expect(html).toMatch(/<h1[^>]*>Contact us<\/h1>/)
    expect(html).not.toContain('data-section-contact')
  })

  it('renders the Links page under the site name with no links', async () => {
    const html = await renderWithoutContent(LinksPage)

    expect(html).toContain('<title>ESN Prague United</title>')
    expect(html).not.toContain('data-link=')
  })

  it('renders the Privacy policy with its default heading', async () => {
    const html = await renderWithoutContent(PrivacyPolicyPage)

    expect(html).toMatch(/<h1[^>]*>Privacy policy<\/h1>/)
  })
})

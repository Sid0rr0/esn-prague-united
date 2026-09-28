import { describe, expect, it } from 'vitest'
import ContactsPage from '../src/pages/contacts.astro'
import { renderPage } from './seam'
import { allSections, contactsPage, section, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

/** Each Section's brand colour, fixed in code (see CONTEXT.md). */
const COLOURS = {
  cu: 'var(--color-esn-magenta)',
  ctu: 'var(--color-esn-blue)',
  vse: 'var(--color-esn-orange)',
  czu: 'var(--color-esn-green)',
  uct: 'var(--color-esn-cyan)',
}

/** The five Sections in website order, each with its own contact email. */
const sectionsWithEmails = () =>
  allSections().map((doc) => {
    const slug = (doc.slug as { current: string }).current
    return { ...doc, email: `${slug}@esnprague.cz` }
  })

type Doc = ReturnType<typeof section>

const renderContacts = (page = contactsPage(), sections: Doc[] = sectionsWithEmails()) =>
  renderPage(ContactsPage, {
    now: NOW,
    // Reversed, so only the page's own ordering can put them in website order.
    documents: [siteSettings(), page, ...[...sections].reverse()],
  })

const generalContactOf = (html: string) =>
  html.match(/<section[^>]*aria-labelledby="general-contact"[\s\S]*?<\/section>/)?.[0] ?? ''
const sectionContactsOf = (html: string) =>
  html.match(/<li[^>]*data-section-contact[\s\S]*?<\/li>/g) ?? []
const followUsOf = (html: string) =>
  html.match(/<section[^>]*aria-labelledby="follow-us"[\s\S]*?<\/section>/)?.[0] ?? ''

describe('Contacts page', () => {
  it('shows the title, intro, and the general email as a mail link plus the address', async () => {
    const html = await renderContacts()

    const general = generalContactOf(html)

    expect(html).toContain('Get in touch')
    expect(html).toContain('Write to ESN Prague United or to your Section.')
    expect(general).toMatch(/href="mailto:hello@esnprague\.cz"[^>]*>\s*hello@esnprague\.cz/)
    expect(general).toContain('Vodičkova 36\n110 00 Praha 1')
  })

  it('lists each Section’s name and email in website order and brand colour when the toggle is on', async () => {
    const html = await renderContacts()
    const contacts = sectionContactsOf(html)

    expect(contacts).toHaveLength(5)
    Object.entries(COLOURS).forEach(([slug, colour], i) => {
      expect(contacts[i]).toContain(`ESN ${slug.toUpperCase()} Prague`)
      expect(contacts[i]).toContain(colour)
      expect(contacts[i]).toMatch(
        new RegExp(`href="mailto:esn-${slug}@esnprague\\.cz"[^>]*>\\s*esn-${slug}@esnprague\\.cz`),
      )
    })
  })

  it('lists Section contacts when the toggle was never touched, as it starts on', async () => {
    const untouched = Object.fromEntries(
      Object.entries(contactsPage()).filter(([key]) => key !== 'showSectionContacts'),
    ) as Doc

    const html = await renderContacts(untouched)

    expect(sectionContactsOf(html)).toHaveLength(5)
  })

  it('leaves Section contacts out when the toggle is off', async () => {
    const html = await renderContacts(contactsPage({ showSectionContacts: false }))

    expect(sectionContactsOf(html)).toHaveLength(0)
    expect(html).not.toContain('ESN CU Prague')
    expect(html).not.toContain('esn-cu@esnprague.cz')
  })

  it('shows a Section without an email by name only', async () => {
    const html = await renderContacts(contactsPage(), [section('cu', 1)])
    const [contact] = sectionContactsOf(html)

    expect(contact).toContain('ESN CU Prague')
    expect(contact).not.toContain('mailto:')
  })

  it('shows Follow us links only for the networks that have a URL', async () => {
    const html = await renderContacts(
      contactsPage({
        socials: {
          instagram: 'https://instagram.com/esnprague',
          facebook: '',
          linkedin: 'https://linkedin.com/company/esnprague',
        },
      }),
    )
    const followUs = followUsOf(html)

    expect(followUs).toContain('Follow us')
    expect(followUs).toContain('href="https://instagram.com/esnprague"')
    expect(followUs).toContain('href="https://linkedin.com/company/esnprague"')
    expect(followUs).not.toContain('Facebook')
    expect(followUs).not.toContain('TikTok')
  })

  it('hides Follow us when no network has a URL', async () => {
    const html = await renderContacts(contactsPage({ socials: null }))

    expect(followUsOf(html)).toBe('')
    expect(html).not.toContain('Follow us')
  })

  it('renders no contact people, even if an old document still lists them', async () => {
    const html = await renderContacts(
      contactsPage({
        people: [{ _key: 'p1', _type: 'contactPerson', name: 'Jana Nováková', role: 'President' }],
      }),
    )

    expect(html).not.toContain('Jana Nováková')
    expect(html).not.toContain('President')
  })
})

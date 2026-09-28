import { describe, expect, it } from 'vitest'
import FaqPage from '../src/pages/faq.astro'
import { renderPage } from './seam'
import { faqPage, localised, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

const renderFaq = (page = faqPage()) =>
  renderPage(FaqPage, { now: NOW, documents: [siteSettings(), page] })

const topicsOf = (html: string) =>
  html.match(/<section[^>]*data-faq-topic[\s\S]*?<\/section>/g) ?? []
const chipsOf = (html: string) => html.match(/<a[^>]*data-topic-chip[^>]*>[\s\S]*?<\/a>/g) ?? []
const idOf = (tag: string) => tag.match(/id="([^"]+)"/)?.[1]

describe('FAQ page', () => {
  it('shows the title and intro', async () => {
    const html = await renderFaq()

    expect(html).toContain('Frequently asked questions')
    expect(html).toContain('Everything about ESN Prague United in one place.')
  })

  it('renders every topic, in order, with its questions and answers', async () => {
    const html = await renderFaq()
    const topics = topicsOf(html)

    expect(topics).toHaveLength(3)
    expect(topics[0]).toContain('ESN card')
    expect(topics[0]).toContain('Where do I get an ESN card?')
    expect(topics[0]).toContain('<p>At any Section office.</p>')
    expect(topics[0]).toContain('How much is it?')
    expect(topics[0]!.indexOf('Where do I get')).toBeLessThan(topics[0]!.indexOf('How much'))
    expect(topics[1]).toContain('Buddy programme')
    expect(topics[1]).toContain('How do I get a buddy?')
    expect(topics[2]).toContain('Joining ESN')
    expect(topics[2]).toContain('Can I volunteer?')
  })

  it('has one chip per topic, in order, each linking to its topic', async () => {
    const html = await renderFaq()
    const chips = chipsOf(html)
    const topicIds = topicsOf(html).map(idOf)

    expect(chips).toHaveLength(3)
    expect(chips.map((chip) => chip.match(/>\s*([^<]*?)\s*<\/a>/)?.[1])).toEqual([
      'ESN card',
      'Buddy programme',
      'Joining ESN',
    ])
    chips.forEach((chip, i) => {
      expect(topicIds[i]).toBeTruthy()
      expect(chip).toContain(`href="#${topicIds[i]}"`)
    })
  })

  it('keeps the chip row in view while scrolling', async () => {
    const html = await renderFaq()

    expect(html).toMatch(/<nav[^>]*aria-label="Topics"[^>]*class="[^"]*\bsticky\b[^"]*\btop-0\b/)
  })

  it('puts each question in a native disclosure, so it opens by mouse and keyboard and announces its state', async () => {
    const html = await renderFaq()

    expect(html.match(/<details[\s>]/g)).toHaveLength(4)
    expect(html).toMatch(/<summary[^>]*>\s*Where do I get an ESN card\?/)
  })

  it('links "Contact us" to the Contacts page', async () => {
    const html = await renderFaq()

    expect(html).toContain('Still stuck?')
    expect(html).toMatch(/href="\/contacts"[^>]*>\s*Contact us/)
  })

  it('skips topics without questions and shows no chip row when there are no topics', async () => {
    const html = await renderFaq(
      faqPage({ groups: [{ _key: 'empty', _type: 'faqGroup', title: localised('Empty topic') }] }),
    )

    expect(topicsOf(html)).toHaveLength(0)
    expect(html).not.toContain('Empty topic')
    expect(html).not.toContain('aria-label="Topics"')
    expect(html).toMatch(/href="\/contacts"[^>]*>\s*Contact us/)
  })
})

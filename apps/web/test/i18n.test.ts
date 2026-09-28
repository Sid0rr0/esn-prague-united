import { describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { localise } from '../src/lib/i18n'
import { renderPage } from './seam'
import { homepage, localised, siteSettings } from './fixtures'

const NOW = '2026-10-01T10:00:00Z'

describe('field-level translation', () => {
  it('renders the English value of a translated field', async () => {
    const html = await renderPage(Home, {
      now: NOW,
      documents: [
        siteSettings(),
        homepage({
          hero: { heading: localised('Your exchange starts here', 'Tvůj Erasmus začíná tady') },
        }),
      ],
    })

    expect(html).toContain('Your exchange starts here')
    expect(html).not.toContain('Tvůj Erasmus začíná tady')
    expect(html).not.toContain('[object Object]')
  })

  it('resolves Czech when it is filled in', () => {
    const content = { title: localised('Czech Ball', 'Český ples') }

    expect(localise(content, 'cs')).toEqual({ title: 'Český ples' })
  })

  it('falls back to English per field when the Czech value is empty', () => {
    const content = {
      title: localised('Czech Ball', ''),
      summary: localised('A formal night'),
      faq: [
        {
          question: localised('Dress code?', 'Dress code?'),
          answer: localised([{ _type: 'block' }], []),
        },
      ],
    }

    expect(localise(content, 'cs')).toEqual({
      title: 'Czech Ball',
      summary: 'A formal night',
      faq: [{ question: 'Dress code?', answer: [{ _type: 'block' }] }],
    })
  })

  it('leaves untranslated values such as slugs, dates and numbers untouched', () => {
    const content = { slug: 'czech-ball', startsAt: '2026-11-26T17:00:00Z', order: 3 }

    expect(localise(content, 'cs')).toEqual(content)
  })

  it('treats an empty field with neither language as missing', () => {
    expect(localise({ title: localised('') }, 'cs')).toEqual({ title: undefined })
  })

  it('treats a field an editor cleared in both languages as missing', () => {
    expect(localise({ subheading: { _type: 'localeText' } })).toEqual({ subheading: undefined })
  })
})

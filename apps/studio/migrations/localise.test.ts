import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { localisedFields } from './localise.ts'

const block = (text: string) => ({
  _type: 'block',
  _key: 'b1',
  children: [{ _type: 'span', _key: 's1', text }],
})

const event = {
  _id: 'ev-ball',
  _type: 'event',
  title: 'Czech Ball',
  slug: { _type: 'slug', current: 'czech-ball' },
  startsAt: '2026-11-26T17:00:00Z',
  venue: { name: 'Žofín', transport: 'Tram 17 to Národní divadlo' },
  heroImage: { _type: 'imageWithAlt', asset: { _ref: 'image-1' }, alt: 'Dancers' },
  description: [block('A formal night'), { _type: 'imageWithAlt', _key: 'i1', alt: 'Hall' }],
  programme: [{ _key: 'p1', time: '19:00', title: 'Doors open' }],
  faq: [{ _key: 'f1', question: 'Dress code?', answer: [block('Black tie')] }],
}

describe('localisedFields', () => {
  it('moves text values into the English value and leaves the rest alone', () => {
    const set = localisedFields(event)

    assert.deepEqual(set.title, { _type: 'localeString', en: 'Czech Ball' })
    assert.deepEqual(set.venue, {
      name: 'Žofín',
      transport: { _type: 'localeText', en: 'Tram 17 to Národní divadlo' },
    })
    assert.deepEqual(set.heroImage, {
      _type: 'imageWithAlt',
      asset: { _ref: 'image-1' },
      alt: { _type: 'localeString', en: 'Dancers' },
    })
    assert.deepEqual(set.programme, [
      { _key: 'p1', time: '19:00', title: { _type: 'localeString', en: 'Doors open' } },
    ])
    assert.deepEqual(set.faq, [
      {
        _key: 'f1',
        question: { _type: 'localeString', en: 'Dress code?' },
        answer: { _type: 'localeRichText', en: [block('Black tie')] },
      },
    ])
    assert.equal('slug' in set, false)
    assert.equal('startsAt' in set, false)
  })

  it('localises the alt text of images inside rich text', () => {
    const { description } = localisedFields(event) as { description: { en: unknown[] } }

    assert.deepEqual(description.en[1], {
      _type: 'imageWithAlt',
      _key: 'i1',
      alt: { _type: 'localeString', en: 'Hall' },
    })
  })

  it('changes nothing when run a second time', () => {
    const migrated = { ...event, ...localisedFields(event) }

    assert.deepEqual(localisedFields(migrated), {})
  })

  it('keeps a Czech value an editor already added', () => {
    const doc = {
      _id: 'a1',
      _type: 'album',
      title: { _type: 'localeString', en: 'Ball', cs: 'Ples' },
    }

    assert.deepEqual(localisedFields(doc), {})
  })

  it('ignores document types without translated fields', () => {
    assert.deepEqual(localisedFields({ _id: 'x', _type: 'sanity.imageAsset', title: 'x' }), {})
  })
})

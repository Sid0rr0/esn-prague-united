import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { events, sections, singletons } from './content.ts'
import { localisedFields } from '../migrations/localise.ts'

const NOW = new Date('2026-10-01T10:00:00Z')
const all = () => [...singletons(), ...sections(), ...events(NOW)]

describe('seed content', () => {
  it('stores every translatable field in the translated shape', () => {
    for (const doc of all()) {
      assert.deepEqual(localisedFields({ _id: 'seed', ...doc }), {}, doc._type)
    }
  })

  it('has the five sections in website order', () => {
    assert.deepEqual(
      sections().map((section) => [section.slug.current, section.order]),
      [
        ['esn-cu', 1],
        ['esn-ctu', 2],
        ['esn-vse', 3],
        ['esn-czu', 4],
        ['esn-uct', 5],
      ],
    )
  })

  it('has one upcoming and one past event', () => {
    const startTimes = events(NOW).map((event) => new Date(event.startsAt as string))

    assert.deepEqual(
      startTimes.map((startsAt) => startsAt > NOW),
      [true, false],
    )
  })
})

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  COOLDOWN_MS,
  SITE_UPDATE_REQUEST_ID,
  buildSiteUpdateRequest,
  cooldownRemainingMs,
} from './siteUpdate.ts'

const NOW = new Date('2026-10-01T10:00:00Z')
const secondsAgo = (seconds: number) => new Date(NOW.getTime() - seconds * 1000).toISOString()

describe('buildSiteUpdateRequest', () => {
  it('stamps the press time and the user on the singleton', () => {
    const doc = buildSiteUpdateRequest({ id: 'u1', name: 'Eva' }, NOW)

    assert.deepEqual(doc, {
      _id: SITE_UPDATE_REQUEST_ID,
      _type: 'siteUpdateRequest',
      pressedAt: '2026-10-01T10:00:00.000Z',
      pressedBy: 'Eva',
    })
  })

  it('falls back to the user id when the user has no name', () => {
    assert.equal(buildSiteUpdateRequest({ id: 'u1' }, NOW).pressedBy, 'u1')
  })

  it('records an unknown user when there is none', () => {
    assert.equal(buildSiteUpdateRequest(null, NOW).pressedBy, 'unknown')
  })
})

describe('cooldownRemainingMs', () => {
  it('is zero when the button was never pressed', () => {
    assert.equal(cooldownRemainingMs(undefined, NOW), 0)
  })

  it('is still running just under 45 seconds after a press', () => {
    assert.equal(cooldownRemainingMs(secondsAgo(44.999), NOW), 1)
  })

  it('is over at exactly 45 seconds', () => {
    assert.equal(cooldownRemainingMs(secondsAgo(45), NOW), 0)
  })

  it('is over just past 45 seconds', () => {
    assert.equal(cooldownRemainingMs(secondsAgo(45.001), NOW), 0)
  })

  it('runs the full cooldown right after a press', () => {
    assert.equal(cooldownRemainingMs(secondsAgo(0), NOW), COOLDOWN_MS)
  })

  it('ignores a press time it cannot parse', () => {
    assert.equal(cooldownRemainingMs('not a date', NOW), 0)
  })

  it('caps a press time in the future at the full cooldown', () => {
    assert.equal(cooldownRemainingMs(secondsAgo(-600), NOW), COOLDOWN_MS)
  })
})

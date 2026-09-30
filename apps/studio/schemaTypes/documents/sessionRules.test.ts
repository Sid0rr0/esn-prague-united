import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  SESSIONS_MAX,
  checkSessionEnd,
  checkSessionSpan,
  checkSessionCount,
  checkTicketFieldIgnored,
} from './sessionRules.ts'

const event = { startsAt: '2026-10-01T17:00:00Z', endsAt: '2026-12-15T21:00:00Z' }

describe('checkSessionEnd', () => {
  it('passes when Ends is after Starts', () => {
    assert.equal(checkSessionEnd('2026-10-08T17:00:00Z', '2026-10-08T18:30:00Z'), true)
  })

  it('passes when there is no Ends or no Starts yet', () => {
    assert.equal(checkSessionEnd('2026-10-08T17:00:00Z', undefined), true)
    assert.equal(checkSessionEnd(undefined, '2026-10-08T18:30:00Z'), true)
  })

  it('returns a message when Ends is before Starts', () => {
    assert.equal(typeof checkSessionEnd('2026-10-08T18:30:00Z', '2026-10-08T17:00:00Z'), 'string')
  })
})

describe('checkSessionSpan', () => {
  it('passes for a Session inside the Event span', () => {
    const session = { startsAt: '2026-10-08T17:00:00Z', endsAt: '2026-10-08T18:30:00Z' }
    assert.equal(checkSessionSpan(session, event), true)
  })

  it('warns for a Session before the Event starts', () => {
    const session = { startsAt: '2026-09-24T17:00:00Z' }
    assert.equal(typeof checkSessionSpan(session, event), 'string')
  })

  it('warns for a Session after the Event ends', () => {
    const session = { startsAt: '2026-12-22T17:00:00Z' }
    assert.equal(typeof checkSessionSpan(session, event), 'string')
  })

  it('warns for a Session that ends after the Event ends', () => {
    const session = { startsAt: '2026-12-15T20:00:00Z', endsAt: '2026-12-15T22:00:00Z' }
    assert.equal(typeof checkSessionSpan(session, event), 'string')
  })

  it('only checks the start against the Event Starts when the Event has no Ends', () => {
    const open = { startsAt: '2026-10-01T17:00:00Z' }
    assert.equal(checkSessionSpan({ startsAt: '2027-03-01T17:00:00Z' }, open), true)
    assert.equal(typeof checkSessionSpan({ startsAt: '2026-09-01T17:00:00Z' }, open), 'string')
  })

  it('passes while the dates are not filled in yet', () => {
    assert.equal(checkSessionSpan({}, event), true)
    assert.equal(checkSessionSpan({ startsAt: '2026-10-08T17:00:00Z' }, {}), true)
  })
})

describe('checkSessionCount', () => {
  it('passes at the limit', () => {
    assert.equal(checkSessionCount(SESSIONS_MAX), true)
  })

  it('returns a message above the limit', () => {
    assert.equal(typeof checkSessionCount(SESSIONS_MAX + 1), 'string')
  })

  it('passes when there are no Sessions', () => {
    assert.equal(checkSessionCount(undefined), true)
  })
})

describe('checkTicketFieldIgnored', () => {
  it('passes when the field is empty', () => {
    assert.equal(checkTicketFieldIgnored(undefined, [{}]), true)
  })

  it('passes when the Event has no Sessions', () => {
    assert.equal(checkTicketFieldIgnored('https://tickets.example', undefined), true)
    assert.equal(checkTicketFieldIgnored('https://tickets.example', []), true)
  })

  it('warns when the field is filled and the Event has Sessions', () => {
    const message = checkTicketFieldIgnored('https://tickets.example', [{}])
    assert.match(String(message), /ignored/i)
  })

  it('treats a note with only blank locales as empty', () => {
    assert.equal(checkTicketFieldIgnored({ en: '', cs: ' ' }, [{}]), true)
  })

  it('warns for a note with any locale filled', () => {
    assert.equal(typeof checkTicketFieldIgnored({ en: 'Sold out' }, [{}]), 'string')
  })
})

import { describe, expect, it } from 'vitest'
import { externalLinkProps } from '../src/lib/external-link'

const OPENS_IN_NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' }

describe('externalLinkProps', () => {
  it('opens http and https urls in a new tab without leaking the opener', () => {
    expect(externalLinkProps('https://example.com/ball')).toEqual(OPENS_IN_NEW_TAB)
    expect(externalLinkProps('http://example.com')).toEqual(OPENS_IN_NEW_TAB)
  })

  it('leaves site paths, anchors and mailto links alone', () => {
    expect(externalLinkProps('/events/ball')).toEqual({})
    expect(externalLinkProps('#faq')).toEqual({})
    expect(externalLinkProps('mailto:hi@example.com')).toEqual({})
  })

  it('leaves missing urls alone', () => {
    expect(externalLinkProps(undefined)).toEqual({})
  })
})

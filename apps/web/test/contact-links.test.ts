import { describe, expect, it } from 'vitest'
import { instagramHandle, websiteDomain } from '../src/lib/contact-links'

describe('instagramHandle', () => {
  it.each([
    ['https://instagram.com/esncuprague', '@esncuprague'],
    ['https://www.instagram.com/esncuprague/?hl=en', '@esncuprague'],
    ['http://instagram.com/esn.ctu/', '@esn.ctu'],
  ])('shows %s as %s', (url, handle) => {
    expect(instagramHandle(url)).toBe(handle)
  })

  it('shows the raw URL when there is no handle to take from it', () => {
    expect(instagramHandle('https://instagram.com/')).toBe('https://instagram.com/')
    expect(instagramHandle('not a url')).toBe('not a url')
  })
})

describe('websiteDomain', () => {
  it.each([
    ['https://esncuprague.cz', 'esncuprague.cz'],
    ['https://www.esncuprague.cz/about/?x=1', 'esncuprague.cz'],
    ['http://sub.example.org/', 'sub.example.org'],
  ])('shows %s as %s', (url, domain) => {
    expect(websiteDomain(url)).toBe(domain)
  })

  it('shows the raw URL when it cannot be parsed', () => {
    expect(websiteDomain('not a url')).toBe('not a url')
  })
})

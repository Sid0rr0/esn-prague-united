import { beforeAll, describe, expect, it } from 'vitest'
import Home from '../src/pages/index.astro'
import { renderPage } from './seam'
import { homepage, instagramPost, instagramPostRef, siteSettings } from './fixtures'
import { blockedStorage, deviceStorage, failingStorage, visit } from './consent-seam'

const NOW = '2026-10-01T10:00:00Z'
const POST_A = 'https://www.instagram.com/p/AAA111/'
const POST_B = 'https://www.instagram.com/reel/BBB222/'

let html: string

beforeAll(async () => {
  html = await renderPage(Home, {
    now: NOW,
    documents: [
      siteSettings(),
      homepage({ updates: { posts: [instagramPostRef('a'), instagramPostRef('b')] } }),
      instagramPost('a', POST_A),
      instagramPost('b', POST_B),
    ],
  })
})

describe('consent banner', () => {
  it('is shown to an undecided visitor, over placeholders', () => {
    const page = visit(html, deviceStorage)

    expect(page.isBannerShown()).toBe(true)
    expect(page.placeholders()).toBe(2)
    expect(page.embeds()).toEqual([])
    expect(page.instagramScripts()).toBe(0)
  })

  it('on Accept hides, turns every placeholder into an embed and loads Instagram once', () => {
    const page = visit(html, deviceStorage)

    page.accept()

    expect(page.isBannerShown()).toBe(false)
    expect(page.placeholders()).toBe(0)
    expect(page.embeds()).toEqual([POST_A, POST_B])
    expect(page.instagramScripts()).toBe(1)
  })

  it('on Reject hides and keeps the placeholders', () => {
    const page = visit(html, deviceStorage)

    page.reject()

    expect(page.isBannerShown()).toBe(false)
    expect(page.placeholders()).toBe(2)
    expect(page.embeds()).toEqual([])
    expect(page.instagramScripts()).toBe(0)
  })
})

describe('stored consent choice', () => {
  it('loads embeds without a banner on the next visit after Accept', () => {
    const storage = deviceStorage()
    visit(html, () => storage).accept()

    const reloaded = visit(html, () => storage)

    expect(reloaded.isBannerShown()).toBe(false)
    expect(reloaded.embeds()).toEqual([POST_A, POST_B])
    expect(reloaded.instagramScripts()).toBe(1)
  })

  it('shows placeholders without a banner on the next visit after Reject', () => {
    const storage = deviceStorage()
    visit(html, () => storage).reject()

    const reloaded = visit(html, () => storage)

    expect(reloaded.isBannerShown()).toBe(false)
    expect(reloaded.placeholders()).toBe(2)
    expect(reloaded.instagramScripts()).toBe(0)
  })

  it.each([
    ['cannot be opened', blockedStorage],
    ['throws on read and write', () => failingStorage],
  ])('treats storage that %s as undecided, without errors', (_, storage) => {
    const page = visit(html, storage)

    expect(page.isBannerShown()).toBe(true)
    expect(() => page.accept()).not.toThrow()
    expect(page.embeds()).toEqual([POST_A, POST_B])
  })
})

describe('Allow Instagram content', () => {
  it('on a placeholder acts as Accept for the whole page', () => {
    const storage = deviceStorage()
    const page = visit(html, () => storage)

    page.allowOnFirstPlaceholder()

    expect(page.isBannerShown()).toBe(false)
    expect(page.embeds()).toEqual([POST_A, POST_B])
    expect(page.instagramScripts()).toBe(1)
    expect(visit(html, () => storage).isBannerShown()).toBe(false)
  })

  it('still works after the visitor rejected', () => {
    const page = visit(html, deviceStorage)
    page.reject()

    page.allowOnFirstPlaceholder()

    expect(page.embeds()).toEqual([POST_A, POST_B])
  })
})

describe('Cookie settings', () => {
  it('reopens the banner after a choice', () => {
    const storage = deviceStorage()
    visit(html, () => storage).reject()
    const page = visit(html, () => storage)

    page.openCookieSettings()

    expect(page.isBannerShown()).toBe(true)
  })

  it('withdraws consent on Reject, turning embeds back into placeholders', () => {
    const page = visit(html, deviceStorage)
    page.accept()

    page.openCookieSettings()
    page.reject()

    expect(page.embeds()).toEqual([])
    expect(page.placeholders()).toBe(2)
  })

  it('does not load Instagram twice when accepting again', () => {
    const page = visit(html, deviceStorage)
    page.accept()

    page.openCookieSettings()
    page.accept()

    expect(page.instagramScripts()).toBe(1)
  })
})

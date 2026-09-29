import { describe, expect, it } from 'vitest'
import { checkInstagramLink } from '../src/lib/instagram-link'

describe('Instagram post link rules', () => {
  it.each([
    'https://www.instagram.com/p/DAbc123_-x/',
    'https://instagram.com/p/DAbc123_-x/',
    'https://www.instagram.com/p/DAbc123_-x',
    'https://www.instagram.com/p/DAbc123_-x/?igsh=MTc4MmM1YmI2Ng==',
    'http://instagram.com/p/DAbc123_-x?igsh=abc#comments',
  ])('accepts the post link %s and normalises it', (link) => {
    expect(checkInstagramLink(link)).toEqual({
      ok: true,
      url: 'https://www.instagram.com/p/DAbc123_-x/',
    })
  })

  it.each([
    'https://www.instagram.com/reel/C9xYz/',
    'https://instagram.com/reel/C9xYz',
    'https://www.instagram.com/reel/C9xYz/?igsh=abc',
  ])('accepts the reel link %s and normalises it', (link) => {
    expect(checkInstagramLink(link)).toEqual({
      ok: true,
      url: 'https://www.instagram.com/reel/C9xYz/',
    })
  })

  it.each([
    'https://www.instagram.com/esnprague/',
    'https://www.instagram.com/stories/esnprague/3456789/',
    'https://www.instagram.com/stories/highlights/1789/',
    'https://www.facebook.com/p/DAbc123/',
    'https://notinstagram.com/p/DAbc123/',
    'https://www.instagram.com/p/',
    'https://www.instagram.com/p/DAbc123/extra/',
    'not a link',
    '',
  ])('rejects %s with the documented message', (link) => {
    expect(checkInstagramLink(link)).toEqual({
      ok: false,
      message: 'Paste a post or reel link, not a profile or story',
    })
  })
})

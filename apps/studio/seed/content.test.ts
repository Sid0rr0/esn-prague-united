import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { events, instagramPosts, sections, singletons } from './content.ts'
import { checkInstagramLink } from '../../web/src/lib/instagram-link.ts'
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

  it('gives every section an email, a website and an Instagram link', () => {
    for (const section of sections()) {
      const socials = section.socials as { website?: string; instagram?: string } | undefined
      assert.match(String(section.email), /^\S+@\S+\.\S+$/, section.slug.current)
      assert.match(String(socials?.website), /^https:\/\//, section.slug.current)
      assert.match(
        String(socials?.instagram),
        /^https:\/\/www\.instagram\.com\//,
        section.slug.current,
      )
    }
  })

  it('has one upcoming and one past event', () => {
    const startTimes = events(NOW).map((event) => new Date(event.startsAt as string))

    assert.deepEqual(
      startTimes.map((startsAt) => startsAt > NOW),
      [true, false],
    )
  })

  it('gives the Welcome Party a Related event that exists', () => {
    const [welcome] = events(NOW)
    const related = welcome.relatedEvents as { _ref: string }[]

    assert.ok(related.length > 0)
    for (const { _ref } of related) {
      assert.ok(
        events(NOW).some((event) => event._id === _ref && event !== welcome),
        _ref,
      )
    }
  })

  it('has a placeholder Privacy policy with a heading and text', () => {
    const policy = singletons().find((doc) => doc._id === 'privacyPolicy')
    const body = policy?.body as { en?: unknown[] } | undefined

    assert.equal(policy?._type, 'privacyPolicy')
    assert.equal((policy?.title as { en?: string } | undefined)?.en, 'Privacy policy')
    assert.ok((body?.en?.length ?? 0) > 0)
  })

  it('picks every sample Instagram post for the homepage, each with a valid link', () => {
    const homepage = singletons().find((doc) => doc._id === 'homepage')
    const picked = (homepage?.updates as { posts: { _ref: string }[] }).posts

    assert.deepEqual(
      picked.map((ref) => ref._ref),
      instagramPosts().map((post) => post._id),
    )
    for (const post of instagramPosts()) {
      assert.equal(checkInstagramLink(String(post.link)).ok, true, String(post.link))
    }
  })
})

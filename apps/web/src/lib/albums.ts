/** The Gallery, each Album page and their static paths, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { ALBUM_CARD, IMAGE, PHOTO_COUNT } from './query-pieces'
import { fetchRaw } from './sanity-client'
import type { AlbumSummary, SanityImage } from './shapes'

// Albums don't belong to Sections: neither query reads an old Album's sections field.
// The Homepage reads its Latest albums through homepage.ts.
const ALBUMS_QUERY = groq`*[_type == "album"] | order(date desc)${ALBUM_CARD}`

const ALBUM_QUERY = groq`*[_type == "album" && slug.current == $slug][0]{
  title, "slug": slug.current, date, photographer, fullAlbumUrl,
  photos[]${IMAGE}, ${PHOTO_COUNT},
  "event": *[_type == "event" && album._ref == ^._id && defined(slug.current)][0]{"slug": slug.current}
}`

const ALBUM_SLUGS_QUERY = groq`*[_type == "album" && defined(slug.current)].slug.current`

export interface AlbumDetail {
  title: string
  slug: string
  date: string
  photographer?: string
  fullAlbumUrl?: string
  photos?: (SanityImage & { _key: string })[] | null
  photoCount: number
  /** The Event that links to this Album, if any. */
  event?: { slug: string } | null
}

/** Every Album, newest first. */
export async function readAlbums(language: Language = DEFAULT_LANGUAGE): Promise<AlbumSummary[]> {
  return localise(await fetchRaw<AlbumSummary[]>(ALBUMS_QUERY), language)
}

/** The Album with this slug, or null when there is none. */
export async function readAlbum(
  slug: string,
  language: Language = DEFAULT_LANGUAGE,
): Promise<AlbumDetail | null> {
  return localise(await fetchRaw<AlbumDetail | null>(ALBUM_QUERY, { slug }), language)
}

export async function readAlbumSlugs(): Promise<string[]> {
  return fetchRaw<string[]>(ALBUM_SLUGS_QUERY)
}

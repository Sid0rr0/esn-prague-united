/** The Sections list, each Section page and their static paths, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { IMAGE, SECTIONS_IN_ORDER } from './query-pieces'
import { fetchRaw } from './sanity-client'
import type { RichText, SanityImage, SectionSummary, Socials } from './shapes'

// The Homepage reads the same list through homepage.ts.
const SECTIONS_QUERY = groq`${SECTIONS_IN_ORDER}`

// Exported only so the dropped-data test can check the Section's events and albums stay out;
// pages read through readSection.
export const SECTION_QUERY = groq`*[_type == "section" && slug.current == $slug][0]{
  name, shortName, "slug": slug.current, university, coverImage${IMAGE}, tagline, about,
  buddyProgramUrl, email, office, mapUrl, socials
}`

const SECTION_SLUGS_QUERY = groq`*[_type == "section" && defined(slug.current)].slug.current`

// Brand colours are not content: section-colours.ts keys them by slug (ADR 0001).
export interface SectionDetail {
  name: string
  slug: string
  university?: string
  coverImage?: SanityImage
  tagline?: string
  about?: RichText
  buddyProgramUrl?: string
  email?: string
  /** Office hours and place as the editor wrote them, shown as prose. */
  office?: string
  mapUrl?: string
  socials?: Socials | null
}

/** The 5 Sections in website order. */
export async function readSections(
  language: Language = DEFAULT_LANGUAGE,
): Promise<SectionSummary[]> {
  return localise(await fetchRaw<SectionSummary[]>(SECTIONS_QUERY), language)
}

/** The Section with this slug, or null when there is none. */
export async function readSection(
  slug: string,
  language: Language = DEFAULT_LANGUAGE,
): Promise<SectionDetail | null> {
  return localise(await fetchRaw<SectionDetail | null>(SECTION_QUERY, { slug }), language)
}

export async function readSectionSlugs(): Promise<string[]> {
  return fetchRaw<string[]>(SECTION_SLUGS_QUERY)
}

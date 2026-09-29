/** The Contacts page, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { fetchRaw } from './sanity-client'
import type { Seo, Socials } from './shapes'

// Exported only so the dropped-data test can check contact people stay out; pages read through
// readContacts. The Section contacts toggle starts on, so a document that never touched it lists
// them too.
export const CONTACTS_QUERY = groq`*[_id == "contactsPage"][0]{
  title, intro, generalEmail, address, socials, seo,
  "sections": select(
    showSectionContacts != false => *[_type == "section"] | order(order asc){name, "slug": slug.current, email}
  )
}`

/** A Section's name and email as the Contacts page lists them. */
export interface SectionContact {
  name: string
  slug: string
  email?: string
}

export interface Contacts {
  title?: string
  intro?: string
  generalEmail?: string
  address?: string
  socials?: Socials | null
  seo?: Seo
  /** The Sections in website order; null when "Also list the 5 sections' contacts" is off. */
  sections?: SectionContact[] | null
}

/** Contacts, or an empty shape before the Singleton exists. */
export async function readContacts(language: Language = DEFAULT_LANGUAGE): Promise<Contacts> {
  return localise(await fetchRaw<Contacts | null>(CONTACTS_QUERY), language) ?? {}
}

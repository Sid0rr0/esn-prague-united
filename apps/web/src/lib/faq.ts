/** The FAQ page, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { fetchRaw } from './sanity-client'
import type { FaqEntry, Seo } from './shapes'

// A topic without questions has nothing to open, so it gets no chip and no heading.
const FAQ_QUERY = groq`*[_id == "faqPage"][0]{
  title, intro, seo,
  "topics": groups[count(items) > 0]{_key, title, items[]{_key, question, answer}}
}`

export interface FaqTopic {
  _key: string
  title: string
  items: FaqEntry[]
}

export interface Faq {
  title?: string
  intro?: string
  seo?: Seo
  topics?: FaqTopic[] | null
}

/** The FAQ, or an empty shape before the Singleton exists. */
export async function readFaq(language: Language = DEFAULT_LANGUAGE): Promise<Faq> {
  return localise(await fetchRaw<Faq | null>(FAQ_QUERY), language) ?? {}
}

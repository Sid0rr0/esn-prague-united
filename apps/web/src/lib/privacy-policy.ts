/** The Privacy policy page, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { fetchRaw } from './sanity-client'
import type { RichText, Seo } from './shapes'

const PRIVACY_POLICY_QUERY = groq`*[_id == "privacyPolicy"][0]{title, body, seo}`

export interface PrivacyPolicy {
  title?: string
  body?: RichText
  seo?: Seo
}

/** The Privacy policy, or an empty shape before the Singleton exists. */
export async function readPrivacyPolicy(
  language: Language = DEFAULT_LANGUAGE,
): Promise<PrivacyPolicy> {
  return localise(await fetchRaw<PrivacyPolicy | null>(PRIVACY_POLICY_QUERY), language) ?? {}
}

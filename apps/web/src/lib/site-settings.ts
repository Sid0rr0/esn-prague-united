/** Site settings as the shared layout reads them, ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { visibleUntilFilter } from './query-pieces'
import { fetchRaw } from './sanity-client'
import type { SanityImage, Seo } from './shapes'

// The top banner shows only while it's enabled and before its "Hide after" date. The footer's
// Privacy policy and Cookie settings links follow the Homepage's "Show the Updates block".
const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo, navigation[]{_key, label, href}, footerText, seo,
  "showsInstagram": *[_id == "homepage"][0].showUpdates != false,
  "announcement": select(
    announcement.enabled == true && ${visibleUntilFilter('announcement.visibleUntil')} => announcement{text, url}
  )
}`

export interface SiteSettings {
  logo?: SanityImage
  navigation?: { _key: string; label: string; href: string }[]
  footerText?: string
  seo?: Seo
  /** Only set while the banner is enabled and before its "Hide after" date. */
  announcement?: { text?: string; url?: string } | null
  /** False while the Homepage hides its Updates block. */
  showsInstagram?: boolean
}

/** Site settings, or an empty shape before the Singleton exists. */
export async function readSiteSettings(
  language: Language = DEFAULT_LANGUAGE,
): Promise<SiteSettings> {
  return localise(await fetchRaw<SiteSettings | null>(SETTINGS_QUERY), language) ?? {}
}

import { DEFAULT_LANGUAGE, type Language } from './i18n'

/** Fixed site copy that editors don't write. Czech falls back to English per string. */
const EN = {
  updatesHeading: 'Updates',
  instagramPostLabel: 'Instagram post',
  instagramPlaceholderText: 'This post is shown on Instagram.',
  viewOnInstagram: 'View on Instagram',
  previousPost: 'Previous post',
  nextPost: 'Next post',
  privacyPolicy: 'Privacy policy',
  allowInstagram: 'Allow Instagram content',
  cookieSettings: 'Cookie settings',
  consentHeading: 'Instagram content',
  consentText:
    'Some pages show Instagram posts. Loading them lets Meta set cookies and see your visit. Do you want to see them?',
  consentAccept: 'Accept',
  consentReject: 'Reject',
} as const

export type UiString = keyof typeof EN

const CS: Partial<Record<UiString, string>> = {
  updatesHeading: 'Novinky',
  instagramPostLabel: 'Příspěvek na Instagramu',
  instagramPlaceholderText: 'Tento příspěvek najdete na Instagramu.',
  viewOnInstagram: 'Zobrazit na Instagramu',
  previousPost: 'Předchozí příspěvek',
  nextPost: 'Další příspěvek',
  privacyPolicy: 'Zásady ochrany osobních údajů',
  allowInstagram: 'Povolit obsah z Instagramu',
  cookieSettings: 'Nastavení cookies',
  consentHeading: 'Obsah z Instagramu',
  consentText:
    'Některé stránky zobrazují příspěvky z Instagramu. Jejich načtením umožníte společnosti Meta ukládat cookies a vidět vaši návštěvu. Chcete je zobrazit?',
  consentAccept: 'Přijmout',
  consentReject: 'Odmítnout',
}

const STRINGS: Record<Language, Partial<Record<UiString, string>>> = { en: EN, cs: CS }

/** The site copy for `key` in `language`, or in English when it has no translation. */
export const uiString = (key: UiString, language: Language = DEFAULT_LANGUAGE): string =>
  STRINGS[language][key] ?? EN[key]

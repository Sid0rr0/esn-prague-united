/**
 * Field-level translation (ADR 0002): every translatable field holds one value per
 * language, e.g. { _type: 'localeString', en: 'Czech Ball', cs: 'Český ples' }.
 */
export const LANGUAGES = ['en', 'cs'] as const
export type Language = (typeof LANGUAGES)[number]
export const DEFAULT_LANGUAGE: Language = 'en'

const LOCALE_KEYS = new Set<string>([...LANGUAGES, '_type', '_key'])
/** The Studio's translated field types (apps/studio/schemaTypes/objects/locale.ts). */
const LOCALE_TYPES = new Set<unknown>(['localeString', 'localeText', 'localeRichText'])

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// A field cleared in both languages is stored as just { _type: 'localeText' }.
const isLocalised = (value: Record<string, unknown>): boolean =>
  (LOCALE_TYPES.has(value._type) || LANGUAGES.some((language) => language in value)) &&
  Object.keys(value).every((key) => LOCALE_KEYS.has(key))

const isBlank = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

/**
 * Replaces every localised field in a query result with its value in `language`,
 * falling back to English per field when that language's value is empty.
 */
export function localise<T>(value: T, language: Language = DEFAULT_LANGUAGE): T {
  if (Array.isArray(value)) return value.map((item) => localise(item, language)) as T
  if (!isPlainObject(value)) return value
  if (isLocalised(value)) {
    const picked = isBlank(value[language]) ? value[DEFAULT_LANGUAGE] : value[language]
    return localise(isBlank(picked) ? undefined : picked, language) as T
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, field]) => [key, localise(field, language)]),
  ) as T
}

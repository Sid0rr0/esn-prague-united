import { fetchRaw } from './sanity-client'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'

/** Runs a GROQ query (see queries.ts) and resolves every translated field to one language. */
export async function fetchContent<T>(
  query: string,
  params: Record<string, unknown> = {},
  language: Language = DEFAULT_LANGUAGE,
): Promise<T> {
  return localise(await fetchRaw<T>(query, params), language)
}

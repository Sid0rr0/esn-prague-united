import { createClient, type SanityClient } from '@sanity/client'

const SANITY_API_VERSION = '2025-01-01'

let client: SanityClient | undefined

function getClient(): SanityClient {
  if (client) return client
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
  if (!projectId) {
    throw new Error(
      'PUBLIC_SANITY_PROJECT_ID is not set. Add it to apps/web/.env to build the site.',
    )
  }
  client = createClient({
    projectId,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: SANITY_API_VERSION,
    useCdn: false,
    perspective: 'published',
  })
  return client
}

/**
 * Runs a GROQ query against the Sanity dataset and returns the raw result, translated fields
 * still holding every language. Each content-read module resolves them with localise.
 */
export function fetchRaw<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return getClient().fetch<T>(query, params)
}

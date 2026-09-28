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

/** Runs a GROQ query (see queries.ts) against the Sanity dataset. */
export function fetchContent<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return getClient().fetch<T>(query, params)
}

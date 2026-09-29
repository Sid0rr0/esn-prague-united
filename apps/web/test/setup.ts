import { vi } from 'vitest'

// Every page reads Sanity through fetchRaw; tests answer it from the in-memory dataset, so
// translated fields still go through the real language resolution in each content-read module.
vi.mock('../src/lib/sanity-client', async () => {
  const { queryInMemory } = await import('./seam')
  return { fetchRaw: queryInMemory }
})

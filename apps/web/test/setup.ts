import { vi } from 'vitest'

// Every page reads Sanity through fetchContent; tests answer it from the in-memory dataset.
vi.mock('../src/lib/sanity', async () => {
  const { queryInMemory } = await import('./seam')
  return { fetchContent: queryInMemory }
})

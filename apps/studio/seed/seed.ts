/**
 * Fills a fresh dataset with sample content (see content.ts).
 *
 *   pnpm --filter esn-prague-studio seed
 *
 * Only creates what's missing: singletons by their fixed ID, Sections and Events by their
 * web address. Existing content, including anything an editor changed, is never overwritten.
 */
import { getCliClient } from 'sanity/cli'
import { events, sections, singletons, type SluggedDoc } from './content.ts'

const client = getCliClient({ apiVersion: '2025-01-01', perspective: 'raw' })

/** The documents whose web address isn't taken yet by a published or draft document. */
async function missingBySlug(docs: SluggedDoc[]): Promise<SluggedDoc[]> {
  const taken = await client.fetch<string[]>(
    `*[_type in $types && slug.current in $slugs].slug.current`,
    {
      types: [...new Set(docs.map((doc) => doc._type))],
      slugs: docs.map((doc) => doc.slug.current),
    },
  )
  return docs.filter((doc) => !taken.includes(doc.slug.current))
}

async function run() {
  const newDocs = await missingBySlug([...sections(), ...events(new Date())])
  const transaction = newDocs.reduce(
    (tx, doc) => tx.create(doc),
    singletons().reduce((tx, doc) => tx.createIfNotExists(doc), client.transaction()),
  )
  await transaction.commit()
  console.info(`Seeded ${newDocs.length} new Sections and Events; created missing singletons only.`)
}

run().catch((error: unknown) => {
  console.error('Seeding failed:', error)
  process.exitCode = 1
})

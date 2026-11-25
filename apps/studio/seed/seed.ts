/**
 * Fills a fresh dataset with sample content (see content.ts).
 *
 *   pnpm --filter esn-prague-studio seed
 *
 * Only creates what's missing: singletons and Instagram posts by their fixed ID, Sections
 * and Events by their web address. Existing content, including anything an editor changed, is never overwritten.
 */
import { getCliClient } from 'sanity/cli'
import {
  PARTNERS,
  events,
  instagramPosts,
  sections,
  singletons,
  type SluggedDoc,
} from './content.ts'

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

/** Creates the sample Partners, each with a placeholder SVG logo, unless they exist. */
async function seedPartners() {
  for (const { _id, name, ...rest } of PARTNERS) {
    if (await client.fetch('count(*[_id == $_id])', { _id })) continue
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="80"><text x="120" y="50" font-size="24" text-anchor="middle" fill="#333">${name}</text></svg>`
    const asset = await client.assets.upload('image', Buffer.from(svg), {
      filename: `${_id}.svg`,
      contentType: 'image/svg+xml',
    })
    await client.create({
      _id,
      _type: 'partner',
      name,
      ...rest,
      logo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    })
  }
}

async function run() {
  // Before the Events, which reference them.
  await seedPartners()
  const newDocs = await missingBySlug([...sections(), ...events(new Date())])
  const transaction = newDocs.reduce(
    (tx, doc) => tx.create(doc),
    // Instagram posts go first: the homepage references them.
    [...instagramPosts(), ...singletons()].reduce(
      (tx, doc) => tx.createIfNotExists(doc),
      client.transaction(),
    ),
  )
  await transaction.commit()
  console.info(
    `Seeded ${newDocs.length} new Sections and Events; created missing singletons and Instagram posts only.`,
  )
}

run().catch((error: unknown) => {
  console.error('Seeding failed:', error)
  process.exitCode = 1
})

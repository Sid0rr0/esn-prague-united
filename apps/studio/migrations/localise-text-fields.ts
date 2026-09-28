/**
 * One-off: move existing text values into the English value of each translated field.
 *
 *   pnpm --filter esn-prague-studio exec sanity exec migrations/localise-text-fields.ts --with-user-token
 *
 * Safe to run twice: already-localised values are skipped. Each patch only applies to the
 * revision it was computed from, so if an editor saves meanwhile the run fails; run it again.
 */
import { getCliClient } from 'sanity/cli'
import { localisedFields, TRANSLATABLE_FIELDS } from './localise.ts'

const client = getCliClient({ apiVersion: '2025-01-01', perspective: 'raw' })

async function run() {
  const docs = await client.fetch<{ _id: string; _type: string; _rev: string }[]>(
    `*[_type in $types]`,
    {
      types: Object.keys(TRANSLATABLE_FIELDS),
    },
  )
  const patches = docs
    .map((doc) => ({ id: doc._id, rev: doc._rev, set: localisedFields(doc) }))
    .filter(({ set }) => Object.keys(set).length > 0)

  if (patches.length > 0) {
    const transaction = patches.reduce(
      (tx, { id, rev, set }) => tx.patch(id, (patch) => patch.ifRevisionId(rev).set(set)),
      client.transaction(),
    )
    await transaction.commit()
  }
  console.info(`Localised text fields in ${patches.length} of ${docs.length} documents.`)
}

run().catch((error: unknown) => {
  console.error('Localising text fields failed:', error)
  process.exitCode = 1
})

/**
 * One-off: unset fields the design dropped (Event organisers, Album sections,
 * Contacts people), so no orphaned data stays behind.
 *
 *   pnpm --filter esn-prague-studio exec sanity exec migrations/remove-dropped-fields.ts --with-user-token
 *
 * Safe to run twice: only documents that still hold a dropped field are patched.
 */
import { getCliClient } from 'sanity/cli'

const DROPPED_FIELDS: Record<string, string[]> = {
  event: ['organisers'],
  album: ['sections'],
  contactsPage: ['people'],
}

const client = getCliClient({ apiVersion: '2025-01-01', perspective: 'raw' })

async function run() {
  const docs = await client.fetch<{ _id: string; _type: string }[]>(
    `*[
      (_type == "event" && defined(organisers)) ||
      (_type == "album" && defined(sections)) ||
      (_type == "contactsPage" && defined(people))
    ]{_id, _type}`,
  )

  if (docs.length > 0) {
    const transaction = docs.reduce(
      (tx, { _id, _type }) => tx.patch(_id, (patch) => patch.unset(DROPPED_FIELDS[_type])),
      client.transaction(),
    )
    await transaction.commit()
  }
  console.info(`Removed dropped fields from ${docs.length} documents.`)
}

run().catch((error: unknown) => {
  console.error('Removing dropped fields failed:', error)
  process.exitCode = 1
})

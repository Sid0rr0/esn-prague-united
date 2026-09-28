# 02: Remove data the design dropped

**What to build:** Editors stop seeing fields no page uses:

- **Event:** organisers ("Organised by").
- **Album:** Sections.
- **Contacts:** contact people, and the contact-person type with it.

The queries stop asking for them:

- The Event query drops organisers.
- The Section query drops the Section's events and albums.
- The Contacts query drops people.

Help text is corrected:

- The Featured event description no longer mentions a fallback card. It says that clearing the field returns the hero to ESN Prague United content.
- The FAQ topic examples become general topics (ESN card, Buddy programme, Joining ESN).

A one-off script unsets the removed fields in the existing dataset so no orphaned data stays behind.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] The Studio no longer shows organisers on Event, Sections on Album, or people on Contacts. The contact-person type no longer exists.
- [x] No query references organisers, Album sections, contact people, or a Section's events/albums.
- [x] The Featured event and FAQ topic help text match the glossary in CONTEXT.md.
- [x] A migration script unsets the removed fields. Running it twice is harmless, and it reports how many documents it changed.
- [x] The Studio and web app type-checks pass.

## Comments

- The Event, Section and Contacts queries now list their fields instead of spreading the document (`...`), so leftover organisers, people or Album sections can't reach a page even before the migration runs. `apps/web/test/dropped-data.test.ts` covers this through the seam.
- Migration: `pnpm --filter esn-prague-studio exec sanity exec migrations/remove-dropped-fields.ts --with-user-token`. It only patches documents that still hold a dropped field (drafts included, via the `raw` perspective) and prints how many it changed. Not run against the live dataset yet.

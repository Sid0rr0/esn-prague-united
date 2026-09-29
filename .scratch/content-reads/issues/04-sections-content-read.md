# 04: Sections content-read module

**What to build:** The Sections list, the Section page and its static paths read their content through the Sections module:

- `readSections()` returns the 5 Sections in website order.
- `readSection(slug)` returns the Section or `null` for an unknown slug.
- `readSectionSlugs()` returns every Section slug.

Section brand colours stay fixed in code, keyed by slug (ADR 0001). Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The Sections list and the Section page import no query, result shape or `fetchContent`.
- [x] An unknown slug still renders a 404 on the Section page.
- [x] Sections tests pass unchanged; type checking passes.

## Comments

Done. `readSections()`, `readSection(slug)` and `readSectionSlugs()` live in `apps/web/src/lib/sections.ts`, and the GROQ strings are unchanged. `SectionDetail` moved there too, and `SectionContactCard` now takes its field types from it. Brand colours stay in `section-colours.ts`, keyed by slug. There was no test for an unknown slug, so I added one to the Sections tests (it answers 404).

As with ticket 03, `SECTION_QUERY` is still exported and re-exported from `queries.ts`, only so `test/dropped-data.test.ts` passes unchanged. Ticket 07 has to handle that.

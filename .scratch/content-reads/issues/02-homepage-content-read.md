# 02: Homepage content-read module

**What to build:** The Homepage reads its content through one call, `readHomepage()`, and no longer names a query or a result shape. The Homepage module owns its projection, its shape, language resolution and the Upcoming list state. That state comes back as a tagged union:

- **list:** the Upcoming events other than the Featured event, soonest first, at most 4;
- **hidden:** a Featured event is set and nothing else is upcoming;
- **coming soon:** no Featured event and nothing upcoming.

The Homepage renders from the tag instead of computing the state. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The Homepage calls one read function and imports no query, result shape or `fetchContent`.
- [x] The Upcoming list state is decided in the Homepage module, not in the page.
- [x] The read function takes an optional language, defaulting to English.
- [x] Homepage tests pass unchanged; type checking passes.

## Comments

Done. `readHomepage()` in `apps/web/src/lib/homepage.ts` owns the projection, the shapes and the Upcoming list state (`list` / `hidden` / `coming-soon`). The Sections list expression moved to `SECTIONS_IN_ORDER` in `query-pieces.ts`, so the Homepage and the Sections page share it. `LinkItem` moved to `shapes.ts` because the Links page uses it too. The Homepage GROQ string is unchanged, and all 167 tests pass without edits.

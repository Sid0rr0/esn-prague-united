# 03: Events content-read module

**What to build:** The Events list page, the Event page and its static paths read their content through the Events module:

- `readEventsList()` returns Upcoming events soonest first and Past events newest first.
- `readEvent(slug)` returns the Event or `null` for an unknown slug.
- `readEventSlugs()` returns every Event slug.

The Featured event is listed like any other Event. Ticket fields and "has ended" come back raw; the ticket decision is out of scope. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The Events list page and the Event page import no query, result shape or `fetchContent`.
- [x] An unknown slug still renders a 404 on the Event page.
- [x] Data the design dropped (e.g. Event organisers) still never reaches the Event page.
- [x] Events list, Event page and dropped-data tests pass unchanged; type checking passes.

## Comments

Done. `readEventsList()`, `readEvent(slug)` and `readEventSlugs()` live in `apps/web/src/lib/events.ts`, and the GROQ strings are unchanged. There was no test for an unknown slug, so I added one to the Event page tests (it answers 404), with a `renderPageResponse` helper on the existing seam.

`EVENT_QUERY` is still exported and re-exported from `queries.ts`, only because `test/dropped-data.test.ts` imports it and has to pass unchanged. That clashes with ticket 07, which deletes `queries.ts` and also keeps "tests pass unchanged". The dropped-data test runs queries directly (Event, Section and Contacts), so 07 will have to rewrite it to go through the read functions or the rendered pages.

# 03: Events content-read module

**What to build:** The Events list page, the Event page and its static paths read their content through the Events module:

- `readEventsList()` returns Upcoming events soonest first and Past events newest first.
- `readEvent(slug)` returns the Event or `null` for an unknown slug.
- `readEventSlugs()` returns every Event slug.

The Featured event is listed like any other Event. Ticket fields and "has ended" come back raw; the ticket decision is out of scope. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The Events list page and the Event page import no query, result shape or `fetchContent`.
- [ ] An unknown slug still renders a 404 on the Event page.
- [ ] Data the design dropped (e.g. Event organisers) still never reaches the Event page.
- [ ] Events list, Event page and dropped-data tests pass unchanged; type checking passes.

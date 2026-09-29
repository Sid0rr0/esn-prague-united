# 01: Pin the Ticket area rules that have no page test yet

**What to build:** A safety net before the Ticket area refactor (see `../spec.md`). Check the Event page tests for the two rules below, and add a page test for any that isn't covered yet. The tests pin what visitors already see; no production code changes.

- An Event that hasn't ended and has only ticket info (no ticket link, Ticket note or Price tier) still shows the ticket sidebar with that info, and no Buy ticket, price, Ticket note or sticky bar.
- The Event page leaves extra room at the bottom on mobile only while the sticky bar shows: with Buy ticket or a Ticket note, and not for an Event that has ended or has no ticket action.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] Seam test: an Event that hasn't ended with only ticket info shows the ticket sidebar and no ticket action.
- [x] Seam test: the extra room at the bottom is there while the sticky bar shows, and missing when it doesn't.
- [x] The new tests pass against today's code; no production code changes.

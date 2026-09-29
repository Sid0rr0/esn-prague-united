# 02: One Ticket area module for the Event page and the Homepage hero

**What to build:** Every rule about what an Event shows where tickets would be lives in one Ticket area module (see `../spec.md`). Given an Event, the module returns:

- **the ticket action:** Buy ticket with the headline price, the Ticket note, or nothing;
- **the aside:** the ticket sidebar with Price tiers, ticket action and ticket info; the Album link once the Event has ended; or nothing;
- **the sticky bar:** whether it shows.

The Event page and the Homepage hero render what the module returns. The components for the hero ticket action, the ticket sidebar and the sticky bar only lay out what they're given. Add "Ticket area" to CONTEXT.md. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The Event page and the Homepage hero no longer check "has ended", Price tiers or ticket info themselves.
- [x] No ticket component decides a ticket rule; each only renders its part of the module's result.
- [x] CONTEXT.md defines "Ticket area": everything an Event shows where tickets would be (the ticket action, the aside and the sticky bar).
- [x] Every Event page and Homepage ticket test, including those from 01, passes unchanged; type checking passes.

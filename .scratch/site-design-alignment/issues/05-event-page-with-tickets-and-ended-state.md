# 05: Event page with tickets and ended state

**What to build:** The Event page as in the design (3d desktop / 3e mobile):

- **Hero:** date, time and venue.
- **Programme.**
- **Dress code** as prose.
- **Getting there:** venue address, transport as prose, and "Open in Maps".
- **Event FAQ:** an accordion at a stable `#questions` anchor, so "Ball FAQ" links can point to it.

**Tickets:**

- A desktop sidebar lists every Price tier and the rich-text ticket info under a Buy ticket button.
- On mobile, a sticky bar at the bottom shows Buy ticket plus the headline price (the first tier).
- With no ticket link, both show the Ticket note in place of the button, or nothing if there's no note.
- With no tiers, there's no price.

**Ended Event:**

- An Event has ended once its end time has passed, or its start time if it has no end time.
- Its page shows no Buy button, price, Ticket note or sticky bar. It shows a link to its Album if it has one, and nothing in that place otherwise.
- An ended Featured event on the homepage hero also stops offering tickets.

There's no "Organised by" block.

**Blocked by:** 04 (Price tiers, Ticket note and the shared ticket display rules).

**Status:** ready-for-agent

- [ ] The Event page renders at its slug with the hero facts, programme, dress code, getting there and the Event FAQ at `#questions`.
- [ ] Seam test: the sidebar lists all Price tiers in order, and the sticky bar shows the first tier's price.
- [ ] Seam test: with no ticket link, the Ticket note replaces the Buy button in both places. Nothing shows when there's no note.
- [ ] Seam test: with a ticket link and no tiers, Buy ticket shows with no price.
- [ ] Seam test: an Event past its end time shows an Album link and no ticket UI.
- [ ] Seam test: an Event with no end time but past its start time shows an Album link and no ticket UI.
- [ ] Seam test: an ended Event without an Album shows no ticket UI and no Album link.
- [ ] Seam test: the homepage hero shows no Buy button or Ticket note for an ended Featured event.
- [ ] No organisers are rendered.

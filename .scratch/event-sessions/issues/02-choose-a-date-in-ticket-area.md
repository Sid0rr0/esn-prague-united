# 02: "Choose a date" in the Ticket area

**What to build:** While an Event has an upcoming Session, its Ticket area sends visitors to the Sessions table instead of a single Buy ticket button (see `../spec.md`):

- The Ticket area gains a "choose a date" ticket action. Rule order: an Event that has ended offers nothing (unchanged); otherwise, with at least one upcoming Session, the action is choose a date, carrying the headline price (first Price tier); otherwise the existing Buy ticket / Ticket note / nothing rules apply unchanged.
- With choose a date, the Event's own Ticket link and Ticket note are ignored.
- Choose a date shows even when every upcoming Session has a Note and no link.
- It counts as a ticket action, so the ticket sidebar and the sticky bar both show, reading "Choose a date" with the headline price.
- On the Event page it links to the "Dates & tickets" section's anchor. In the homepage hero (Featured event) it links to the Event page's URL plus that anchor.
- The ticket fields shared by the Event page and the homepage's Featured event gain whether the Event has at least one upcoming Session, so the homepage decides by the same rules.
- When every Session has ended but the Event hasn't, the Ticket area falls back to the Event's own Ticket link or Ticket note.
- The label is fixed site copy with a Czech translation: "Choose a date" / "Vybrat termín".

**Blocked by:** 01 (Sessions table on the Event page)

**Status:** ready-for-agent

- [ ] Seam test: an Event without Sessions keeps its Buy ticket with its own Ticket link.
- [ ] Seam test: with an upcoming Session, the ticket sidebar and sticky bar show "Choose a date" with the headline price, linking to the section's anchor, and the Event's own Ticket link isn't rendered.
- [ ] Seam test: "Choose a date" still shows when every upcoming Session has a Note and no link.
- [ ] Seam test: when every Session has ended but the Event hasn't, the Event's own Ticket link or Ticket note shows.
- [ ] Seam test: a Past event page shows no ticket action.
- [ ] Seam test (homepage): the Featured event with upcoming Sessions shows "Choose a date" in the hero, linking to the Event page's Sessions anchor.
- [ ] Seam test: the Czech page shows "Vybrat termín".

# 01: Related events on the Event page

**What to build:** Editors can pick Related events for an Event, and visitors see them at the bottom of the Event page (see `../spec.md`):

- In the Studio, an Event has a "Related events" field in the "Programme & info" tab, after the Event FAQ. Its hint reads "Up to 3 other Events to show at the bottom of this page, e.g. last year's edition." Editors pick existing Events and drag them into order. References are weak, so deleting an Event is never blocked by other Events listing it. The rules against more than 3 picks, self-picks and duplicates come in ticket 02.
- The Event page shows a full-width block after the main grid (content plus ticket sidebar or Album link):
  - The heading is "Related events".
  - Below it, the picked Events appear as the same cards the Events list page uses (image, date, title, venue), in the editor's order, at most 3 columns on desktop.
  - A "See all events" link to the Events list page follows.
- Related events are shown whether they're upcoming or past, on Upcoming and Past event pages alike. The Featured event gets no special treatment.
- An Event with no Related events has no block. An entry pointing to a deleted Event, or to one with no web address, is skipped. If none are left, the block is hidden.
- Links are one-way: picking B on A's page doesn't change B's page.
- The heading and link are fixed site copy with Czech translations: "Související akce" and "Všechny akce".
- The query reuses the Events list's card data instead of fetching the same fields separately.
- The seeded Czech Ball has at least one Related event, so the block is visible in local development.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Seam test: an Event with no Related events renders no "Related events" block.
- [x] Seam test: Related events render as Event cards linking to their Event pages, in the editor's order, whatever their dates.
- [x] Seam test: a Related event that has ended is shown next to an upcoming one.
- [x] Seam test: a Past event page still shows its Related events.
- [x] Seam test: an entry pointing to a missing Event, or to an Event with no slug, is skipped and the rest still render.
- [x] Seam test: when every entry is broken, no block is rendered.
- [x] Seam test: the block contains a "See all events" link to the Events list.
- [x] The block renders below the main grid, full width, and the sticky ticket bar doesn't cover it on mobile.
- [x] The Czech site shows "Související akce" and "Všechny akce".
- [x] The seeded Czech Ball shows at least one Related event in local development. The seed content test still passes.

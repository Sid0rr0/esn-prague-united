# 11: Events list page with Upcoming events

**What to build:** The Events list page at `/events`, which the header menu already links to (it currently 404s). There's no design for it, so it reuses the Gallery page's pattern:

- A cyan page header (the colour of the homepage's upcoming-events block) titled "Events", with the intro "Balls, trips and parties run by ESN Prague United."
- An "Upcoming" group of Upcoming events, soonest first, as a grid of cards. Each card shows the hero image, title, date and venue, and links to the Event page. No price or Ticket note on cards.
- The Featured event is listed like any other Upcoming event; it gets no special placement here.
- With no Upcoming events, the "Upcoming" heading stays and a short line points to Instagram, as the homepage does.
- The unused all-events list query is replaced by what this page needs.

Past events are ticket 12.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Seam test: `/events` renders inside the shared header/footer shell.
- [ ] Seam test: Upcoming events are listed soonest first, each card linking to its Event page with image, title, date and venue.
- [ ] Seam test: cards show no price or Ticket note, even when the Event has Price tiers or a Ticket note.
- [ ] Seam test: the Featured event appears in the Upcoming group as a normal card.
- [ ] Seam test: with no Upcoming events, the "Upcoming" heading and the Instagram line are shown.

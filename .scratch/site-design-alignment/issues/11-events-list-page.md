# 11: Events list page with Upcoming events

**What to build:** The Events list page at `/events`, which the header menu already links to (it currently 404s). There's no design for it, so it reuses the Gallery page's pattern:

- A cyan page header (the colour of the homepage's upcoming-events block) titled "Events", with the intro "Balls, trips and parties run by ESN Prague United."
- An "Upcoming" group of Upcoming events, soonest first, as a grid of cards. Each card shows the hero image, title, date and venue, and links to the Event page. No price or Ticket note on cards.
- The Featured event is listed like any other Upcoming event; it gets no special placement here.
- With no Upcoming events, the "Upcoming" heading stays with the line "New events coming soon." and no link (ESN Prague United has no Instagram of its own).
- The unused all-events list query is replaced by what this page needs.

Past events are ticket 12.

**Blocked by:** None (can start immediately).

**Status:** done

- [x] Seam test: `/events` renders inside the shared header/footer shell.
- [x] Seam test: Upcoming events are listed soonest first, each card linking to its Event page with image, title, date and venue.
- [x] Seam test: cards show no price or Ticket note, even when the Event has Price tiers or a Ticket note.
- [x] Seam test: the Featured event appears in the Upcoming group as a normal card.
- [x] Seam test: with no Upcoming events, the "Upcoming" heading and "New events coming soon." are shown, with no Instagram link.

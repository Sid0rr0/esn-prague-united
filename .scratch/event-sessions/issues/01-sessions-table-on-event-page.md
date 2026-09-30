# 01: Sessions table on the Event page

**What to build:** Editors can give an Event Sessions, and visitors see the upcoming ones in a "Dates & tickets" table on the Event page (see `../spec.md` and ADR 0004):

- In the Studio, an Event has a "Sessions" field, first in the "Tickets" tab. Each Session has Starts (required), Ends (optional), Ticket link (optional) and a one-line Note in English and Czech, as long as the Ticket note allows at most. Each item's preview shows its date and time, with the Note or "Ticket link set" underneath. The Studio rules (Ends before Starts, outside the Event's span, more than 40, ignored Event ticket fields) come in ticket 04.
- The Event page shows a "Dates & tickets" section in the main column, right after "About the event" and before the programme, in the page's existing section-heading style. The section has an anchor that ticket 02's "Choose a date" will link to.
- One row per upcoming Session, sorted by Starts whatever order the editor typed them in:
  - date with weekday (e.g. "Thu 6 Nov"), in Prague time, using the site's existing date formatting;
  - time: "19:00–20:30", or "19:00" without Ends;
  - Buy ticket (the existing string) linking to the Session's Ticket link, or its Note when it has no link, or nothing when it has neither.
- No price column. On a phone, rows stack into compact lines, with no scrolling sideways.
- A Session has ended by the same rule as an Event (its Ends has passed, or its Starts without Ends), reusing the existing rule. Ended Sessions are filtered out in the query.
- With no upcoming Sessions, the section is omitted. Past event pages show no section.
- The Ticket area is unchanged in this ticket: the Event's own Buy ticket or Ticket note still shows.
- The heading is fixed site copy with a Czech translation: "Dates & tickets" / "Termíny a vstupenky".
- The seed has an Event with Sessions (e.g. salsa classes): several upcoming with ticket links, one ended, and one upcoming with a "Sold out" Note and no link.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] Seam test: an Event without Sessions renders no "Dates & tickets" section.
- [x] Seam test: upcoming Sessions render as rows sorted by Starts, whatever order they were entered in.
- [x] Seam test: an ended Session is not shown; a Session without Ends counts as ended once its Starts has passed.
- [x] Seam test: a row shows Buy ticket linking to the Session's Ticket link, or its Note when it has no link.
- [x] Seam test: a row shows "19:00–20:30" with Ends and "19:00" without.
- [x] Seam test: when every Session has ended, no section is rendered.
- [x] Seam test: a Past event page shows no section.
- [x] Seam test: the Czech page shows "Termíny a vstupenky" and the Czech Note.
- [ ] Rows stack on a phone with no scrolling sideways, and the sticky ticket bar doesn't cover the last row.
- [x] The seeded salsa Event is seeded, and the seed content test passes. (Checking the table in local development is still to do by hand.)

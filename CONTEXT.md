# ESN Prague: Sanity Studio

Content schema and editorial model for the ESN Prague website (Astro + Sanity + Cloudflare Pages). Editors manage all site content through Sanity Studio; the Astro site reads it via the GROQ queries in `astro-queries.ts`.

## Language

**Section**:
One of the exactly 5 ESN local chapters in Prague, each based at a different university (e.g. "ESN CTU in Prague"). Sections are created once by an admin; editors cannot add or delete them from the Studio UI.
_Avoid_: Chapter, branch, club

**Event**:
A single ESN Prague event with a date, venue, optional programme, and ticket info (e.g. the Czech Ball). Organised by one or more Sections. Ticket availability is inferred from whether a ticket link is set — there's no separate status field.
_Avoid_: Party, activity

**Album**:
A set of photos from an event or a section, shown on `/gallery`. An event owns an optional reference to its album (not every event has one yet); an album doesn't need an event (section-only photo dumps are valid). When an album belongs to an event, the album's sections are that event's organisers — an album never lists sections its event wasn't organised by.
_Avoid_: Gallery (that's the page; Album is the content type)

**Singleton**:
A document type with exactly one instance, opened directly from the Studio sidebar with no list view and no delete action (Homepage, FAQ, Contacts, Links page, Site settings).
_Avoid_: Page (ambiguous — Event and Album also render as pages, but aren't singletons)

**Highlight** (Links page):
Marks a link to render as a large coloured button instead of a plain list row.

# Spec: Related events on the Event page

Status: ready-for-agent

## Problem Statement

A visitor who finishes reading an Event page (e.g. the Czech Ball) hits a dead end. Nothing on the page points to other Events connected to it: last year's edition and its photos, the afterparty, the pre-ball dance lesson. Visitors who land on an old Event from a search have no way forward except going back to the Events list and hunting for it. Editors know which Events belong together, but have nowhere to say so except by pasting links into the "About the event" rich text.

## Solution

Editors can pick up to 3 **Related events** for each Event in the Studio. The Event page shows them at the very bottom, full width, under a "Related events" heading, as the same cards the Events list page uses, in the order the editor picked them. A "See all events" link to the Events list follows. Related events are shown whether they're upcoming or past, and on both Upcoming and Past event pages. When no Related events are picked, the block isn't shown. Links are one-way. Picking the Czech Ball 2025 on the Czech Ball 2026 page doesn't change the 2025 page.

## User Stories

1. As a visitor on an Event page, I want to see Events related to it, so that I can find other Events I'd care about without going back to the Events list.
2. As a visitor on this year's Czech Ball page, I want to see last year's Czech Ball, so that I can look at its photos and get a feel for the Event.
3. As a visitor, I want Related events shown as the same cards as on the Events list page, with image, date, title and venue, so that I recognise them and can compare them at a glance.
4. As a visitor, I want to click a Related event's card to open its page, so that I can read more about it.
5. As a visitor, I want the Related events after everything about this Event, so that they don't interrupt the programme, venue, Event FAQ or ticket details.
6. As a visitor, I want a "See all events" link under the Related events, so that I can browse every Event when none of the related ones fit.
7. As a visitor on a Past event page, I want to still see its Related events, so that I can move on from an Event I missed to one I can still attend.
8. As a visitor, I want a Related event that has already ended to still be shown, so that I can reach its page and its Album.
9. As a visitor, I want no empty "Related events" heading on an Event with none picked, so that the page doesn't look unfinished.
10. As a visitor, I want the page to keep working when a Related event was deleted, so that I never see a broken card or an error.
11. As a visitor on the Czech version of the site, I want the heading and link in Czech, so that the page reads in one language.
12. As a visitor on a phone, I want the Related events cards to stack or wrap to fit my screen, so that I can read them without scrolling sideways.
13. As an editor, I want to pick Related events for an Event from a list of existing Events, so that I don't have to type or paste links.
14. As an editor, I want to set the order of an Event's Related events, so that the most relevant one comes first.
15. As an editor, I want to be stopped from picking more than 3 Related events, so that what I see in the Studio is exactly what visitors see.
16. As an editor, I want to be stopped from picking an Event as its own Related event, so that a page never links to itself.
17. As an editor, I want to be stopped from picking the same Event twice, so that no card is repeated.
18. As an editor, I want the Related events field in the "Programme & info" tab after the Event FAQ, with a hint explaining what it's for, so that I find it where the rest of the page's content lives.
19. As an editor, I want picking B on A's page to leave B's page unchanged, so that I only change the page I'm editing.
20. As an editor, I want to delete an Event even if other Events list it as related, so that deleting old content isn't blocked by links I've forgotten about.
21. As an editor, I want a deleted Event to drop off other Events' Related events on the next Site update, so that I don't have to clean up every page that listed it.
22. As an editor, I want Related events that have ended to keep showing without me doing anything, so that last year's edition stays linked from this year's page.
23. As a developer running the site locally, I want the seeded Czech Ball to have a Related event, so that I can see the block without setting up content by hand.

## Implementation Decisions

- **Domain term.** **Related event** is defined in `CONTEXT.md`. Use it in code, Studio labels and copy. Don't use "similar", "recommended" or "More events".
- **Studio schema: Event.** Add a `relatedEvents` field: an array of references to Event documents.
  - Title "Related events", in the "Programme & info" group, placed after the Event FAQ.
  - Description: "Up to 3 other Events to show at the bottom of this page, e.g. last year's edition."
  - Validation: at most 3 items, unique references, and the Event can't reference itself. The picker's filter excludes the current document, including its draft/published pair.
  - References are **weak**, so deleting an Event is never blocked by other Events listing it. A dangling reference stays in the other Event's array until an editor removes it, and the site skips it.
  - Links are one-way. Nothing is derived from, or written to, the referenced Event.
- **Event detail query.** Extend the Event query with the Related events, dereferenced to the same card shape the Events list uses (id, title, slug, start time, venue name, main image). Keep the editor's order. Filter out entries whose reference doesn't resolve or whose Event has no slug. Reuse the existing Event card projection rather than duplicating it. If the Event list's projection can't be reused as-is, extract it so both queries share one definition.
- **Types.** The Event detail type gains an optional list of Event card data for its Related events.
- **Event page.** A new full-width block rendered after the main two-column grid (content plus ticket sidebar or Album link), not inside the main column. It contains:
  - The section heading "Related events", in the page's existing section-heading style.
  - A responsive grid of the existing Event card component, with at most 3 columns on desktop.
  - A "See all events" link to the Events list page.
  - The block is omitted entirely when the resolved list is empty.
  - It's shown on both Upcoming and Past event pages. It doesn't change the ticket sidebar, sticky ticket bar or Album link, and the sticky ticket bar mustn't cover it on mobile.
- **Fixed site copy.** Add "Related events" and "See all events" to the site's UI strings, with Czech translations "Související akce" and "Všechny akce".
- **Featured event.** No special treatment. It appears as a Related event like any other.
- **Seed data.** The seeded Czech Ball gets at least one Related event, e.g. another seeded Event, so the block shows in local development.
- **No ADR.** Weak references and the limit of 3 are cheap to change later.

## Testing Decisions

- A good test renders the real Event page through the existing page render seam (in-memory Sanity documents, real GROQ queries, current time pinned) and checks only the HTML a visitor receives. It doesn't test the query shape, types or component props directly.
- **The only seam is the Event page render seam** already used by the Event page tests. Extend the Event page test file, or add a sibling Related events test file, with cases for:
  - An Event with no Related events renders no "Related events" block.
  - Picked Related events render as Event cards linking to their Event pages, in the order the editor picked them, whatever their dates.
  - A Related event that has ended is shown next to one that is upcoming.
  - A Past event page still shows its Related events.
  - A Related events entry whose reference points to a missing Event, or to an Event with no slug, is skipped, and the page still renders the rest.
  - When every entry is broken, no block is rendered.
  - The block contains a "See all events" link to the Events list.
- The seed content test, if it checks references resolve, should cover the new seeded Related event.
- The Studio validation rules (at most 3, no self-reference, no duplicates) are **not automatically tested**. Check them by hand in the Studio. The Studio has no test seam, and this doesn't justify adding one.
- Prior art: the existing Event page tests (ticket sidebar, ended state, Album link) and the Events list tests for card rendering.

## Out of Scope

- Automatic Related events (by date, venue, Partners, category or series), and any fallback to Upcoming events when none are picked.
- Two-way links, or showing "Events that list this one".
- Categories, tags or series on Events.
- Related events in the homepage hero, on Event cards, or on Album pages.
- Marking a Related event's card as past, beyond the date it already shows.
- A "See all events" link when the block is hidden.
- Cleaning up dangling references in Event documents after an Event is deleted.

## Further Notes

- If automatic suggestions are ever wanted, they should fill empty slots after the hand-picked Related events, not replace them, so editors keep control.
- The Instagram posts spec places "On Instagram" inside the main column, before the Event FAQ. Related events sit below the whole grid, so the two don't interact.

# Spec: Sessions on the Event page

Status: ready-for-agent

## Problem Statement

Some ESN Prague United Events repeat. Dance classes run twice a week for a whole semester, and each class is sold separately. The site can't show that today. An Event has one date and one ticket link, so editors either make one Event per class, which floods the Events list and homepage with near-identical cards, or make one Event for the course and paste a list of dates and ticket links into "About the event". Visitors then can't see which classes are still coming up or which are sold out, and old dates stay listed after they've passed.

## Solution

An Event can have **Sessions**: dated times it takes place, each with its own optional ticket link or a one-line note in its place. Editors type each Session in the Studio. The Event page shows the upcoming Sessions in a "Dates & tickets" table in the main column, right after "About the event". Each row shows the date, the time, and a Buy ticket link or the Session's note. Ended Sessions drop off by themselves. While an Event has upcoming Sessions, its Ticket area shows "Choose a date", which jumps to the table, in place of the Buy ticket button. Event cards for an Event with Sessions show its date range ("1 Oct – 15 Dec") so a running course doesn't look like it happened weeks ago.

The Event keeps its own Starts and Ends as the span of the course, so being upcoming or past, list order and the daily Site update work as they do today.

## User Stories

1. As a visitor on a dance classes Event page, I want to see every upcoming class in one table, so that I can pick the one that fits my week.
2. As a visitor, I want each row to show the day and date (e.g. "Thu 6 Nov"), so that I can tell classes apart at a glance.
3. As a visitor, I want each row to show its start time, and its end time when there is one, so that I know how long the class takes.
4. As a visitor, I want a Buy ticket link on each row that has one, so that I can buy a ticket for exactly that class.
5. As a visitor, I want a row without a ticket link to say why (e.g. "Sold out", "Cancelled"), so that I don't hunt for a link that isn't there.
6. As a visitor, I want the rows in date order, soonest first, so that the next class is always at the top.
7. As a visitor, I want classes that have already happened to be gone from the table, so that I only see classes I can still attend.
8. As a visitor, I want the table right after "About the event", so that I find the dates before the programme and Event FAQ.
9. As a visitor, I want "Choose a date" in the ticket sidebar, with the headline price, so that I know tickets are sold per date and how much one costs.
10. As a visitor, I want "Choose a date" to take me to the table, so that I don't have to scroll to find it.
11. As a visitor on a phone, I want the sticky ticket bar to show "Choose a date" and take me to the table, so that buying works the same on mobile.
12. As a visitor on a phone, I want each table row to fit my screen without scrolling sideways, so that I can read and tap it easily.
13. As a visitor on the homepage, I want the Featured event hero to show "Choose a date" when the Featured event has upcoming Sessions, so that it matches the Event page.
14. As a visitor, I want "Choose a date" even when every upcoming class is sold out, so that I land on the table and see that for myself.
15. As a visitor, I want an Event card for a running course to show its date range, so that I can tell it's still on and not something from weeks ago.
16. As a visitor, I want the date range on Event cards everywhere they appear (Events list, homepage, Related events), so that the same Event looks the same everywhere.
17. As a visitor on an Event whose Sessions have all ended, I want no empty "Dates & tickets" heading, so that the page doesn't look broken.
18. As a visitor on a Past event page, I want no Sessions table and no ticket action, so that I'm not offered tickets for something that's over.
19. As a visitor on the Czech site, I want "Termíny a vstupenky" and "Vybrat termín", so that the page reads in one language.
20. As a visitor on the Czech site, I want each Session's note in Czech, so that "Sold out" or "Cancelled" is readable.
21. As a visitor, I want dates and times in Prague time, so that the class time matches the time on the ticket.
22. As an editor, I want to add Sessions to an Event one row at a time, so that I can enter a semester of classes without setting up a repeat rule.
23. As an editor, I want to give each Session its own ticket link, so that I can paste each class's ticketing page.
24. As an editor, I want to give a Session a note instead of a link, in English and Czech, so that I can mark a class sold out or cancelled.
25. As an editor, I want to cancel or move one class by editing its row, so that holidays and room changes don't need workarounds.
26. As an editor, I want to type Sessions in any order and have the site sort them, so that I can add a forgotten class at the end.
27. As an editor, I want the Studio to warn me when a Session falls outside the Event's Starts and Ends, so that I notice a typo in a date or the course span.
28. As an editor, I want the Studio to stop me when a Session ends before it starts, so that I can't publish an impossible class.
29. As an editor, I want the Studio to warn me that the Event's own Ticket link and Ticket note are ignored while it has Sessions, so that I understand why the Buy button changed.
30. As an editor, I want a warning when an Event has more than 40 Sessions, so that I catch typing a whole year by mistake, without being blocked for a long course.
31. As an editor, I want Sessions to use the Event's venue and Price tiers, so that I don't repeat them on every row.
32. As an editor, I want the Sessions field in the "Tickets" tab, so that I find it next to the other ticket fields.
33. As an editor, I want ended Sessions to disappear from the site on the next Site update without me removing them, so that the table stays current on its own.
34. As an editor, I want an Event without Sessions to behave exactly as it does today, so that the Czech Ball and other single Events are unaffected.
35. As a developer running the site locally, I want a seeded Event with Sessions, some upcoming, one ended and one sold out, so that I can see the table without entering content by hand.

## Implementation Decisions

- **Domain term.** **Session** is defined in `CONTEXT.md`, and the **Event** and **Ticket area** entries have been updated for it. Use "Session" in code, Studio labels and copy. Don't use "occurrence", "date", "class", "lesson" or "instance" for it.
- **Studio schema: Event.** Add a `sessions` field: an array of Session objects, titled "Sessions", in the "Tickets" group, placed first in that group.
  - A Session has **Starts** (datetime, required), **Ends** (datetime, optional), **Ticket link** (url, optional) and **Note** (localised string, one line, same maximum length as the Ticket note).
  - Description along the lines of: "Each date this Event takes place, e.g. every dance class. Each Session can have its own ticket link, or a note like 'Sold out'."
  - The array item preview shows the Session's date and time, with the note or "Ticket link set" as subtitle.
  - Validation:
    - Session Ends before its Starts: **error**.
    - Session outside the Event's Starts to Ends span (or before Starts when the Event has no Ends): **warning**.
    - More than 40 Sessions: **warning**, not an error.
    - Event Ticket link or Ticket note filled while Sessions exist: **warning** on those fields, saying they are ignored while the Event has Sessions.
- **Has ended.** A Session has ended by the same rule as an Event: its Ends has passed, or its Starts when it has no Ends. Reuse the existing "has ended" rule rather than writing it again.
- **Event detail query.** Extend the Event query with the Event's upcoming Sessions only (ended ones filtered out in the query), sorted by Starts ascending, each with key, Starts, Ends, Ticket link and localised Note.
- **Ticket fields.** The ticket fields the Ticket area reads (shared by the Event page and the homepage's Featured event) gain whether the Event has at least one upcoming Session.
- **Ticket area.** A new ticket action, "choose a date", is added to the Ticket area module:
  - Order of rules: an Event that has ended offers nothing (unchanged); otherwise, if it has an upcoming Session, the action is **choose a date**, carrying the headline price (first Price tier); otherwise the existing Buy ticket / Ticket note / nothing rules apply unchanged.
  - With choose a date, the Event's own Ticket link and Ticket note are ignored.
  - Choose a date counts as a ticket action for the ticket sidebar and the sticky bar, so both show.
  - It is rendered as a link to the Sessions table: an in-page anchor on the Event page, and the Event page's URL plus that anchor in the homepage hero.
- **Event page.** A new "Dates & tickets" section in the main column, right after "About the event" and before the programme:
  - Section heading in the page's existing section-heading style, with the anchor "Choose a date" links to.
  - One row per upcoming Session: date with weekday, time ("19:00–20:30", or "19:00" without Ends), then Buy ticket linking to the Session's ticket link, or its Note, or nothing when it has neither.
  - No price column.
  - Rows stack into compact lines on narrow screens, with no scrolling sideways. The sticky ticket bar mustn't cover the last row.
  - The section is omitted when there are no upcoming Sessions. It doesn't change the Album link on Past event pages.
  - Dates and times use the site's existing date formatting and Prague time.
- **Event cards.** The Event card data gains the Event's Ends and whether it has Sessions. A card for an Event with Sessions shows the date range from Starts to Ends; without Ends, it shows Starts as today. All other cards are unchanged. List ordering is unchanged.
- **Fixed site copy.** Add "Dates & tickets" / "Termíny a vstupenky" and "Choose a date" / "Vybrat termín" to the site's UI strings. Reuse the existing "Buy ticket" string on each row.
- **Seed data.** Seed an Event with Sessions (e.g. salsa classes), with several upcoming Sessions with ticket links, one ended Session, and one upcoming Session with a "Sold out" note and no link.
- **ADR.** Recorded in ADR 0004 (repeating Events as Sessions inside one Event).

## Testing Decisions

- A good test renders a real page through the existing page render seam (in-memory Sanity documents, real GROQ queries, current time pinned) and checks only the HTML a visitor receives. It doesn't test the query shape, types, the Ticket area module or component props directly.
- **The only seam is the page render seam**, used for three pages. Add a sibling Sessions test file next to the Related events tests, with cases for:
  - **Event page**
    - An Event without Sessions renders no "Dates & tickets" section, and its Ticket area is unchanged (Buy ticket with its own ticket link).
    - Upcoming Sessions render as rows sorted by Starts, whatever order they were entered in.
    - A Session that has ended is not shown; a Session without Ends counts as ended once its Starts has passed.
    - A row shows Buy ticket linking to the Session's ticket link, or its Note when it has no link.
    - A row shows "19:00–20:30" with Ends and "19:00" without.
    - When every Session has ended but the Event hasn't, there's no section, and the Ticket area falls back to the Event's own ticket link or Ticket note.
    - With an upcoming Session, the ticket sidebar and sticky bar show "Choose a date" with the headline price, linking to the section's anchor, and the Event's own ticket link isn't rendered.
    - "Choose a date" still shows when every upcoming Session has a note and no link.
    - A Past event page shows no section and no ticket action.
    - The Czech page shows "Termíny a vstupenky", "Vybrat termín" and the Czech Note.
  - **Homepage**: the Featured event with upcoming Sessions shows "Choose a date" in the hero, linking to the Event page's Sessions anchor.
  - **Events list**: a card for an Event with Sessions shows the date range; a card for an Event without Sessions shows only its start date.
- The seed content test should still pass with the seeded Event with Sessions.
- The Studio validation (Ends before Starts, outside the Event's span, more than 40, ignored Event ticket fields) is **not automatically tested**. Check it by hand in the Studio, as with Related events. The Studio has no test seam, and this doesn't justify adding one.
- Prior art: the Related events tests (sibling test file on the Event page seam), the Event page tests for the ticket sidebar and ended state, the homepage tests for the Featured event hero, and the Events list tests for card rendering.

## Out of Scope

- Generating Sessions from a repeat rule ("every Tue and Thu 19:00 until 15 Dec").
- A venue, price or Price tiers that differ per Session.
- Ordering the Events list or homepage by the next Session, or showing the next Session's date on cards.
- A whole-course pass alongside per-Session tickets.
- Showing ended Sessions, greyed out or otherwise.
- A hard limit on the number of Sessions.
- Sessions on Album pages, or as separate entries in any list.
- Migrating existing Events that list dates in "About the event".

## Further Notes

- If the date range on cards turns out not to be enough (e.g. a running course sits above next week's party in the Upcoming list), the next step is ordering by the next Session, which moves array logic into every list query.
- The Instagram posts section sits in the main column before the Event FAQ; "Dates & tickets" sits right after "About the event", so it comes before both.

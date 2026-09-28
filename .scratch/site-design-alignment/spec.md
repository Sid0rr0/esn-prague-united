# Spec: Align content model and site with the Turn 3 design (direction 2c, colour bands)

Status: ready-for-agent

## Problem Statement

The Turn 3 design ("direction 2c, colour bands") for the ESN Prague United site shows data and behaviour that the Sanity content model and the Astro queries don't support. It also leaves out things the model still carries. The main gaps:

- **Prices:** the design shows a headline price and price tiers, but prices only exist inside rich text.
- **No ticket link:** the design shows a one-line message ("Sold out", "Free entry"), but there's no field for it.
- **Ended Events:** the design has nothing for an Event after it ends.
- **Top banner:** the banner can't expire on its own.
- **Language switch:** the design shows an EN/CZ switch, but nothing is localised.
- **Homepage events block:** it behaves differently in its two states.

The model also stores things no page shows: organisers on Events, Sections on Albums, contact people, and a Section's own events and albums. Editors fill those in for nothing.

For exchange students this means a site that can advertise closed ticket sales, can't show prices at a glance, and says nothing useful about a past Event. For editors it means fields that do nothing.

## Solution

Change the content model, the queries and the rendered pages so they match the settled design. The vocabulary is in CONTEXT.md. Decisions:

- **Price tiers:** an Event gets Price tiers, and the first tier is its headline price.
- **Ticket note:** a one-line Ticket note shows in place of the Buy button when there's no ticket link.
- **Ticket availability:** still inferred from whether a ticket link is set. There is no ticket status field.
- **Ended Events:** once an Event has ended, its page points to its Album instead of selling tickets, and hides all ticket UI if there's no Album.
- **Homepage events block:** always an upcoming-events list that never repeats the Featured event.
  - When the list is empty during the ball phase (a Featured event is set), the block is hidden.
  - When it's empty otherwise, it shows a "New events coming soon" state with the Instagram link.
- **Top banner:** gets a "Hide after" date.
- **Translation:** text fields are translated per field, as in ADR 0002. English is the only language shown for now, and the language switch stays hidden.
- **Unused data:** organisers, Album sections, contact people and the Section page's event/album lists are removed.
- **Section colours:** each Section's brand colour is fixed in code.
- **Naming:** the site uses the name "ESN Prague United" everywhere.

## User Stories

1. As an exchange student, I want to see an Event's headline price next to the Buy ticket button on the homepage, so that I know the cost before clicking through.
2. As an exchange student, I want to see every Price tier on the Event page (e.g. with and without ESN card), so that I can tell whether an ESN card saves me money.
3. As an exchange student, I want the mobile Event page to keep a sticky Buy bar with the headline price, so that I can buy at any scroll position.
4. As an exchange student, I want to see a clear one-line message ("Sold out. Watch Instagram for returned tickets") instead of a Buy button when tickets aren't available, so that I don't hunt for a link that doesn't exist.
5. As an exchange student, I want a free Event to say "Free entry, no ticket needed" rather than "0 CZK", so that I don't think I need to buy something.
6. As an exchange student, I want an Event with a ticket link but no listed price to still show the Buy button, so that I can buy even when the price is only on the ticket site.
7. As an exchange student, I want the full ticket info (sale end date, what's included) on the Event page, so that I can read the details before buying.
8. As an exchange student visiting an Event page after the Event has ended, I want a link to its photo Album instead of a Buy button, so that I can find the photos.
9. As an exchange student visiting a past Event that has no Album yet, I want no ticket UI at all, so that the page doesn't pretend tickets are still sold.
10. As an exchange student on the homepage, I want to see the upcoming Events other than the Featured event, so that the hero and the list don't repeat each other.
11. As an exchange student on the homepage while only the Featured event is upcoming, I want the events list hidden, so that I don't see an empty block under the hero.
12. As an exchange student on the homepage when nothing is upcoming, I want a "New events coming soon" message with a link to Instagram, so that I know where announcements appear.
13. As an exchange student, I don't want a "Full calendar" link that leads nowhere, so that I don't hit a missing page.
14. As an exchange student, I want the top banner to disappear once its promotion is over, so that I'm not sent to a closed ticket sale.
15. As an editor, I want to set a "Hide after" date on the top banner, so that I don't have to remember to switch it off.
16. As an editor, I want to enter Price tiers as a label plus a whole CZK amount, so that prices render the same way everywhere.
17. As an editor, I want the first Price tier to be the headline price, so that I control which price appears in the hero and the sticky bar by ordering the tiers.
18. As an editor, I want a short Ticket note field with a length limit, so that the one-line message always fits the hero pill and sticky bar.
19. As an editor, I want to keep rich-text ticket info for longer details, so that I can explain sale dates, inclusions and door sales.
20. As an editor, I want ticket availability to follow from whether I set a ticket link, so that I have one less field to keep in sync.
21. As an editor, I want to pick a Featured event that takes over the homepage hero, so that I can promote the Czech Ball during its sales phase.
22. As an editor, I want the homepage hero to go back to ESN Prague United content when I clear the Featured event, so that the site doesn't promote a past Event.
23. As an editor, I no longer want to be asked which Sections organised an Event, so that I don't fill in a field nobody sees.
24. As an editor, I no longer want to be asked which Sections an Album belongs to, so that creating an Album is quicker.
25. As an editor, I no longer want a contact-people list on the Contacts page, so that I don't have to update it after each board handover.
26. As an editor, I want each Section to keep its fixed brand colour without a colour field, so that no two Sections can end up the same colour.
27. As an editor, I want every translatable text field to have an English and a Czech value, so that Czech can be added later without restructuring content.
28. As an editor, I want an empty Czech value to fall back to English, so that I can translate gradually.
29. As an exchange student, I don't want to see a language switch until Czech content exists, so that I'm not offered a half-empty Czech site.
30. As an exchange student, I want the FAQ page to answer general questions (ESN card, buddy programme, joining), so that I find answers about ESN Prague United in one place.
31. As an exchange student, I want "Ball FAQ" links to take me to the questions on the Czech Ball Event page, so that ball questions stay with the ball.
32. As an editor, I want the FAQ help text to suggest general topics, so that I don't put Event-specific questions on the FAQ page.
33. As an exchange student, I want the Section page to show the Section's about text, office info, buddy sign-up and socials, so that I know how to reach my Section.
34. As an exchange student, I want transport directions, dress code and office details shown as readable text, so that they work for any Event or Section, not just the ball.
35. As an exchange student, I want the site to call the organisation "ESN Prague United" consistently, so that the name matches the logo and social accounts.

## Implementation Decisions

- **Event schema:**
  - Add an ordered list of **Price tiers**. Each tier has a required free-text label and a required whole-number CZK amount (integer, positive). A free Event has no tiers; a 0 CZK tier isn't a valid way to express "free".
  - Add a plain-text **Ticket note**, a single line limited to about 60 characters, shown in the Tickets group.
  - Keep ticket link and rich-text ticket info unchanged.
  - Remove the organisers field.
  - Don't add a ticket status field. Availability stays inferred from whether a ticket link is set.
- **Ticket display rules** (for the homepage hero, upcoming rows, Event page sidebar and mobile sticky bar):
  - **Ended** (end time passed; start time if there is no end): no Buy button, price or Ticket note. The Event page shows an Album link if there is an Album, otherwise nothing.
  - **Has ticket link:** Buy button. The headline price pill (first tier) shows only if there are tiers. The sidebar lists all tiers.
  - **No ticket link:** the Ticket note shows in place of the Buy button. If there's no Ticket note either, nothing shows.
- **Album schema:** remove the Sections field. An Album is linked from at most one Event through the Event's existing album reference.
- **Contacts singleton:** remove contact people and the contact-person object type.
- **Site settings:** the top banner gets an optional "Hide after" date, using the same pattern and label as the Links page's visibility date. The banner shows only when it's enabled and not past its date.
- **Homepage singleton:** update the Featured event help text. It must no longer mention a fallback card, and should explain that clearing it returns the hero to ESN Prague United content.
- **FAQ singleton:** change the topic help-text examples to general topics (ESN card, Buddy programme, Joining ESN).
- **Translation (ADR 0002):**
  - Translatable text fields hold per-language values.
  - Rendering uses English, and an empty Czech value falls back to English.
  - English lives at the site root and Czech under a `/cs/` prefix with shared slugs.
  - No Czech routes or language switch ship in this spec, but the schema shape and the fallback resolution are built now.
- **Queries:**
  - **Homepage query:**
    - Return the Featured event only when picked, as today.
    - Return upcoming Events that exclude the Featured event, ordered soonest first, each with its headline price, ticket link and Ticket note.
    - Drop the next-event fallback.
    - The upcoming list is small (0–3 in practice). Cap it at 4.
  - **Event query:** drop organisers, and add Price tiers and Ticket note.
  - **Section query:** drop the Section's events and albums.
  - **Contacts query:** drop people.
  - **Site settings query:** the banner's visibility is decided with the same `now()` comparison as Links page items.
- **Homepage events block states:**
  - Hidden when the list is empty and a Featured event is set.
  - "New events coming soon" with the Instagram link when it's empty and no Featured event is set.
  - A list otherwise.
  - Rows show date and title only, with no Section.
  - No "Full calendar" link until the Events list page exists.
- **Section colours:** a fixed mapping in code from Section slug to brand colour and tint. There is no schema field (consistent with ADR 0001).
  - CU: cyan
  - CTU: magenta
  - VŠE: green
  - CZU: orange
  - UCT: dark blue
- **Rich text instead of structured blocks:** Event transport, Event dress code and Section office stay as text and render as prose. The design's line tags, dress cards and office rows are dropped.
- **Naming:** all site copy and metadata use "ESN Prague United". This follows the CONTEXT.md glossary.
- **Content migration:** existing documents may have values in the removed fields (organisers, album sections, people). Unset those fields in the dataset once the schema change ships, so no orphaned data stays behind.

## Testing Decisions

- **What a good test is:** it checks what a visitor sees on a rendered page for a given set of content documents and a given "now". It doesn't check query shapes, component props or internal helpers. A refactor of queries or components that keeps the pages the same shouldn't break any test.
- **The one seam:**
  1. Each test builds a small in-memory set of Sanity documents: Events, Albums, Sections, and the Homepage, Site settings and Contacts singletons.
  2. The real GROQ queries run against it through `groq-js`, with `now()` pinned per test.
  3. The page renders through Astro's Container API.
  4. Assertions check the resulting HTML.
- **Behaviours to cover:**
  - Featured event excluded from the upcoming list.
  - The three states of the upcoming block.
  - A headline price pill shown only when tiers exist.
  - All tiers listed on the Event page.
  - Ticket note shown when there's no ticket link.
  - Nothing shown when there's neither a ticket link nor a note.
  - An ended Event showing an Album link, or no ticket UI when it has no Album.
  - The ended rule using the end time and falling back to the start time.
  - The banner hidden after its "Hide after" date and shown before it.
  - No "Full calendar" link.
  - Czech values falling back to English in the value-resolution path.
  - No organisers, Album sections or contact people rendered anywhere.
- **Test runner:** Vitest, added to the web app. This is new; the repo has no prior tests.
- **Studio schema:** covered by type-checking and a manual check in the Studio, with no unit tests for validation rules.

## Out of Scope

- The Events list page (`/events`) and its design.
- Czech content, Czech routes and a visible language switch. Only the schema shape and English fallback are in scope.
- A ticket status field (explicitly rejected).
- Structured transport, dress code or office data.
- Contact people on the Contacts page.
- A Section's events and albums on its page, and any link between Sections and Events or Albums.
- A desktop design for the info pages beyond what Turn 3 shows.

## Further Notes

- Vocabulary follows CONTEXT.md: ESN Prague United, Section, Event, Price tier, Ticket note, Featured event, Album, FAQ vs Event FAQ, Singleton, Highlight.
- Related decisions:
  - ADR 0001 (fixed five Sections) is why Section colours live in code.
  - ADR 0002 (field-level translation) sets the translation shape.
- The design file is `ESN Prague Site.dc.html`, Turn 3, direction 2c. Its sample content (the Czech Ball, prices and people) is illustrative only.

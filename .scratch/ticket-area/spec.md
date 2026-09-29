# Spec: One Ticket area module for an Event's tickets

Status: ready-for-agent

## Problem Statement

CONTEXT.md gives an Event's ticket rules in one place:

- Ticket availability is inferred from whether a ticket link is set.
- Without a link, the Event shows its Ticket note instead.
- The first Price tier is the headline price.
- Once an Event has ended, it no longer offers tickets and points to its Album instead, if it has one.

In the code, those rules are split between a small ticket decision module and its callers:

- **The ticket decision** chooses between Buy ticket (with the headline price), the Ticket note, or nothing, and returns nothing once the Event has ended.
- **The Event page** decides the rest itself:
  - whether the aside shows the ticket sidebar at all (not ended, and there is a Buy button, a Ticket note, a Price tier or ticket info);
  - that an ended Event's aside holds the "See the photos" link to its Album instead;
  - how much room to leave at the bottom on mobile while the sticky bar shows.
- **The three places a ticket action shows** (the Homepage hero, the ticket sidebar and the sticky bar) each branch on the ticket decision again.

The ticket decision was pulled out as a pure function, but half the rules stayed on the page that calls it. There is no locality: changing what an ended Event shows means editing the Event page, not the ticket module. When the Related events and Partners features land, the Event page will grow further, and these rules will be harder to find. The ended-Event and aside rules can only be checked by pattern-matching the rendered HTML.

For exchange students nothing is wrong today. The risk is to them later: an edit to the Event page could show ticket UI for an Event that has ended, which is exactly what the design forbids.

## Solution

Widen the ticket decision into one **Ticket area** module. Given an Event, it returns everything each place shows where tickets would be:

- the **ticket action**: Buy ticket with its headline price, the Ticket note, or nothing, used by the Homepage hero and the sticky bar;
- the **aside**: the ticket sidebar (Price tiers, ticket action, ticket info), the Album link once ended, or nothing;
- whether a **sticky bar** shows, which also decides the extra room at the bottom on mobile.

The Event page and the Homepage hero render what the module returns and hold no ticket rules of their own. The components that draw the Buy button, Ticket note, sidebar and sticky bar only lay out what they're given. Visitors see exactly what they see today.

## User Stories

1. As an exchange student, I want an Event with a ticket link to show Buy ticket with its headline price, so that I can buy a ticket and know the cost first.
2. As an exchange student, I want an Event with a ticket link but no Price tiers to show Buy ticket without a price, so that I'm not shown a made-up price.
3. As an exchange student, I want an Event with no ticket link to show its Ticket note (e.g. "Sold out") instead of Buy ticket, so that I know why I can't buy.
4. As an exchange student, I want an Event with neither a ticket link nor a Ticket note to show no ticket action, so that I'm not shown an empty button.
5. As an exchange student, I want the ticket sidebar to list every Price tier, so that I can compare prices with and without an ESN card.
6. As an exchange student, I want the ticket sidebar to show the ticket info, so that I can read the longer details about buying.
7. As an exchange student on mobile, I want a sticky bar with Buy ticket and the headline price, or the Ticket note, so that the ticket action stays in reach while I scroll.
8. As an exchange student on mobile, I want the page to leave room at the bottom while the sticky bar shows, so that the bar never covers the last content.
9. As an exchange student, I want an Event that has ended to show no Buy ticket, price, Ticket note or sticky bar, so that I'm never sent to a closed ticket sale.
10. As an exchange student, I want an ended Event with an Album to show "This event has ended" and a link to its photos, so that I can find the photos from the night.
11. As an exchange student, I want an ended Event without an Album to show nothing where tickets were, so that there is no dead end.
12. As an exchange student, I want an Event with no end time to count as ended once its start time has passed, so that single-moment Events stop selling tickets on time.
13. As an exchange student, I want an Event that has started but not reached its end time to keep selling tickets, so that I can still buy for a long Event that's under way.
14. As an exchange student, I want the Homepage hero's ticket action for the Featured event to follow the same rules as its Event page, so that the two never disagree.
15. As an editor, I want ticket behaviour to keep following only the ticket link, Ticket note, Price tiers, ticket info and the Event's times, so that I have nothing new to fill in or learn.
16. As a developer, I want every rule about what shows where tickets would be in one module, so that changing a ticket rule is one edit in one place.
17. As a developer, I want the Event page to hold no ticket rules, so that adding Related events and Partners to the Event page can't disturb them.
18. As a developer, I want the Homepage hero and the Event page to use the same module, so that the Featured event's ticket action can't drift from its Event page.
19. As a developer, I want the components that draw the ticket action, sidebar and sticky bar to only lay out what they're given, so that no component re-decides a rule.
20. As a developer, I want the module's result to name each place (ticket action, aside, sticky bar) with the CONTEXT.md vocabulary, so that the code reads like the design.
21. As a developer running the tests, I want every existing Event page and Homepage ticket test to pass unchanged, so that I know the refactor kept what visitors see.
22. As an agent picking up a ticket change, I want to open one module to find every ticket rule, so that I don't have to read the Event page's markup to learn them.

## Implementation Decisions

- **Module.** The ticket decision module grows into the **Ticket area** module. Its one read of an Event returns the whole Ticket area. Add "Ticket area" to CONTEXT.md: "Everything an Event shows where tickets would be: the ticket action, the aside and the sticky bar."
- **Input.** The fields the content reads already return: ticket link, Ticket note, Price tiers, ticket info, "has ended" and the linked Album. Ticket info and Album are optional, because the Homepage's Featured event doesn't read them. "Has ended" is still computed in GROQ, where it is written once.
- **Result shape.** Every union is tagged:
  - **ticket action:** `buy` with the link and an optional headline Price tier, `note` with the Ticket note text, or `none`;
  - **aside:** `tickets` with the Price tiers, ticket action and ticket info; `album` with the Album's slug; or `none`;
  - **sticky bar:** whether it shows, derived from the ticket action.
- **Rules inside the module:**
  - An ended Event's ticket action is always `none`, whatever its ticket fields hold.
  - An ended Event's aside is `album` when it has an Album, otherwise `none`.
  - An Event that hasn't ended gets the `tickets` aside only when it has a ticket action, a Price tier or ticket info. Otherwise the aside is `none`.
  - The headline price is the first Price tier.
- **Callers:**
  - The Event page reads the Ticket area once and renders the aside and the sticky bar from it, including the extra room at the bottom on mobile.
  - The Homepage hero reads the ticket action for the Featured event from the same module.
  - Neither caller checks "has ended", Price tiers or ticket info itself.
- **Components.** The hero ticket action, the ticket sidebar and the sticky bar take the module's result for their place and only lay it out. The "This event has ended / See the photos" aside is drawn from the `album` aside result.
- **Independent of content reads.** This spec doesn't depend on the content-reads spec, and either can land first. If content reads lands first, the Event and Homepage content-read modules keep returning raw ticket fields plus "has ended", and the pages pass them to the Ticket area module.
- **No schema change.** The Studio, the stored content and the queries don't change.

## Testing Decisions

- **One seam, the highest one.** Tests keep rendering the Event page and the Homepage through the Astro container over in-memory Sanity documents, with `fetchRaw` answered by groq-js and `now()` pinned. No new test seam is added, and the Ticket area module gets no tests of its own.
- **Existing tests are the safety net.** The 8 ticket tests on the Event page and the 5 on the Homepage cover every rule above and must pass unchanged. A test that has to change means behaviour changed, and that is a bug in the refactor.
- **What makes a good test here.** It asserts what a visitor sees for a given Event and a given time: the Buy button, the price, the Ticket note, the sticky bar, the Album link. It never asserts the module's result shape or which component drew what.
- **Gaps to close.** Check the existing tests for these two rules and add a page test for any that isn't covered yet:
  - an Event that hasn't ended with only ticket info (no ticket link, Ticket note or Price tier) still shows the ticket sidebar;
  - the page leaves room at the bottom only while the sticky bar shows.
- **Prior art.** The Event page tests (Price tiers, Ticket note, no ticket action, no tiers, ended with and without an Album, no end time, started but not ended) and the Homepage Featured event ticket tests.

## Out of Scope

- The content-read modules (the content-reads spec).
- One module for how a translated field is stored (architecture review candidate 3).
- Any visible change to the Homepage or the Event page.
- Any change to the Studio schema, stored content or queries.
- A ticket status field. Availability stays inferred from the ticket link, per CONTEXT.md.
- Related events and Partners on the Event page (their own specs).

## Further Notes

- Source: the architecture review of 2026-09-29, candidate 2.
- The rules come from the Event, Price tier, Ticket note and Upcoming event vs Past event entries in CONTEXT.md. The module's comments should use those terms.
- Landing this before the Related events and Partners tickets keeps their Event page changes clear of ticket rules.

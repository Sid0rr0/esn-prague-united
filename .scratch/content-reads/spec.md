# Spec: Deepen content reads into one module per page

Status: ready-for-agent

## Problem Statement

Every page of the Astro site reads its content in three pieces that live apart:

- a GROQ query in the shared queries module;
- a hand-written result shape in the shared types module;
- a `fetchContent<Shape>(QUERY)` call on the page that pairs the two.

Nothing checks that the shape matches what the query returns. A page could name the wrong shape for its query and still compile. The last 35 commits bear this out: the queries module changed in 15 of them and the types module in 13, nearly always together. Each new page repeats the same three-way pairing, and a change to one query means a matching change in another file with nothing to catch a mismatch.

Pages also carry content rules the query leaves unfinished. They fall back to an empty object when a Singleton hasn't been created, pull the Featured event and the lists out of the Homepage result, and decide the Upcoming list's state (list, hidden, or "New events coming soon"). These rules sit in page markup, a long way from the query they depend on. The page tests can only reach them through rendered HTML.

For developers and agents working on the site, a content change is spread over several files with nothing tying them together. Exchange students and editors see no difference today. They pay later, when a mismatch between query and shape reaches a page as a missing field.

## Solution

Replace the query-plus-shape-plus-`fetchContent` pairing with **one content-read module per page**, each with a small interface: a read function that takes only what the page knows (usually nothing, or a slug) and returns the page's content ready to render.

Each content-read module owns:

- its GROQ projection;
- its result shape;
- language resolution (field-level i18n, ADR 0002), still passed through the shared `localise`;
- the fallback when a Singleton or document is missing;
- any content rule that only reshapes query results, such as the Homepage's Upcoming list state.

Pages call the read function and render what it returns. They no longer import queries, result shapes or `fetchContent`.

The `fetchRaw` seam stays exactly as it is. Its two adapters are unchanged: the Sanity client in production and groq-js over in-memory documents in tests. Visitors see the same pages, and editors see no change in the Studio.

## User Stories

1. As a developer, I want each page's query and its result shape in one place, so that changing a projection and its shape is one edit in one module.
2. As a developer, I want a page to read its content with one call that takes only a slug (or nothing), so that I don't need to know which query and which shape belong together.
3. As a developer, I want it to be impossible to pair a page with the wrong result shape, so that a mismatch can't silently reach a rendered page.
4. As a developer adding a new page, I want a clear pattern to copy (one content-read module next to one page), so that new pages don't grow the shared queries and types modules.
5. As a developer, I want the Homepage's Upcoming list state (list / hidden while an Event is featured / "New events coming soon") decided in the Homepage content-read module, so that the rule from CONTEXT.md lives next to the query that feeds it.
6. As a developer, I want the fallback for a Singleton that doesn't exist yet (FAQ, Contacts, Links page, Privacy policy, Site settings) to live in its content-read module, so that pages don't each repeat an empty-object fallback.
7. As a developer, I want the Event page and the Album and Section detail pages to get a clear "not found" result for an unknown slug, so that the page only has to turn that into a 404.
8. As a developer, I want the slug lists for static paths (Events, Sections, Albums) read through the same content-read modules as their detail pages, so that everything about one document type's reads sits together.
9. As a developer, I want every content-read module to still resolve translated fields to one language with English fallback, so that ADR 0002's behaviour doesn't change.
10. As a developer, I want the read functions to accept a language (defaulting to English), so that the later Czech rollout under `/cs/` needs no change to the interface.
11. As a developer, I want the query fragments several pages share (image projection, "has ended" filter, ticket fields, "Hide after" filter, Album card, list limits) kept in one shared place, so that the rule "an Event has ended once its end time has passed, or its start time when it has no end time" is still written once.
12. As a developer, I want Site settings read by the layout through its own content-read module, so that the shell follows the same pattern as the pages.
13. As a developer, I want each shared shape (e.g. Price tier, Socials, SEO, Sanity image) to have exactly one definition that the page shapes reuse, so that shared shapes don't drift between pages.
14. As a developer, I want each content-read module to state its content rules (why a field is filtered, why a list is capped) as comments next to the projection, as the current queries do, so that the reasoning moves with the code.
15. As a developer running the tests, I want every existing page test to pass unchanged, so that I know the refactor preserved what visitors see.
16. As a developer running the tests, I want the tests to keep answering `fetchRaw` from in-memory documents with real GROQ, so that the projections are still exercised for real.
17. As an agent picking up a page change, I want to open one module to see what a page reads and in what shape, so that I don't need to search across queries, types and pages to understand one page.
18. As an exchange student, I want every page to show exactly what it shows today, so that the refactor is invisible to me.
19. As an editor, I want the Studio and the stored content to stay exactly as they are, so that I have nothing to relearn or migrate.
20. As a reviewer, I want each page migrated as its own small change, so that each diff is easy to check against its page tests.

## Implementation Decisions

- **Module per page.** One content-read module per page or page group:
  - Site settings (layout);
  - Homepage;
  - Events list;
  - Event (detail and slugs);
  - Sections (list, detail and slugs);
  - Gallery and Album (list, detail and slugs);
  - FAQ;
  - Contacts;
  - Links page;
  - Privacy policy.
- **Naming.** Modules are named after the CONTEXT.md concept or Singleton they read, not after "query" or "type".
- **Interface.** Each module exposes read functions such as `readHomepage()`, `readEvent(slug)`, `readEventSlugs()`, `readFaq()`.
  - Each takes an optional language, defaulting to English.
  - Each returns a Promise of the page-ready shape.
  - The GROQ string and the raw result shape are not exported.
- **Missing documents.** Detail reads (Event, Section, Album) return `null` for an unknown slug. Singleton reads return an empty page shape when the Singleton doesn't exist, so pages no longer write `?? {}`.
- **Homepage.** The Homepage module returns the Upcoming list already classified. Its shape is a tagged union: a list of Events, hidden (a Featured event is set and nothing else is upcoming), or "coming soon". The page switches on that tag instead of computing it.
- **Shared fragments.** GROQ fragments used by more than one module (image projection, "has ended", ticket fields, the "Hide after" filter, Album card, Section summary, list limits) move to one shared fragments module. They are not duplicated per page.
- **Shared shapes.** Shapes used by more than one page (Sanity image, SEO, Socials, rich text, Price tier, ticket fields, Event summary and card, Album summary, Section summary, FAQ entry) stay in one shared shapes module. Page-only shapes move into their page's module.
- **Language resolution.** It stays in the shared `localise`. Each read function calls `fetchRaw` and then `localise` inside the module. `fetchContent` is removed once no page uses it.
- **The seam stays.** `fetchRaw` is still the one seam between the site and Sanity, with its two existing adapters. No new seam is introduced.
- **Ticket logic.** The ticket decision (`ticketDisplay`) and the Event page's ticket-area rules are out of scope. They are a separate candidate from the architecture review. Content-read modules keep returning the raw ticket fields plus "has ended".
- **Migration order.** Migrate one page (or page group) at a time. Start with the Homepage, since it carries the most rules and gains the most. Remove the shared queries module and the old page shapes once the last page is migrated.
- **Sanity TypeGen.** Not adopted here. The spec keeps hand-written shapes, but puts each next to its projection. Deriving shapes with TypeGen would need a mapped "localised" type (stored locale objects resolved to strings) and is left for later.

## Testing Decisions

- **One seam, the highest one.** Tests keep rendering whole pages through the Astro container over in-memory Sanity documents, with `fetchRaw` answered by groq-js and `now()` pinned. No new test seam is added, and content-read modules get no tests of their own.
- **Existing page tests are the safety net.** They should pass unchanged at every migration step. A page test that has to change means behaviour changed, and that is a bug in the migration, not in the test.
- **What makes a good test here.** It asserts what a visitor sees for given documents and a given time. It never asserts which query ran, what shape came back, or how a module is split up.
- **New tests.** Add a page test only for behaviour that has none yet and that moves into a content-read module. For example: a Singleton that doesn't exist yet still renders its page with defaults.
- **Prior art.** The Homepage, Events list, Event page, Sections, Gallery, FAQ, Contacts, Links, shell, i18n and dropped-data page tests. The last two are the guard that ADR 0002 fallback and dropped-field filtering survive the move.
- **Type checking.** `astro check` / `tsc` must pass. Pages that no longer import queries or shapes are the structural proof that the pairing is gone.

## Out of Scope

- Widening the ticket decision to the Event's whole ticket area (architecture review candidate 2).
- One module for how a translated field is stored, shared by the Studio, the web, the seed and the fixtures (candidate 3).
- Adopting Sanity TypeGen or `defineQuery`.
- Any change to the Studio schema, stored content, migrations or seed.
- Any visible change to any page.
- Showing Czech or the language switch.

## Further Notes

- The domain rules the modules encode are all in CONTEXT.md (Featured event, Upcoming event vs Past event, Singleton, Ticket note). The modules' comments should use those terms.
- ADR 0001 (fixed five Sections) and ADR 0002 (field-level i18n) are respected. Section colours stay fixed in code and keyed by slug, and translated fields still fall back to English per field.
- Source: the architecture review of 2026-09-29, candidate 1 (top recommendation).

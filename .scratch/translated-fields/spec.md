# Spec: One module for how a translated field is stored

Status: ready-for-agent

## Problem Statement

ADR 0002 stores every translatable field as one value per language: English, with Czech to come. But what that stored value looks like is written out separately in six places across the two workspaces:

- **Studio schema:** the three translated field types (single line, multi-line text, rich text), the language list, and the "is empty" rule that "English is required" validation uses.
- **Studio text migration:** its own copy of the three type names, and its own "is already translated" check.
- **Studio seed:** its own builders for an English-only translated string, text and rich text.
- **Web language resolution:** its own language list, type names, "is translated" check and "is empty" rule, which decides when Czech falls back to English.
- **Web test fixtures:** their own builder, which labels every translated value as a single line, rich text included.

The copies already disagree:

- **The fixtures don't match what the Studio stores.** They label rich text and multi-line text as single lines. Tests pass only because the web's "is translated" check also accepts any object holding just language keys.
- **The two "is translated" checks differ.**
  - The web's recognises a field cleared in both languages (stored as just its type label).
  - The migration's only looks for an English or Czech value, so it would treat that cleared field as untranslated and wrap it a second time.
- **"Is empty" is written twice.** Once for the Studio's "English is required" check and once for the web's fallback to English. If one copy changes, a value the Studio accepts as filled in could be treated as empty on the site, or the reverse.

The Czech rollout will touch all of these: turning on the language switch, making Czech required in places, and adding languages to the seed and fixtures. Each change will have to be made in several places, with nothing to show that the copies still agree.

## Solution

One small shared workspace owns the stored shape of a **translated field**:

- the language list and the default language;
- the three translated field type names;
- the "is translated" rule;
- the "is empty" rule;
- builders that make a stored translated value of each type.

It is plain TypeScript with no Sanity or Astro dependency. The Studio schema, the text migration, the seed, the web's language resolution and the web's test fixtures all import it instead of keeping their own copy.

Nothing changes for visitors or editors. Pages render the same, the Studio edits the same fields, and stored content is untouched.

## User Stories

1. As a developer, I want the language list defined once, so that adding or reordering a language is one edit.
2. As a developer, I want the default language (English) defined once, so that the fallback language and the required language can't drift apart.
3. As a developer, I want the three translated field type names defined once, so that the schema, the migration and language resolution can't disagree on them.
4. As a developer, I want one "is translated" rule, so that the site and the migration agree on which stored values are translated fields.
5. As a developer, I want the "is translated" rule to recognise a field cleared in both languages, so that neither the site nor a migration mistakes it for plain text.
6. As a developer, I want one "is empty" rule, so that a value the Studio accepts as filled in is also treated as filled in when the site falls back to English, and the reverse.
7. As a developer, I want builders for a stored single line, multi-line text and rich text, so that seed content and test documents are built exactly as the Studio stores them.
8. As a developer, I want the builders to take an English value and an optional Czech value, so that tests of the Czech fallback use the same builders as everything else.
9. As a developer writing a page test, I want the fixtures to label each translated value with its real type, so that my test documents match what editors produce.
10. As a developer running the seed, I want sample content built by the shared builders, so that a fresh dataset holds the same shape the Studio would save.
11. As a developer, I want the web's language resolution to keep its behaviour exactly (Czech falls back to English per field, blank means empty, a field cleared in both languages resolves to nothing), so that ADR 0002 still holds.
12. As a developer, I want the Studio's "English is required" and length validation to keep their behaviour exactly, so that editors see the same messages.
13. As a developer, I want the text migration to keep producing the same results, so that running it again is still harmless.
14. As a developer, I want the shared workspace to have no Sanity or Astro dependency, so that the web doesn't pull in the Studio's dependencies and the Studio doesn't pull in the site's.
15. As a developer preparing the Czech rollout, I want every rule about translated fields in one module, so that the rollout's changes start in one place.
16. As an agent picking up a translation change, I want one module to read for the stored shape, so that I don't need to find and compare six copies.
17. As a developer running the tests, I want every existing web and Studio test to pass unchanged, so that I know the refactor kept every behaviour.
18. As an exchange student, I want every page to read exactly as it does today, so that the refactor is invisible to me.
19. As an editor, I want the Studio's fields, validation and stored content to stay exactly as they are, so that I have nothing to relearn or migrate.

## Implementation Decisions

- **New workspace.**
  - A small shared package under a new packages folder, added to the pnpm workspace alongside the apps.
  - Plain TypeScript, with no Sanity, Astro or runtime dependencies.
  - Named after the concept it owns: translated fields.
  - Both apps depend on it through the workspace protocol.
- **Commit scope.** Commits to it use the `shared-types` scope already listed in CLAUDE.md, unless the maintainer renames that scope to match the package.
- **Interface:**
  - the language list, as ids with display titles, and the default language;
  - the three translated field type names, as a union type and a list;
  - "is translated" (a value is a translated field);
  - "is empty" (undefined, null, a blank string, or an empty list);
  - one builder per field type that returns the stored value, with the type label, English, and Czech when given.
- **Which "is translated" rule wins.** A value is a translated field when it is labelled with one of the three types, or holds a language key, and holds nothing but language keys and Sanity's own keys. This is the web's current rule. It also makes the migration recognise a field cleared in both languages.
- **Callers:**
  - The Studio schema builds its three field types from the shared language list and type names, and validates with the shared "is empty". The Studio-only parts (field titles, validation messages, `defineType`) stay in the Studio.
  - The text migration uses the shared type names and "is translated". Its map of where translatable fields sit in each document stays in the migration.
  - The seed uses the shared builders.
  - The web's language resolution uses the shared language list, default language, type names, "is translated" and "is empty". Walking a query result and picking a language stays in the web.
  - The web's test fixtures use the shared builders, and label each field with its real type.
- **Glossary.** Add "Translated field" to CONTEXT.md: a field stored with one value per language, where an empty Czech value falls back to English (ADR 0002). Add it to the Avoid list for "localised field" and "locale field", which the code uses today.
- **ADR 0002 unchanged.** Field-level translation, the English fallback, the `/cs/` URL plan and the hidden language switch all stay as decided.
- **No content change.** No schema field changes type or name, and no migration runs against the dataset.

## Testing Decisions

- **Existing seams only.** No new test seam is added, and the shared workspace gets no tests or test runner of its own. Its behaviour is covered where it is used:
  - the web page tests render pages over in-memory documents;
  - the web's direct language-resolution tests cover fallback, blank values and fields cleared in both languages;
  - the Studio's migration tests and seed tests run on Node's test runner.
- **Existing tests are the safety net.** Every one of those tests must pass unchanged. Test documents built through the fixtures will now carry their real type labels. That changes test helpers, not test assertions.
- **What makes a good test here.** It asserts what a visitor sees, what the migration produces, or what the seed writes. It never asserts where a rule lives or how the shared module is split.
- **Gap to close.** Add a migration test that a field already cleared in both languages is left alone. This is the one behaviour this spec changes on purpose, and nothing tests it today.
- **Type checking.** Both apps' type checks must pass. Once nothing in the Studio or web keeps its own language list, type names or builders, the six copies have become one.

## Out of Scope

- Showing Czech, making Czech required anywhere, or turning on the language switch.
- Switching to document-level translation (ADR 0002 stays).
- Changing the dataset: no migration is run, and stored values keep their current shape.
- The content-read modules (the content-reads spec) and the Ticket area (the ticket-area spec).
- Moving the migration's map of where translatable fields sit into the shared workspace. It belongs to one migration.
- Deriving web result shapes from the Studio schema (Sanity TypeGen).

## Further Notes

- Source: the architecture review of 2026-09-29, candidate 3.
- The review found four copies. This spec adds two it missed: the text migration's type names and "is translated" check, and the Studio validation's "is empty".
- Independent of the content-reads and ticket-area specs; it can land before, after or between them. Landing it before the Czech rollout starts is what pays off.

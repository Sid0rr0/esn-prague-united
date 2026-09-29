# 02: Create the translated-fields workspace and move the Studio onto it

**What to build:** A small shared workspace owns how a translated field is stored (see `../spec.md`). It is plain TypeScript with no Sanity or Astro dependency, added to the pnpm workspace beside the apps. It holds:

- the language list with display titles, and the default language (English);
- the three translated field type names;
- "is translated" (the rule from 01);
- "is empty" (undefined, null, a blank string, or an empty list);
- one builder per field type: a stored value with its type label, English, and Czech when given.

The Studio moves onto it and deletes its own copies:

- the schema builds its three translated field types from the shared languages and type names, and validates with the shared "is empty";
- the text migration uses the shared type names and "is translated";
- the seed uses the shared builders.

Add "Translated field" to CONTEXT.md. Editors see the same fields, validation messages and stored content.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The shared workspace has no Sanity, Astro or runtime dependency.
- [ ] The Studio schema, migration and seed keep no language list, type names, "is translated", "is empty" or builders of their own.
- [ ] CONTEXT.md defines "Translated field": a field stored with one value per language, where an empty Czech value falls back to English (ADR 0002). Its Avoid list includes "localised field" and "locale field".
- [ ] The Studio's migration and seed tests pass unchanged; the Studio type check passes.

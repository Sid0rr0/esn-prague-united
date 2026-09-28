# 03: Field-level translation with English fallback

**What to build:** As ADR 0002 decides, every translatable text field holds an English and a Czech value. The site shows English. Where Czech is later requested and a Czech value is empty, the English one is shown instead. Existing content is migrated into the English value, so the site looks exactly the same afterwards.

No Czech routes and no language switch ship here. This builds the content shape and the fallback resolution now, so every page ticket after this one is written against localised fields once.

This is a wide change across all schemas. It lands before the page tickets so that no page is written twice.

**Blocked by:** 01 (test seam), 02 (same schemas, fewer fields to translate).

**Status:** done

- [x] Every translatable text field in the Studio offers English and Czech values. Slugs, URLs, dates, numbers and images are not translated.
- [x] Queries and pages resolve a localised field to English. A Czech request falls back to English per field when the Czech value is empty.
- [x] A seam test shows a page rendering the English value, and the Czech fallback resolving to English when Czech is empty.
- [x] A migration script moves existing text values into the English value. Running it twice is harmless.
- [x] The Studio and web app type-checks pass.

# 06: Singleton content-read modules

**What to build:** Site settings (read by the shared layout), the FAQ, Contacts, the Links page and the Privacy policy each read their Singleton through their own module. Each module owns its fallback: when the Singleton doesn't exist yet, the read returns an empty page shape, so pages no longer write their own fallback. The existing content rules move with their projections:

- the top banner shows only while enabled and before its "Hide after" date;
- FAQ topics without questions are dropped;
- Section contacts are listed unless the toggle is off;
- Links past their "Hide after" date are dropped.

Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The layout and the four Singleton pages import no query, result shape or `fetchContent`, and no page writes its own missing-Singleton fallback.
- [x] New page test: each Singleton page renders with its defaults when its Singleton doesn't exist yet.
- [x] Shell, FAQ, Contacts, Links and i18n tests pass unchanged; type checking passes.

## Comments

Done. Each Singleton has its own module in `apps/web/src/lib/`: `readSettings()` in `site-settings.ts`, `readFaq()` in `faq.ts`, `readContacts()` in `contacts.ts`, `readLinksPage()` in `links-page.ts` and `readPrivacyPolicy()` in `privacy-policy.ts`. Each read returns `{}` when its Singleton doesn't exist, so no page writes `?? {}` any more. The GROQ strings and their content-rule comments are unchanged. `types.ts` held only these page shapes, so it is gone. `queries.ts` now only re-exports `CONTACTS_QUERY`, `EVENT_QUERY` and `SECTION_QUERY` for the dropped-data test, which ticket 07 deals with. `missing-singletons.test.ts` renders the FAQ, Contacts, Links and Privacy policy pages, and the shell, with no documents at all.

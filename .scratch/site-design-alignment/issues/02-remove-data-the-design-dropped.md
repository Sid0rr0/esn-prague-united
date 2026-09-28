# 02: Remove data the design dropped

**What to build:** Editors stop seeing fields no page uses:

- **Event:** organisers ("Organised by").
- **Album:** Sections.
- **Contacts:** contact people, and the contact-person type with it.

The queries stop asking for them:

- The Event query drops organisers.
- The Section query drops the Section's events and albums.
- The Contacts query drops people.

Help text is corrected:

- The Featured event description no longer mentions a fallback card. It says that clearing the field returns the hero to ESN Prague United content.
- The FAQ topic examples become general topics (ESN card, Buddy programme, Joining ESN).

A one-off script unsets the removed fields in the existing dataset so no orphaned data stays behind.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The Studio no longer shows organisers on Event, Sections on Album, or people on Contacts. The contact-person type no longer exists.
- [ ] No query references organisers, Album sections, contact people, or a Section's events/albums.
- [ ] The Featured event and FAQ topic help text match the glossary in CONTEXT.md.
- [ ] A migration script unsets the removed fields. Running it twice is harmless, and it reports how many documents it changed.
- [ ] The Studio and web app type-checks pass.

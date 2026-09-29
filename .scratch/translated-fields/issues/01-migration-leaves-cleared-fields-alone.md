# 01: The text migration leaves fields cleared in both languages alone

**What to build:** The Studio's text migration uses the same "is translated" rule as the site (see `../spec.md`):

- A value is a translated field when it is labelled with one of the three translated field types, or holds a language key.
- It must hold nothing but language keys and Sanity's own keys.

A field an editor cleared in both languages is stored as just its type label. The migration then treats it as already translated and leaves it alone, instead of wrapping it a second time. Running the migration again stays harmless. This ticket touches the Studio only; the shared workspace comes in 02.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Migration test: a field cleared in both languages (only its type label) is left unchanged.
- [ ] Existing migration tests pass unchanged; the Studio type check passes.

# 01: Pull shared query pieces and shapes out of the queries and types modules

**What to build:** Prefactor for the content-read modules (see `../spec.md`). The GROQ pieces more than one page uses move into one shared pieces module:

- the image projection;
- "has ended" (an Event has ended once its end time has passed, or its start time when it has no end time);
- the ticket fields;
- the "Hide after" filter;
- the Album card and the Section summary;
- the list limits.

The shapes more than one page uses move into one shared shapes module:

- Sanity image, SEO, Socials, rich text;
- Price tier and the ticket fields;
- Event summary and card, Album summary, Section summary;
- FAQ entry.

The existing queries are rebuilt from the shared pieces, with identical output. No page changes, so visitors see nothing new.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Each shared GROQ piece is written once, in the shared pieces module, with its content rule as a comment.
- [ ] Each shared shape is defined once, in the shared shapes module.
- [ ] Every existing query produces the same result as before.
- [ ] All page tests pass unchanged; type checking passes.

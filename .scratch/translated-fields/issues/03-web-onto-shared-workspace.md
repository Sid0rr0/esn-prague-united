# 03: Move the web onto the translated-fields workspace

**What to build:** The site uses the shared translated-fields workspace from 02 (see `../spec.md`), and deletes its own copies:

- language resolution uses the shared languages, default language, type names, "is translated" and "is empty". Walking a query result and picking a language stays in the web.
- the test fixtures build translated values with the shared builders, so each field carries its real type label: single line, multi-line text or rich text, as the Studio stores it.

Czech still falls back to English per field, blank values still count as empty, and a field cleared in both languages still resolves to nothing. Visitors see exactly what they see today.

**Blocked by:** 02.

**Status:** ready-for-agent

- [ ] The web keeps no language list, type names, "is translated", "is empty" or translated-value builders of its own.
- [ ] Test fixtures label every translated field with its real type.
- [ ] Web page tests and the direct language-resolution tests pass with unchanged assertions; the web type check passes.

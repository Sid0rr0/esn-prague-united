# 01: Site shell, test harness and expiring top banner

**What to build:** Right now the web app is the blank Astro starter. Wire it to Sanity so every page renders inside the site shell: a header with the logo and main menu from Site settings, and a footer with the ESN Prague United name and socials. The header has no EN/CZ switch. The top banner from Site settings gets an optional "Hide after" date, using the same pattern and label as the Links page's visibility date. Visitors see the banner only while it's enabled and before that date.

This ticket also sets up the one test seam the spec defines, which every later ticket builds on:

1. Build a small in-memory set of Sanity documents as fixtures.
2. Run the real GROQ queries over it through `groq-js`, with `now()` pinned per test.
3. Render the page with Astro's Container API.
4. Assert on the HTML.

Vitest runs in the web app.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The web app fetches content from Sanity and renders a homepage inside the shared header/footer shell.
- [ ] The header shows the logo and the Site settings main menu. No language switch is rendered.
- [ ] All site copy and metadata name the organisation "ESN Prague United".
- [ ] Site settings has a "Hide after" date on the top banner in the Studio.
- [ ] A seam test shows the banner when it's enabled and before its "Hide after" date.
- [ ] A seam test hides the banner after its "Hide after" date.
- [ ] A seam test hides the banner when it's disabled.
- [ ] Vitest runs from the workspace, the seam helper is reusable by later tickets, and the web app's type-check passes.
